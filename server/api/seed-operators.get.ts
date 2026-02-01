import { useDrizzle } from "~~/server/utils/drizzle";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();

        // Define 3 operator users, one for each IRBAN
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
            {
                id: `user_operator2_${Date.now() + 1}`,
                name: "Operator Irban 2",
                username: "operator2",
                email: "operator2@simop.local",
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "operator",
                irbanUnit: "irban2"
            },
            {
                id: `user_operator3_${Date.now() + 2}`,
                name: "Operator Irban 3",
                username: "operator3",
                email: "operator3@simop.local",
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "operator",
                irbanUnit: "irban3"
            }
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
            credentials: [
                {
                    username: "operator1",
                    email: "operator1@simop.local",
                    irban: "irban1",
                    defaultPassword: "password123 (needs to be set via auth)"
                },
                {
                    username: "operator2",
                    email: "operator2@simop.local",
                    irban: "irban2",
                    defaultPassword: "password123 (needs to be set via auth)"
                },
                {
                    username: "operator3",
                    email: "operator3@simop.local",
                    irban: "irban3",
                    defaultPassword: "password123 (needs to be set via auth)"
                }
            ]
        };
    } catch (error: any) {
        console.error('Seed operators error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
});
