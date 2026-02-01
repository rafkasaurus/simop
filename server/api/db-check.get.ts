import { useDrizzle } from "~~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();

        // Check if tables exist
        const result = await db.execute(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        // Count records in each table
        const userCount = await db.execute(`SELECT COUNT(*) FROM "user"`);
        const programCount = await db.execute(`SELECT COUNT(*) FROM "pkpt_program"`);

        return {
            success: true,
            tables: result.rows,
            counts: {
                users: userCount.rows[0]?.count || 0,
                programs: programCount.rows[0]?.count || 0,
            },
            message: "Database is connected and tables exist!"
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
});
