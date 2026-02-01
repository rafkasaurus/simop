<script setup lang="ts">
import { authClient } from '~~/lib/auth-client'

const session = authClient.useSession()
const router = useRouter()

console.log('Admin layout loaded, session:', session.value)

const logout = async () => {
    await authClient.signOut()
    router.push('/login')
}

const menuItems = [
    { title: 'Dashboard', icon: 'lucide:layout-dashboard', to: '/' },
    { title: 'Data PKPT', icon: 'lucide:clipboard-list', to: '/admin/programs' },
    { title: 'Transparansi', icon: 'lucide:eye', to: '/admin/transparansi' },
    { title: 'User Management', icon: 'lucide:users', to: '/admin/users', adminOnly: true },

]

const filteredMenu = computed(() => {
    if (!session.value.data?.user) return []
    const role = (session.value.data.user as any).role
    return menuItems.filter(item => !item.adminOnly || role === 'admin')
})
</script>

<template>
  <div class="drawer lg:drawer-open min-h-screen bg-slate-50">
    <input id="admin-drawer" type="checkbox" class="drawer-toggle" />
    
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar bg-white border-b border-slate-200 lg:hidden">
        <div class="flex-none">
          <label for="admin-drawer" class="btn btn-square btn-ghost">
            <Icon name="lucide:menu" class="w-6 h-6" />
          </label>
        </div>
        <div class="flex-1 px-4">
          <span class="text-xl font-bold tracking-tight text-slate-800">E-PKPT</span>
        </div>
      </div>

      <!-- Main View -->
      <div class="p-6 md:p-8">
        <slot />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side z-50">
      <label for="admin-drawer" class="drawer-overlay"></label>
      <div class="w-64 min-h-full bg-slate-900 text-slate-300 flex flex-col">
        <!-- Brand -->
        <div class="p-6 flex items-center gap-3 border-b border-slate-800">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">P</div>
          <div>
            <h1 class="font-bold text-white text-lg tracking-tight leading-none">E-PKPT</h1>
            <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Inspektorat</span>
          </div>
        </div>

        <!-- Menu -->
        <nav class="flex-1 p-4 flex flex-col gap-2">
          <NuxtLink 
            v-for="item in filteredMenu" 
            :key="item.to" 
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/10 hover:text-white group"
            active-class="bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          >
            <Icon :name="item.icon" class="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span class="font-medium">{{ item.title }}</span>
          </NuxtLink>
        </nav>

        <!-- User Info -->
        <div class="p-4 border-t border-slate-800 bg-slate-950/50">
          <div class="flex items-center gap-3 px-2 py-2">
            <div class="avatar online">
              <div class="w-10 rounded-full ring ring-indigo-500 ring-offset-slate-900 ring-offset-2">
                <img :src="session.data?.user.image || `https://ui-avatars.com/api/?name=${session.data?.user.name}&background=6366f1&color=fff`" />
              </div>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-bold text-white truncate">{{ session.data?.user.name }}</span>
              <span class="text-[10px] text-slate-500 uppercase font-bold truncate">{{ (session.data?.user as any)?.role }}</span>
            </div>
          </div>
          <button @click="logout" class="btn btn-ghost btn-block btn-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-4 gap-2">
            <Icon name="lucide:log-out" class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  background-color: rgb(79 70 229); /* indigo-600 */
}
</style>
