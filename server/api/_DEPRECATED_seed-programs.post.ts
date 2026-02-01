/**
 * @deprecated This endpoint is DEPRECATED
 * Use POST /api/seed/init instead
 * 
 * This file creates a small sample of programs.
 * The new init endpoint creates a more complete dataset (30 programs).
 * 
 * This file is kept for reference only.
 */

import { useDrizzle } from "~~/server/utils/drizzle";
import { pkptPrograms, users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    return {
        deprecated: true,
        message: "This endpoint is deprecated. Please use POST /api/seed/init instead.",
        reason: "The new init endpoint provides a more comprehensive dataset with 30 programs across all Irban units."
    };

    // Original code (commented out):
    /*
    try {
        const db = useDrizzle();

        // Get first user as creator
        const firstUser = await db.select()
            .from(users)
            .limit(1);

        if (!firstUser || firstUser.length === 0 || !firstUser[0]) {
            return {
                success: false,
                message: "No users found. Create a user first."
            };
        }

        const creatorId = firstUser[0].id;

        // Sample programs
        const samplePrograms = [
            {
                kodeProgram: "PKPT-001-2024",
                namaKegiatan: "Audit Keuangan Daerah",
                irbanPj: "irban1",
                objekPengawasan: "Dinas Pendidikan",
                jenisPengawasan: "regular",
                tglMulai: "2024-01-15",
                tglSelesai: "2024-02-15",
                status: "selesai",
                progresPersen: 100,
                isPublished: true,
                isSecret: false,
                createdById: creatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // ... more programs
        ];

        // Insert sample data
        const inserted = await db.insert(pkptPrograms)
            .values(samplePrograms)
            .returning();

        return {
            success: true,
            message: `${inserted.length} sample programs created successfully!`,
            programs: inserted
        };
    } catch (error: any) {
        console.error('Seed data error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
    */
});
