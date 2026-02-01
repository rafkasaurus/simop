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

        // Check if drizzle schema exists
        const schemas = await db.execute(sql`
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name = 'drizzle'
        `);

        let migrationsTable = null;
        let appliedMigrations: any[] = [];
        
        if (schemas.length > 0) {
            // Check migrations table
            migrationsTable = await db.execute(sql`
                SELECT * FROM drizzle.__drizzle_migrations
                ORDER BY created_at
            `);
            appliedMigrations = migrationsTable;
        }

        // Check what tables exist in public schema
        const tables = await db.execute(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        await client.end();

        return {
            success: true,
            drizzleSchemaExists: schemas.length > 0,
            appliedMigrations: appliedMigrations,
            publicTables: tables.map((t: any) => t.table_name)
        };
    } catch (error: any) {
        console.error("Status check error:", error);
        throw createError({
            statusCode: 500,
            statusMessage: `Status check failed: ${error.message}`
        });
    }
});
