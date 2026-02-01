import { useDrizzle } from "~~/server/utils/drizzle";
import { sql } from "drizzle-orm";
import { users, pkptPrograms } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();

        // Check if tables exist using information_schema
        const tablesQuery = sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `;

        const tablesResult = await db.execute(tablesQuery);

        // Count records using proper Drizzle queries
        const userCountResult = await db.select({ count: sql<number>`count(*)::int` }).from(users);
        const programCountResult = await db.select({ count: sql<number>`count(*)::int` }).from(pkptPrograms);

        return {
            success: true,
            tables: tablesResult,
            counts: {
                users: userCountResult[0]?.count || 0,
                programs: programCountResult[0]?.count || 0,
            },
            message: "Database is connected and tables exist!"
        };
    } catch (error: any) {
        console.error('Database check error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
});
