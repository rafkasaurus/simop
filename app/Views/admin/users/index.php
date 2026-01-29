<div class="card overflow-hidden">
    <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
            <h3 class="text-lg font-bold text-slate-800">Manajemen Pengguna</h3>
            <p class="text-sm text-slate-500 mt-1">Kelola data pengguna, role, dan unit kerja</p>
        </div>
        <button data-url="<?= base_url('admin/users/new') ?>"
            class="open-modal btn btn-primary flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Tambah User
        </button>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
            <thead>
                <tr>
                    <th class="table-th">Nama</th>
                    <th class="table-th">Email</th>
                    <th class="table-th">Role</th>
                    <th class="table-th">Unit</th>
                    <th class="text-right table-th">Aksi</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-50">
                <?php foreach ($users as $user): ?>
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="table-td font-medium text-slate-900">
                            <?= $user['name'] ?>
                        </td>
                        <td class="table-td">
                            <?= $user['email'] ?>
                        </td>
                        <td class="table-td">
                            <?php if ($user['role'] === 'admin'): ?>
                                <span
                                    class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                    Admin
                                </span>
                            <?php else: ?>
                                <span
                                    class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                                    Operator
                                </span>
                            <?php endif; ?>
                        </td>
                        <td class="table-td">
                            <?= ucfirst($user['irban_unit'] ?? '-') ?>
                        </td>
                        <td class="table-td text-right space-x-2">
                            <button data-url="<?= base_url('admin/users/' . $user['id'] . '/edit') ?>"
                                class="open-modal text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">Edit</button>
                            <button data-url="<?= base_url('admin/users/' . $user['id']) ?>"
                                class="delete-item text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Hapus</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>