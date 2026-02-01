import { auth } from "~~/server/utils/auth";
import { pkptPrograms } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    if (!id) throw createError({ statusCode: 400, statusMessage: "ID required" });

    const user = session.user as any;
    const db = useDrizzle();

    // 1. Check existence and authorization
    const existing = await db.query.pkptPrograms.findFirst({
        where: eq(pkptPrograms.id, parseInt(id)),
    });

    if (!existing) {
        throw createError({ statusCode: 404, statusMessage: "Program not found" });
    }

    if (user.role !== 'admin' && existing.irbanPj !== user.irbanUnit) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    // 2. Perform update
    // Note: We don't usually allow updating kodeProgram as it's auto-generated
    // Also filter out isSecret for operators (only admin can set secret status)
    const { kodeProgram, createdById, ...updateData } = body;
    
    // Only admin can change isSecret status
    if (user.role !== 'admin' && updateData.isSecret !== undefined) {
        delete updateData.isSecret;
    }

    const updated = await db.update(pkptPrograms)
        .set({
            ...updateData,
            updatedAt: new Date()
        })
        .where(eq(pkptPrograms.id, parseInt(id)))
        .returning();

    return updated[0];
});
