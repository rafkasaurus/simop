import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

export default defineEventHandler(async (event) => {
    try {
        // Check if database URL exists
        if (!process.env.DATABASE_URL) {
            throw createError({
                statusCode: 500,
                statusMessage: "DATABASE_URL not configured"
            });
        }

        // Create connection for migration
        const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
        const db = drizzle(migrationClient);

        // Run migrations
        await migrate(db, { migrationsFolder: "./server/database/migrations" });

        // Close connection
        await migrationClient.end();

        return {
            success: true,
            message: "Database migration completed successfully"
        };
    } catch (error: any) {
        console.error("Migration error:", error);
        throw createError({
            statusCode: 500,
            statusMessage: `Migration failed: ${error.message}`
        });
    }
});
