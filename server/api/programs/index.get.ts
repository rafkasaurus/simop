import { auth } from "~~/server/utils/auth";
import { pkptPrograms } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { desc, eq, and, or } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const query = getQuery(event);
    const user = session.user as any;
    const db = useDrizzle();

    // Filtering logic
    // If operator, only show programs for their irban unit
    // If admin, show all (or filter by specific irban if requested)
    let whereClause;

    if (user.role === 'admin') {
        const targetIrban = query.irbanPj as string;
        if (targetIrban) {
            whereClause = eq(pkptPrograms.irbanPj, targetIrban);
        }
    } else {
        whereClause = eq(pkptPrograms.irbanPj, user.irbanUnit);
    }

    const programs = await db.query.pkptPrograms.findMany({
        where: whereClause,
        orderBy: [desc(pkptPrograms.createdAt)],
    });

    return programs;
});
