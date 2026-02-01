import { useDrizzle } from "~~/server/utils/drizzle";
import { pkptPrograms } from "~~/server/database/schema";
import { auth } from "~~/server/utils/auth";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        // Get session
        const session = await auth.api.getSession({ headers: event.headers });

        if (!session) {
            throw createError({
                statusCode: 401,
                message: "Unauthorized. Please login."
            });
        }

        const db = useDrizzle();
        const user = session.user as any;
        const userRole = user.role;
        const userIrban = user.irbanUnit;

        // Admin sees ALL programs
        // Operator sees only their IRBAN programs
        let programs;

        if (userRole === 'admin') {
            // Admin: all programs
            programs = await db.select()
                .from(pkptPrograms)
                .orderBy(desc(pkptPrograms.createdAt));
        } else {
            // Operator: only their irban
            programs = await db.select()
                .from(pkptPrograms)
                .where(eq(pkptPrograms.irbanPj, userIrban))
                .orderBy(desc(pkptPrograms.createdAt));
        }

        return programs;
    } catch (error: any) {
        console.error('Error fetching programs:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to fetch programs"
        });
    }
});
