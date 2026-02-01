import { auth } from "~~/server/utils/auth";
import { pkptPrograms } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const body = await readBody(event);
    if (!body || !body.namaKegiatan) {
        throw createError({ statusCode: 400, statusMessage: "Invalid input: namaKegiatan is required" });
    }
    const user = session.user as any;

    // 1. Determine Irban Unit
    let targetIrban = body.irbanPj;
    if (user.role === 'operator') {
        targetIrban = user.irbanUnit; // Force according to login unit
    }

    // 2. Mapping Prefix
    const irbanCodeMap: Record<string, string> = {
        'irban1': 'IRBAN1',
        'irban2': 'IRBAN2',
        'irban3': 'IRBAN3',
        'irbansus': 'IRBANSUS',
        'sekretariat': 'SEKRET'
    };

    const codePrefix = `PKPT-${irbanCodeMap[targetIrban] || 'GEN'}-`;

    // 3. Find last sequence number for this prefix
    const db = useDrizzle();
    const lastProgram = await db.query.pkptPrograms.findFirst({
        where: (t, { like }) => like(t.kodeProgram, `${codePrefix}%`),
        orderBy: [desc(pkptPrograms.kodeProgram)]
    });

    // 4. Calculate New Number
    let newSequence = 1;
    if (lastProgram) {
        const lastSeqStr = lastProgram.kodeProgram.split('-').pop();
        const lastSeqNum = parseInt(lastSeqStr || '0');
        newSequence = lastSeqNum + 1;
    }

    // 5. Format New Code
    const newKodeProgram = `${codePrefix}${String(newSequence).padStart(3, '0')}`;

    // 6. Save to DB
    const newProgram = await db.insert(pkptPrograms).values({
        ...body,
        irbanPj: targetIrban,
        kodeProgram: newKodeProgram,
        createdById: user.id
    }).returning();

    return newProgram[0];
});
