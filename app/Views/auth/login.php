<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - si-MOP</title>
    <link href="<?= base_url('css/style.css') ?>" rel="stylesheet">
</head>

<body class="bg-gray-100 flex items-center justify-center h-screen">

    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <div class="mb-6 text-center">
            <h1 class="text-2xl font-bold text-gray-800">si-MOP</h1>
            <p class="text-sm text-gray-500">Sistem Informasi Manajemen PKPT</p>
        </div>

        <?php if (session()->getFlashdata('msg')): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">
                    <?= session()->getFlashdata('msg') ?>
                </span>
            </div>
        <?php endif; ?>

        <form action="<?= base_url('/auth/login') ?>" method="post">
            <div class="mb-4">
                <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input type="email" name="email" id="email"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-150 ease-in-out"
                    required autofocus>
            </div>

            <div class="mb-6">
                <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <input type="password" name="password" id="password"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-150 ease-in-out"
                    required>
            </div>

            <div class="flex items-center justify-between">
                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                    Sign In
                </button>
            </div>
        </form>

        <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
                &copy;
                <?= date('Y') ?> Inspektorat Daerah. All rights reserved.
            </p>
        </div>
    </div>

</body>

</html>