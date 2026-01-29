<?php
$isEdit = isset($user);
$actionUrl = $isEdit ? base_url('admin/users/' . $user['id']) : base_url('admin/users');
// For update, we fake the PUT method if needed, but CI4 supports POST for updates if configured, or we can use _method spoofing
$method = $isEdit ? 'POST' : 'POST';
?>

<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                <?= $isEdit ? 'Edit User' : 'Tambah User' ?>
            </h3>

            <form action="<?= $actionUrl ?>" method="<?= $method ?>" class="ajax-form mt-4">
                <?php if ($isEdit): ?>
                    <input type="hidden" name="_method" value="PUT">
                <?php endif; ?>

                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                    <input type="text" name="name" value="<?= $isEdit ? $user['name'] : '' ?>"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" name="email" value="<?= $isEdit ? $user['email'] : '' ?>"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Password
                        <?= $isEdit ? '(Kosongkan jika tidak diganti)' : '' ?>
                    </label>
                    <input type="password" name="password"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        <?= $isEdit ? '' : 'required' ?>>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Role</label>
                    <select name="role"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="operator" <?= ($isEdit && $user['role'] == 'operator') ? 'selected' : '' ?>
                            >Operator</option>
                        <option value="admin" <?= ($isEdit && $user['role'] == 'admin') ? 'selected' : '' ?>>Admin
                        </option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Unit Irban</label>
                    <select name="irban_unit"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <?php
                        $units = ['irban1', 'irban2', 'irban3', 'irbansus', 'sekretariat'];
                        foreach ($units as $unit):
                            ?>
                            <option value="<?= $unit ?>" <?= ($isEdit && $user['irban_unit'] == $unit) ? 'selected' : '' ?>>
                                <?= ucfirst($unit) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="flex items-center justify-end mt-6">
                    <button type="button"
                        class="close-modal bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline">
                        Batal
                    </button>
                    <button type="submit"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>