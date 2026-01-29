<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - si-MOP</title>
    <link href="<?= base_url('css/style.css') ?>" rel="stylesheet">
    <script src="<?= base_url('js/admin-spa.js') ?>" defer></script>
</head>

<body class="bg-gray-100 font-sans antialiased">
    <div class="flex h-screen overflow-hidden">

        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div class="h-16 flex items-center justify-center border-b border-gray-200">
                <h1 class="text-xl font-bold text-gray-800">si-MOP <span class="text-blue-600">Admin</span></h1>
            </div>

            <nav class="flex-1 overflow-y-auto py-4">
                <ul class="space-y-1 px-2">
                    <!-- Dashboard -->
                    <li>
                        <a href="<?= base_url('admin/stats') ?>"
                            class="nav-link flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                                </path>
                            </svg>
                            Dashboard
                        </a>
                    </li>

                    <!-- MASTER DATA -->
                    <li class="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Master Data
                    </li>

                    <li>
                        <a href="<?= base_url('admin/users') ?>"
                            class="nav-link flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                </path>
                            </svg>
                            User Management
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="p-4 border-t border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div
                            class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            <?= substr(session()->get('user_name'), 0, 1) ?>
                        </div>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-700"><?= session()->get('user_name') ?></p>
                        <a href="<?= base_url('logout') ?>" class="text-xs text-red-500 hover:text-red-700">Logout</a>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content Wrapper -->
        <main class="flex-1 flex flex-col h-screen overflow-hidden">
            <!-- Topbar (Mobile) -->
            <header class="bg-white border-b border-gray-200 h-16 flex items-center px-6 md:hidden">
                <button class="text-gray-500 focus:outline-none lg:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <span class="ml-4 text-lg font-semibold text-gray-800">si-MOP</span>
            </header>

            <!-- Dynamic Content Area -->
            <div id="main-content" class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                <!-- Content injected here via JS -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-2xl font-bold mb-4">Selamat Datang di si-MOP</h2>
                    <p class="text-gray-600">Silakan pilih menu di samping untuk memulai.</p>
                </div>
            </div>
        </main>
    </div>

    <!-- Global Modal -->
    <div id="modal-container" class="fixed inset-0 z-50 overflow-y-auto hidden" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                onclick="closeModal()"></div>

            <!-- Modal Panel -->
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div id="modal-content">
                    <!-- Form injected here -->
                </div>
            </div>
        </div>
    </div>

</body>

</html>