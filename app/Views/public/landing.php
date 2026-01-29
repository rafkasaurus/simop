<!DOCTYPE html>
<html lang="id" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi Manajemen Objek Pengawasan - si-MOP</title>
    <link href="<?= base_url('css/style.css') ?>" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body class="bg-gray-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <nav class="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span class="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                        <span class="font-bold text-xl tracking-tight text-slate-900">si-MOP</span>
                        <span
                            class="hidden sm:inline-block text-xs text-slate-500 ml-2 border-l pl-2 border-slate-300">Inspektorat
                            Daerah</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="<?= base_url('login') ?>"
                        class="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Login
                        Pegawai</a>
                    <a href="#data-pengawasan" class="btn btn-primary text-sm shadow-none">Lihat Data</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-white">
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50/50"></div>
            <!-- Decorative blobs -->
            <div
                class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl opacity-70 animate-pulse">
            </div>
            <div
                class="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-indigo-100/50 blur-3xl opacity-70">
            </div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <span
                class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-6 border border-blue-100">
                Transparansi Publik
            </span>
            <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Portal Informasi <br>
                <span class="text-gradient-primary">Pengawasan Daerah</span>
            </h1>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
                Pantau kinerja dan progres pengawasan inspektorat secara real-time. Wujud komitmen kami dalam
                transparansi dan akuntabilitas.
            </p>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div class="card p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                    <div class="text-4xl font-bold text-blue-600 mb-1">
                        <?= $stats['total'] ?>
                    </div>
                    <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Program</div>
                </div>
                <div class="card p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                    <div class="text-4xl font-bold text-green-500 mb-1">
                        <?= $stats['selesai'] ?>
                    </div>
                    <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Selesai</div>
                </div>
                <div class="card p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                    <div class="text-4xl font-bold text-amber-500 mb-1">
                        <?= $stats['berjalan'] ?>
                    </div>
                    <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Dalam Proses</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Data Section -->
    <div id="data-pengawasan" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-900">Daftar Program Pengawasan</h2>
                <p class="text-slate-500 mt-1">Update terakhir:
                    <?= date('d M Y') ?>
                </p>
            </div>
            <!-- Search/Filter could go here -->
        </div>

        <?php if (empty($programs)): ?>
            <div class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-slate-900">Belum ada data publik</h3>
                <p class="mt-1 text-sm text-slate-500">Data pengawasan akan muncul setelah dipublikasikan oleh admin.</p>
            </div>
        <?php else: ?>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr class="bg-slate-50/50">
                                <th class="table-th text-xs">Kegiatan</th>
                                <th class="table-th text-xs">Objek</th>
                                <th class="table-th text-xs">Pelaksana</th>
                                <th class="table-th text-xs text-center">Status</th>
                                <th class="table-th text-xs text-center">Progres</th>
                                <th class="table-th text-xs text-right">Periode</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            <?php foreach ($programs as $prog): ?>
                                <tr class="hover:bg-blue-50/30 transition-colors">
                                    <td class="table-td font-semibold text-slate-800">
                                        <?= esc($prog['nama_kegiatan']) ?>
                                        <div class="text-xs text-slate-400 font-normal mt-0.5">
                                            <?= esc($prog['jenis_pengawasan']) ?>
                                        </div>
                                    </td>
                                    <td class="table-td">
                                        <?= esc($prog['objek_pengawasan']) ?>
                                    </td>
                                    <td class="table-td uppercase text-xs font-bold text-slate-500">
                                        <?= esc($prog['irban_penanggung_jawab']) ?>
                                    </td>
                                    <td class="table-td text-center">
                                        <?php
                                        $statusColor = match ($prog['status']) {
                                            'selesai' => 'bg-green-100 text-green-700 border-green-200',
                                            'proses' => 'bg-amber-100 text-amber-700 border-amber-200',
                                            'batal' => 'bg-red-100 text-red-700 border-red-200',
                                            default => 'bg-slate-100 text-slate-600 border-slate-200'
                                        };
                                        ?>
                                        <span class="px-2.5 py-1 rounded-full text-xs font-medium border <?= $statusColor ?>">
                                            <?= ucfirst(esc($prog['status'])) ?>
                                        </span>
                                    </td>
                                    <td class="table-td">
                                        <div class="flex items-center gap-2">
                                            <div class="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div class="bg-blue-600 h-1.5 rounded-full"
                                                    style="width: <?= $prog['progres_persen'] ?>%"></div>
                                            </div>
                                            <span class="text-xs font-medium text-slate-600">
                                                <?= $prog['progres_persen'] ?>%
                                            </span>
                                        </div>
                                    </td>
                                    <td class="table-td text-right text-xs text-slate-500 whitespace-nowrap">
                                        <?= date('d M', strtotime($prog['tgl_mulai'])) ?> -
                                        <?= date('d M Y', strtotime($prog['tgl_selesai'])) ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-100 py-12 mt-12">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="text-center md:text-left">
                <span class="font-bold text-lg tracking-tight text-slate-900">si-MOP</span>
                <p class="text-slate-500 text-sm mt-1">©
                    <?= date('Y') ?> Inspektorat Daerah. All rights reserved.
                </p>
            </div>
            <div class="flex space-x-6 text-sm text-slate-500">
                <a href="#" class="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" class="hover:text-blue-600 transition-colors">Contact</a>
            </div>
        </div>
    </footer>

</body>

</html>