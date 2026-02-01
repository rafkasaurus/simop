import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { resolve } from "path";
import { existsSync, readdirSync } from "fs";

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

        // Resolve migrations folder path (works in both dev and production)
        const migrationsFolder = resolve(process.cwd(), "server/database/migrations");
        console.log("=== MIGRATION DEBUG INFO ===");
        console.log("Current working directory:", process.cwd());
        console.log("Migrations folder path:", migrationsFolder);
        console.log("Migrations folder exists:", existsSync(migrationsFolder));
        
        if (existsSync(migrationsFolder)) {
            const files = readdirSync(migrationsFolder);
            console.log("Files in migrations folder:", files);
            
            const metaFolder = resolve(migrationsFolder, "meta");
            console.log("Meta folder exists:", existsSync(metaFolder));
            
            if (existsSync(metaFolder)) {
                const metaFiles = readdirSync(metaFolder);
                console.log("Files in meta folder:", metaFiles);
            }
        }

        // Run migrations
        console.log("Starting migration...");
        await migrate(db, { migrationsFolder });
        console.log("Migration completed successfully");

        // Close connection
        await migrationClient.end();

        return {
            success: true,
            message: "Database migration completed successfully",
            debug: {
                migrationsFolder,
                folderExists: existsSync(migrationsFolder),
                files: existsSync(migrationsFolder) ? readdirSync(migrationsFolder) : []
            }
        };
    } catch (error: any) {
        console.error("=== MIGRATION ERROR ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw createError({
            statusCode: 500,
            statusMessage: `Migration failed: ${error.message}`
        });
    }
});
