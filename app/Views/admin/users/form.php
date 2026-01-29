<?php
$isEdit = isset($user);
$actionUrl = $isEdit ? base_url('admin/users/' . $user['id']) : base_url('admin/users');
// For update, we fake the PUT method if needed
$method = $isEdit ? 'POST' : 'POST';
?>

<div class="px-6 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
    <h3 class="text-xl font-bold text-slate-800" id="modal-title">
        <?= $isEdit ? 'Edit User' : 'Tambah User' ?>
    </h3>
    <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
</div>

<div class="px-6 py-6 bg-white">
    <form action="<?= $actionUrl ?>" method="<?= $method ?>" class="ajax-form space-y-5">
        <?php if ($isEdit): ?>
            <input type="hidden" name="_method" value="PUT">
        <?php endif; ?>

        <div>
            <label class="form-label">Nama Lengkap</label>
            <input type="text" name="name" value="<?= $isEdit ? $user['name'] : '' ?>"
                class="form-input"
                placeholder="Contoh: Budi Santoso"
                required>
        </div>

        <div>
            <label class="form-label">Email Address</label>
            <input type="email" name="email" value="<?= $isEdit ? $user['email'] : '' ?>"
                class="form-input"
                placeholder="nama@email.com"
                required>
        </div>

        <div>
            <label class="form-label">Password <?= $isEdit ? '<span class="text-slate-400 font-normal text-xs ml-1">(Kosongkan jika tidak diganti)</span>' : '' ?></label>
            <input type="password" name="password"
                class="form-input"
                placeholder="••••••••"
                <?= $isEdit ? '' : 'required' ?>>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="form-label">Role Akun</label>
                <div class="relative">
                    <select name="role" class="form-input appearance-none">
                        <option value="operator" <?= ($isEdit && $user['role'] == 'operator') ? 'selected' : '' ?>>Operator</option>
                        <option value="admin" <?= ($isEdit && $user['role'] == 'admin') ? 'selected' : '' ?>>Admin</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div>
                <label class="form-label">Unit Irban</label>
                <div class="relative">
                    <select name="irban_unit" class="form-input appearance-none">
                        <?php
                        $units = ['irban1', 'irban2', 'irban3', 'irbansus', 'sekretariat'];
                        foreach ($units as $unit):
                            ?>
                            <option value="<?= $unit ?>" <?= ($isEdit && $user['irban_unit'] == $unit) ? 'selected' : '' ?>>
                                <?= ucfirst($unit) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" 
                class="close-modal btn btn-secondary" onclick="closeModal()">
                Batal
            </button>
            <button type="submit"
                class="btn btn-primary">
                <?= $isEdit ? 'Simpan Perubahan' : 'Buat User Baru' ?>
            </button>
        </div>
    </form>
</div>