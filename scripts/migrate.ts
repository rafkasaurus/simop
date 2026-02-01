import 'dotenv/config';
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { resolve } from "path";
import { existsSync } from "fs";

async function runMigrations() {
    try {
        console.log("🚀 Starting database migrations...");
        
        // Check if database URL exists
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable is not set");
        }

        console.log("📦 Connecting to database...");
        // Create connection for migration with max 1 connection
        const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
        const db = drizzle(migrationClient);

        // Resolve migrations folder path
        const migrationsFolder = resolve(process.cwd(), "server/database/migrations");
        
        console.log("📂 Migrations folder:", migrationsFolder);
        console.log("📂 Folder exists:", existsSync(migrationsFolder));

        if (!existsSync(migrationsFolder)) {
            throw new Error(`Migrations folder not found at: ${migrationsFolder}`);
        }

        // Run migrations
        console.log("⚙️  Running migrations...");
        await migrate(db, { migrationsFolder });
        
        console.log("✅ Migrations completed successfully!");
        
        // Close connection
        await migrationClient.end();
        
        process.exit(0);
    } catch (error: any) {
        console.error("❌ Migration failed:");
        console.error(error);
        process.exit(1);
    }
}

runMigrations();
