import { auth } from "~~/server/utils/auth";
import { users } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const user = session.user as any;
    
    // Only admin can update users
    if (user.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: "Forbidden - Admin access required" });
    }

    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: "User ID required" });
    }

    const db = useDrizzle();

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!existingUser) {
        throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    // Prevent admin from demoting themselves if they're the only admin
    if (existingUser.role === 'admin' && body.role === 'operator') {
        const adminCount = await db.query.users.findMany({
            where: eq(users.role, 'admin'),
        });
        if (adminCount.length <= 1) {
            throw createError({ statusCode: 400, statusMessage: "Cannot demote the only admin" });
        }
    }

    // Update user
    const updated = await db.update(users)
        .set({
            name: body.name,
            role: body.role,
            irbanUnit: body.irbanUnit,
            updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

    return updated[0];
});
