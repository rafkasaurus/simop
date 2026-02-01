import { useDrizzle } from "~~/server/utils/drizzle";
import { pkptPrograms, users } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
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

        // Sample programs with new format: PKPT-{IRBAN-XX}-XX
        const samplePrograms = [
            {
                kodeProgram: "PKPT-IRBAN1-01",
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
            {
                kodeProgram: "PKPT-IRBAN2-01",
                namaKegiatan: "Review Pelaksanaan Anggaran",
                irbanPj: "irban2",
                objekPengawasan: "Dinas Kesehatan",
                jenisPengawasan: "regular",
                tglMulai: "2024-02-01",
                tglSelesai: "2024-03-01",
                status: "pelaksanaan",
                progresPersen: 60,
                isPublished: true,
                isSecret: false,
                createdById: creatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                kodeProgram: "PKPT-IRBAN3-01",
                namaKegiatan: "Investigasi Kasus Khusus",
                irbanPj: "irban3",
                objekPengawasan: "BPKAD",
                jenisPengawasan: "riksus",
                tglMulai: "2024-03-01",
                tglSelesai: "2024-04-30",
                status: "perencanaan",
                progresPersen: 25,
                isPublished: false,
                isSecret: true,
                createdById: creatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        // Insert sample data
        const inserted = await db.insert(pkptPrograms)
            .values(samplePrograms)
            .returning();

        return {
            success: true,
            message: `${inserted.length} sample programs created successfully!`,
            programs: inserted,
            note: "Format kode: PKPT-{IRBAN}-{NO}"
        };
    } catch (error: any) {
        console.error('Seed data error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
});
