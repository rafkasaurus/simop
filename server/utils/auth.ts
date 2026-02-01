import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../database/schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

export const auth = betterAuth({
    database: drizzleAdapter(drizzle(postgres(process.env.DATABASE_URL!)), {
        provider: "pg",
        schema: {
            ...schema,
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        }
    }),
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    // Add role and irbanUnit to user session
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
                unique: true,
            },
            role: {
                type: "string",
                required: false,
                defaultValue: "operator",
            },
            irbanUnit: {
                type: "string",
                required: false,
            }
        }
    }
});

console.log('Auth configuration loaded');
