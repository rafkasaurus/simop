import { useDrizzle } from "~~/server/utils/drizzle";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();

        // Check if admin already exists
        const existingAdmin = await db.query.users.findFirst({
            where: eq(users.username, 'admin')
        });

        if (existingAdmin) {
            return {
                success: false,
                message: "Admin user already exists",
                user: {
                    id: existingAdmin.id,
                    username: existingAdmin.username,
                    name: existingAdmin.name,
                    role: existingAdmin.role
                }
            };
        }

        // Create admin user
        // NOTE: Password will be hashed by better-auth during registration
        // This is just creating the user record
        const adminUser = await db.insert(users).values({
            id: `user_${Date.now()}`,
            name: "Administrator",
            username: "admin",
            email: "admin@simop.local",
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: "admin",
            irbanUnit: null
        }).returning();

        return {
            success: true,
            message: "Admin user created successfully!",
            user: adminUser[0],
            note: "Please set password via registration/auth system"
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
});
