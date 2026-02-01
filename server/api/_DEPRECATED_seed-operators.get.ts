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

    // Original buggy code (commented out) - DO NOT USE
    /*
    try {
        const db = useDrizzle();

        // Define 4 operator users: irban1, irban2, irban3, irbansus (Irban Khusus)
        const operatorUsers = [
            {
                id: `user_operator1_${Date.now()}`,
                name: "Operator Irban 1",
                username: "operator1",
                email: "operator1@simop.local",
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "operator",
                irbanUnit: "irban1"
            },
            // ... more operators
        ];

        // Check if operators already exist
        const existingOperators = [];
        for (const operator of operatorUsers) {
            const existing = await db.select()
                .from(users)
                .where(eq(users.username, operator.username))
                .limit(1);

            if (existing && existing.length > 0) {
                existingOperators.push(operator.username);
            }
        }

        if (existingOperators.length > 0) {
            return {
                success: false,
                message: `Some operators already exist: ${existingOperators.join(', ')}`,
                existingOperators
            };
        }

        // Insert operator users
        const inserted = await db.insert(users)
            .values(operatorUsers)
            .returning();

        return {
            success: true,
            message: `${inserted.length} operator users created successfully!`,
            operators: inserted.map(op => ({
                username: op.username,
                email: op.email,
                role: op.role,
                irbanUnit: op.irbanUnit,
                defaultPassword: "password123"
            })),
            note: "Users created without passwords. Use Better Auth registration or set passwords manually.",
        };
    } catch (error: any) {
        console.error('Seed operators error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
    */
});
