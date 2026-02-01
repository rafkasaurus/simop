import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        if (!process.env.DATABASE_URL) {
            throw createError({
                statusCode: 500,
                statusMessage: "DATABASE_URL not configured"
            });
        }

        const client = postgres(process.env.DATABASE_URL, { max: 1 });
        const db = drizzle(client);

        console.log("⚠️  RESETTING MIGRATION STATE - This will drop the migration tracking table");

        // Drop the drizzle schema which contains the migrations tracking table
        await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);

        console.log("✅ Migration state reset complete. You can now run /api/migrate again.");

        await client.end();

        return {
            success: true,
            message: "Migration state reset. Run /api/migrate to reapply migrations."
        };
    } catch (error: any) {
        console.error("Reset error:", error);
        throw createError({
            statusCode: 500,
            statusMessage: `Reset failed: ${error.message}`
        });
    }
});
