<div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-4">Selamat Datang,
        <?= session()->get('user_name') ?>
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
            <p class="font-bold">Total Program</p>
            <p class="text-2xl">0</p>
        </div>
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <p class="font-bold">Terlaksana</p>
            <p class="text-2xl">0</p>
        </div>
        <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <p class="font-bold">Dalam Proses</p>
            <p class="text-2xl">0</p>
        </div>
    </div>
    <p class="text-gray-600">Pilih menu di samping untuk mengelola data sistem informasi.</p>
</div>