<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - si-MOP</title>
    <link href="<?= base_url('css/style.css') ?>" rel="stylesheet">
    <script src="<?= base_url('js/admin-spa.js') ?>" defer></script>
</head>

<body class="bg-gray-50 font-sans text-gray-800 antialiased">
    <div class="flex h-screen overflow-hidden">

        <!-- Sidebar -->
        <aside class="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shadow-xl z-20">
            <div class="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span class="text-white font-bold text-lg">S</span>
                    </div>
                    <h1 class="text-xl font-bold text-white tracking-tight">si-MOP <span
                            class="text-blue-500 font-normal text-sm">Admin</span></h1>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-6 px-3">
                <ul class="space-y-1">
                    <!-- Dashboard -->
                    <li>
                        <a href="<?= base_url('admin/stats') ?>"
                            class="nav-link flex items-center px-4 py-2.5 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 group">
                            <svg class="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                                </path>
                            </svg>
                            <span class="text-sm font-medium">Dashboard</span>
                        </a>
                    </li>

                    <!-- MASTER DATA -->
                    <li class="px-4 mt-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Master Data
                    </li>

                    <li>
                        <a href="<?= base_url('admin/users') ?>"
                            class="nav-link flex items-center px-4 py-2.5 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 group">
                            <svg class="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-400 transition-colors"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                </path>
                            </svg>
                            <span class="text-sm font-medium">Pengguna</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="p-4 border-t border-slate-800 bg-slate-950">
                <div class="flex items-center gap-3">
                    <div
                        class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-slate-800 shadow-sm">
                        <?= substr(session()->get('user_name') ?? 'Admin', 0, 1) ?>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">
                            <?= session()->get('user_name') ?? 'Administrator' ?></p>
                        <p class="text-xs text-slate-500 truncate">Administrator</p>
                    </div>
                    <a href="<?= base_url('logout') ?>"
                        class="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-900"
                        title="Logout">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                            </path>
                        </svg>
                    </a>
                </div>
            </div>
        </aside>

        <!-- Main Content Wrapper -->
        <main class="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">

            <!-- Topbar (Mobile Only) -->
            <header
                class="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center px-6 md:hidden sticky top-0 z-30">
                <button class="text-gray-500 focus:outline-none lg:hidden p-2 rounded-lg hover:bg-gray-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <span class="ml-4 text-lg font-bold text-gray-800 tracking-tight">si-MOP</span>
            </header>

            <!-- Dynamic Content Area -->
            <div id="main-content" class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                <!-- Content injected here via JS -->
                <div class="max-w-4xl mx-auto text-center mt-20 animate-enter">
                    <div
                        class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-xl shadow-blue-500/10 mb-8">
                        <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-1.428-.429l1-.823a2 2 0 00.518-2.09l-.499-1.399a.5.5 0 00-.731-.227l-.601.37a5 5 0 00-.816.634l-.452.452a5 5 0 00-.634.816l-.37.601a.5.5 0 00.227.731l1.399.499a2 2 0 002.09-.518l.823-1a6 6 0 00.429 1.428l.477 2.384c.312 1.566 2.502 1.346 2.871-.202zM12 15c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-6 2.686-6 6z">
                            </path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold mb-3 text-slate-800">Selamat Datang di si-MOP</h2>
                    <p class="text-slate-500 text-lg max-w-lg mx-auto">Sistem Informasi Manajemen Objek Pengawasan yang
                        modern, cepat, dan mudah digunakan.</p>
                </div>
            </div>

            <!-- Global Footer overlay (optional) -->
            <!-- <div class="absolute bottom-4 right-6 text-xs text-slate-400 pointer-events-none">v1.0.0</div> -->
        </main>
    </div>

    <!-- Global Modal -->
    <div id="modal-container" class="fixed inset-0 z-50 overflow-y-auto hidden" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

            <!-- Backdrop -->
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" aria-hidden="true"
                onclick="closeModal()"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!-- Modal Panel -->
            <div
                class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-enter border border-slate-100">
                <div class="bg-white">
                    <div id="modal-content" class="p-0">
                        <!-- Form injected here -->
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>

</html>