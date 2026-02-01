import { pkptPrograms } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { desc, eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const db = useDrizzle();

    // Public API only fetches published AND non-secret programs
    // isPublished = true AND isSecret = false
    const programs = await db.query.pkptPrograms.findMany({
        where: and(
            eq(pkptPrograms.isPublished, true),
            eq(pkptPrograms.isSecret, false)
        ),
        orderBy: [desc(pkptPrograms.createdAt)],
    });

    return programs;
});
