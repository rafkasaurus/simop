/**
 * @deprecated This endpoint is DEPRECATED
 * Use POST /api/seed/init instead
 * 
 * CRITICAL BUG: This file creates user records directly in the database
 * WITHOUT creating corresponding account records with passwords.
 * Users created this way CANNOT LOGIN!
 * 
 * This file is kept for reference only.
 */

import { useDrizzle } from "~~/server/utils/drizzle";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    return {
        deprecated: true,
        message: "This endpoint is deprecated. Please use POST /api/seed/init instead.",
        reason: "This creates users without passwords, making them unable to login. Use the new init endpoint which properly sets up authentication."
    };

    // Original buggy code (commented out):
    /*
    try {
        const db = useDrizzle();

        // Check if admin already exists
        const existingAdmins = await db.select()
            .from(users)
            .where(eq(users.username, 'admin'))
            .limit(1);

        const existingAdmin = existingAdmins[0];

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
        console.error('Seed admin error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
    */
});
