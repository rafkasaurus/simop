<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Pengawasan</title>
    <link href="<?= base_url('css/style.css') ?>" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            background: transparent;
        }

        /* Allow transparency specifically for iframe */
    </style>
</head>

<body class="font-sans antialiased p-4">

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 class="text-sm font-bold text-slate-700">Update Pengawasan Terkini</h3>
            <a href="<?= base_url() ?>" target="_blank"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium">Selengkapnya &rarr;</a>
        </div>

        <?php if (empty($programs)): ?>
            <div class="p-4 text-center text-xs text-slate-500">
                Belum ada data pengawasan aktif.
            </div>
        <?php else: ?>
            <ul class="divide-y divide-slate-100">
                <?php foreach ($programs as $prog): ?>
                    <li class="px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div class="flex justify-between items-start gap-2">
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-medium text-slate-800 truncate"
                                    title="<?= esc($prog['nama_kegiatan']) ?>">
                                    <?= esc($prog['nama_kegiatan']) ?>
                                </p>
                                <p class="text-xs text-slate-500 mt-0.5 truncate">
                                    <?= esc($prog['objek_pengawasan']) ?>
                                </p>
                            </div>
                            <span
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                <?= $prog['status'] == 'proses' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600' ?>">
                                <?= $prog['progres_persen'] ?>%
                            </span>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

</body>

</html>