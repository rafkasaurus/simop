import { auth } from "~~/server/utils/auth";
import { users, accounts } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { generateId } from "better-auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
}

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const user = session.user as any;
    
    // Only admin can create users
    if (user.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: "Forbidden - Admin access required" });
    }

    const body = await readBody(event);
    const { username, password, name, role, irbanUnit } = body;

    // Validation
    if (!username || !password || !name) {
        throw createError({ statusCode: 400, statusMessage: "Username, password, and name are required" });
    }

    if (password.length < 6) {
        throw createError({ statusCode: 400, statusMessage: "Password must be at least 6 characters" });
    }

    const db = useDrizzle();

    // Check if username already exists
    const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username)
    });

    if (existingUser) {
        throw createError({ statusCode: 400, statusMessage: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const userId = generateId();
    const newUser = await db.insert(users).values({
        id: userId,
        username,
        name,
        email: `${username}@internal.local`, // Dummy email for internal use
        emailVerified: true,
        role: role || 'operator',
        irbanUnit: irbanUnit || null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    // Store password in accounts table
    await db.insert(accounts).values({
        id: generateId(),
        accountId: userId,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {
        success: true,
        user: newUser[0]
    };
});
