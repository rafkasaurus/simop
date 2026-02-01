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

        // Generate 40 programs: 10 per IRBAN (irban1, irban2, irban3, irbansus)
        const samplePrograms: any[] = [];
        const statuses = ['perencanaan', 'pelaksanaan', 'selesai'] as const;
        const jenisPengawasanTypes = ['regular', 'riksus'] as const;
        const irbanUnits = ['irban1', 'irban2', 'irban3', 'irbansus'] as const;
        const objekList = [
            'Dinas Pendidikan', 'Dinas Kesehatan', 'BPKAD', 'Dinas PU',
            'Dinas Perhubungan', 'Dinas Sosial', 'BPBD', 'Dinas Pariwisata',
            'Dinas Pertanian', 'Dinas Perikanan', 'Sekretariat Daerah',
            'DPRD', 'Bappeda', 'BKD', 'Inspektorat'
        ];
        const kegiatanPrefixes = [
            'Audit Keuangan', 'Review Anggaran', 'Evaluasi Program',
            'Monitoring Kegiatan', 'Pemeriksaan Reguler', 'Investigasi',
            'Verifikasi Data', 'Asistensi', 'Konsultasi', 'Supervisi'
        ];

        let globalIndex = 0;

        // Generate 10 programs for each IRBAN
        for (const irban of irbanUnits) {
            // Handle irbansus differently (no number)
            let kodeIrban: string;
            if (irban === 'irbansus') {
                kodeIrban = 'IRBANSUS';
            } else {
                const irbanNo = parseInt(irban.replace('irban', ''));
                kodeIrban = `IRBAN${irbanNo}`;
            }

            // Generate 10 programs for this IRBAN
            for (let programNo = 1; programNo <= 10; programNo++) {
                globalIndex++;
                const noProgram = String(programNo).padStart(2, '0');

                // Random dates in Jan-Feb 2026
                const month = globalIndex <= 20 ? 1 : 2; // First 20 in Jan, rest in Feb
                const startDay = Math.floor(Math.random() * 20) + 1;
                const duration = Math.floor(Math.random() * 20) + 10; // 10-30 days
                const endDay = Math.min(startDay + duration, month === 1 ? 31 : 28);

                const tglMulai = `2026-${String(month).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
                const tglSelesai = `2026-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const jenisPengawasan = jenisPengawasanTypes[Math.floor(Math.random() * jenisPengawasanTypes.length)];
                const objek = objekList[Math.floor(Math.random() * objekList.length)];
                const kegiatan = kegiatanPrefixes[Math.floor(Math.random() * kegiatanPrefixes.length)];

                // Progress based on status
                let progres = 0;
                if (status === 'selesai') progres = 100;
                else if (status === 'pelaksanaan') progres = Math.floor(Math.random() * 60) + 30;
                else progres = Math.floor(Math.random() * 30);

                // Most programs are public, only some riksus are secret
                const isSecret = jenisPengawasan === 'riksus' && Math.random() > 0.7;

                samplePrograms.push({
                    kodeProgram: `PKPT-${kodeIrban}-${noProgram}`,
                    namaKegiatan: `${kegiatan} ${objek}`,
                    irbanPj: irban,
                    objekPengawasan: objek,
                    jenisPengawasan: jenisPengawasan,
                    tglMulai: tglMulai,
                    tglSelesai: tglSelesai,
                    status: status,
                    progresPersen: progres,
                    isPublished: true,
                    isSecret: isSecret,
                    createdById: creatorId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }

        // Insert sample data
        const inserted = await db.insert(pkptPrograms)
            .values(samplePrograms)
            .returning();

        return {
            success: true,
            message: `${inserted.length} sample programs created successfully!`,
            totalPrograms: inserted.length,
            breakdown: {
                byStatus: {
                    perencanaan: inserted.filter(p => p.status === 'perencanaan').length,
                    pelaksanaan: inserted.filter(p => p.status === 'pelaksanaan').length,
                    selesai: inserted.filter(p => p.status === 'selesai').length,
                },
                byType: {
                    regular: inserted.filter(p => p.jenisPengawasan === 'regular').length,
                    riksus: inserted.filter(p => p.jenisPengawasan === 'riksus').length,
                },
                visibility: {
                    public: inserted.filter(p => !p.isSecret).length,
                    secret: inserted.filter(p => p.isSecret).length,
                }
            },
            note: "Format kode: PKPT-IRBAN#-## | Data spread across Jan-Feb 2026"
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
