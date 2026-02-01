import { pkptPrograms, users } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const db = useDrizzle();

    // 1. Get an admin user ID to assign as creator
    const adminUser = await db.query.users.findFirst();
    if (!adminUser) {
        return { message: "No users found. Please login/sign-up first." };
    }

    // 2. Clear existing programs (Optional: comment out if you want to append)
    await db.delete(pkptPrograms);

    // Helper function to create dates in 2026
    const d = (month: number, day: number) => new Date(2026, month - 1, day).toISOString();

    // 3. Define 30 seed data for January - February 2026
    const seedData = [
        // ===== IRBAN 1 - Programs (8 items) =====
        {
            kodeProgram: 'PKPT-IRBAN1-001',
            namaKegiatan: 'Audit Kinerja Dinas Pendidikan Tahun 2025',
            irbanPj: 'irban1',
            objekPengawasan: 'Dinas Pendidikan Kabupaten',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 5),
            tglSelesai: d(1, 25),
            status: 'selesai',
            progresPersen: 100,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-002',
            namaKegiatan: 'Reviu Laporan Keuangan Dinas Kesehatan',
            irbanPj: 'irban1',
            objekPengawasan: 'Dinas Kesehatan',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 10),
            tglSelesai: d(2, 5),
            status: 'pelaksanaan',
            progresPersen: 65,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-003',
            namaKegiatan: 'Evaluasi Pengelolaan Bantuan Pangan',
            irbanPj: 'irban1',
            objekPengawasan: 'Dinas Sosial',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 15),
            tglSelesai: d(2, 10),
            status: 'pelaksanaan',
            progresPersen: 45,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-004',
            namaKegiatan: 'Pemeriksaan Khusus Dugaan Korupsi Proyek Jalan',
            irbanPj: 'irban1',
            objekPengawasan: 'Dinas PUPR',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 20),
            tglSelesai: d(2, 28),
            status: 'pelaksanaan',
            progresPersen: 30,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-005',
            namaKegiatan: 'Monitoring Dana BOS Triwulan I',
            irbanPj: 'irban1',
            objekPengawasan: 'SD Negeri Se-Kecamatan A',
            jenisPengawasan: 'regular',
            tglMulai: d(2, 1),
            tglSelesai: d(2, 15),
            status: 'perencanaan',
            progresPersen: 0,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-006',
            namaKegiatan: 'Audit Sistem Pengendalian Intern Pemerintah',
            irbanPj: 'irban1',
            objekPengawasan: 'Dinas Perdagangan',
            jenisPengawasan: 'regular',
            tglMulai: d(2, 5),
            tglSelesai: d(2, 25),
            status: 'perencanaan',
            progresPersen: 0,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-007',
            namaKegiatan: 'Reviu Kinerja Pengelolaan Keuangan Desa',
            irbanPj: 'irban1',
            objekPengawasan: 'Desa Mulyo Rejo',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 8),
            tglSelesai: d(1, 20),
            status: 'selesai',
            progresPersen: 100,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN1-008',
            namaKegiatan: 'Tindak Lanjut Rekomendasi Tahun Lalu',
            irbanPj: 'irban1',
            objekPengawasan: 'Dinas Pertanian',
            jenisPengawasan: 'regular',
            tglMulai: d(2, 10),
            tglSelesai: d(2, 20),
            status: 'perencanaan',
            progresPersen: 10,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },

        // ===== IRBAN 2 - Programs (8 items) =====
        {
            kodeProgram: 'PKPT-IRBAN2-001',
            namaKegiatan: 'Audit Kinerja Dinas Perhubungan',
            irbanPj: 'irban2',
            objekPengawasan: 'Dinas Perhubungan',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 6),
            tglSelesai: d(1, 30),
            status: 'selesai',
            progresPersen: 100,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-002',
            namaKegiatan: 'Reviu Laporan Keuangan BPKAD',
            irbanPj: 'irban2',
            objekPengawasan: 'BPKAD Kabupaten',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 12),
            tglSelesai: d(2, 10),
            status: 'pelaksanaan',
            progresPersen: 55,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-003',
            namaKegiatan: 'Pemeriksaan Khusus Dugaan Penyalahgunaan Anggaran',
            irbanPj: 'irban2',
            objekPengawasan: 'Dinas Kebudayaan dan Pariwisata',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 25),
            tglSelesai: d(2, 28),
            status: 'pelaksanaan',
            progresPersen: 25,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-004',
            namaKegiatan: 'Evaluasi Program Bantuan Modal Usaha',
            irbanPj: 'irban2',
            objekPengawasan: 'Dinas Koperasi dan UMKM',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 15),
            tglSelesai: d(2, 5),
            status: 'pelaksanaan',
            progresPersen: 70,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-005',
            namaKegiatan: 'Monitoring Penggunaan Dana Desa Tahap I',
            irbanPj: 'irban2',
            objekPengawasan: 'Desa Sejahtera',
            jenisPengawasan: 'regular',
            tglMulai: d(2, 3),
            tglSelesai: d(2, 18),
            status: 'perencanaan',
            progresPersen: 0,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-006',
            namaKegiatan: 'Audit Investigatif Proyek Pembangunan Pasar',
            irbanPj: 'irban2',
            objekPengawasan: 'PD Pasar Makmur',
            jenisPengawasan: 'riksus',
            tglMulai: d(2, 1),
            tglSelesai: d(2, 29),
            status: 'perencanaan',
            progresPersen: 5,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-007',
            namaKegiatan: 'Reviu Realisasi APBD Perubahan',
            irbanPj: 'irban2',
            objekPengawasan: 'Bagian Keuangan Setda',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 20),
            tglSelesai: d(2, 15),
            status: 'pelaksanaan',
            progresPersen: 40,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN2-008',
            namaKegiatan: 'Evaluasi Kinerja BLUD RSUD',
            irbanPj: 'irban2',
            objekPengawasan: 'RSUD Kabupaten',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 10),
            tglSelesai: d(1, 28),
            status: 'selesai',
            progresPersen: 100,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },

        // ===== IRBAN 3 - Programs (7 items) =====
        {
            kodeProgram: 'PKPT-IRBAN3-001',
            namaKegiatan: 'Audit Kinerja Dinas Lingkungan Hidup',
            irbanPj: 'irban3',
            objekPengawasan: 'Dinas Lingkungan Hidup',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 8),
            tglSelesai: d(1, 28),
            status: 'selesai',
            progresPersen: 100,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN3-002',
            namaKegiatan: 'Reviu Program Pengelolaan Sampah',
            irbanPj: 'irban3',
            objekPengawasan: 'DLH & PD Kebersihan',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 15),
            tglSelesai: d(2, 10),
            status: 'pelaksanaan',
            progresPersen: 50,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN3-003',
            namaKegiatan: 'Pemeriksaan Khusus Dugaan Korupsi Proyek IPLT',
            irbanPj: 'irban3',
            objekPengawasan: 'Dinas PUPR - Proyek IPLT',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 22),
            tglSelesai: d(2, 28),
            status: 'pelaksanaan',
            progresPersen: 35,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN3-004',
            namaKegiatan: 'Monitoring Kegiatan Rehabilitasi Hutan',
            irbanPj: 'irban3',
            objekPengawasan: 'Dinas Kehutanan',
            jenisPengawasan: 'regular',
            tglMulai: d(2, 5),
            tglSelesai: d(2, 20),
            status: 'perencanaan',
            progresPersen: 0,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN3-005',
            namaKegiatan: 'Evaluasi Kinerja Dinas Perikanan',
            irbanPj: 'irban3',
            objekPengawasan: 'Dinas Perikanan',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 5),
            tglSelesai: d(1, 25),
            status: 'selesai',
            progresPersen: 100,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN3-006',
            namaKegiatan: 'Audit Sistem Pengelolaan Perkebunan',
            irbanPj: 'irban3',
            objekPengawasan: 'Dinas Perkebunan',
            jenisPengawasan: 'regular',
            tglMulai: d(2, 8),
            tglSelesai: d(2, 25),
            status: 'perencanaan',
            progresPersen: 0,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBAN3-007',
            namaKegiatan: 'Reviu Laporan Pertanggungjawaban Kepala Dinas',
            irbanPj: 'irban3',
            objekPengawasan: 'Dinas Peternakan',
            jenisPengawasan: 'regular',
            tglMulai: d(1, 18),
            tglSelesai: d(2, 8),
            status: 'pelaksanaan',
            progresPersen: 60,
            isPublished: true,
            isSecret: false,
            createdById: adminUser.id
        },

        // ===== IRBAN SUS - Programs (7 items) =====
        {
            kodeProgram: 'PKPT-IRBANSUS-001',
            namaKegiatan: 'Pemeriksaan Khusus Dugaan Korupsi Proyek Jembatan',
            irbanPj: 'irbansus',
            objekPengawasan: 'Dinas PUPR - Proyek Jembatan',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 5),
            tglSelesai: d(2, 28),
            status: 'pelaksanaan',
            progresPersen: 40,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBANSUS-002',
            namaKegiatan: 'Audit Investigatif Penyalahgunaan Dana Bencana',
            irbanPj: 'irbansus',
            objekPengawasan: 'BPBD Kabupaten',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 12),
            tglSelesai: d(2, 15),
            status: 'pelaksanaan',
            progresPersen: 55,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBANSUS-003',
            namaKegiatan: 'Pemeriksaan Khusus Dugaan Suap Pengurusan Izin',
            irbanPj: 'irbansus',
            objekPengawasan: 'Dinas Penanaman Modal',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 20),
            tglSelesai: d(2, 20),
            status: 'pelaksanaan',
            progresPersen: 30,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBANSUS-004',
            namaKegiatan: 'Audit Khusus Kecurangan Pengadaan Barang Jasa',
            irbanPj: 'irbansus',
            objekPengawasan: 'LPSE Kabupaten',
            jenisPengawasan: 'riksus',
            tglMulai: d(2, 1),
            tglSelesai: d(2, 29),
            status: 'perencanaan',
            progresPersen: 10,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBANSUS-005',
            namaKegiatan: 'Pengawasan Lanjutan Kasus Tahun Lalu',
            irbanPj: 'irbansus',
            objekPengawasan: 'Dinas Pendidikan',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 8),
            tglSelesai: d(1, 30),
            status: 'selesai',
            progresPersen: 100,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBANSUS-006',
            namaKegiatan: 'Pemeriksaan Dugaan Korupsi Dana Hibah',
            irbanPj: 'irbansus',
            objekPengawasan: 'Kementerian Agama Cabang',
            jenisPengawasan: 'riksus',
            tglMulai: d(2, 5),
            tglSelesai: d(2, 25),
            status: 'perencanaan',
            progresPersen: 0,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        },
        {
            kodeProgram: 'PKPT-IRBANSUS-007',
            namaKegiatan: 'Audit Investigatif Asset Daerah',
            irbanPj: 'irbansus',
            objekPengawasan: 'Dinas Perumahan dan Permukiman',
            jenisPengawasan: 'riksus',
            tglMulai: d(1, 15),
            tglSelesai: d(2, 10),
            status: 'pelaksanaan',
            progresPersen: 45,
            isPublished: false,
            isSecret: true,
            createdById: adminUser.id
        }
    ];

    // 4. Insert data
    await db.insert(pkptPrograms).values(seedData);

    return { 
        success: true, 
        count: seedData.length, 
        message: "30 Programs seeded successfully for January-February 2026",
        breakdown: {
            irban1: seedData.filter(p => p.irbanPj === 'irban1').length,
            irban2: seedData.filter(p => p.irbanPj === 'irban2').length,
            irban3: seedData.filter(p => p.irbanPj === 'irban3').length,
            irbansus: seedData.filter(p => p.irbanPj === 'irbansus').length,
            riksus: seedData.filter(p => p.jenisPengawasan === 'riksus').length,
            regular: seedData.filter(p => p.jenisPengawasan === 'regular').length,
            secret: seedData.filter(p => p.isSecret).length,
            published: seedData.filter(p => p.isPublished).length
        }
    };
});
