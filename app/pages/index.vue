<script setup lang="ts">
import { authClient } from '~~/lib/auth-client'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const session = authClient.useSession()
const router = useRouter()

definePageMeta({
  layout: false 
})

// Fetch programs data for dashboard
const { data: programs, pending } = await useFetch('/api/programs', {
  lazy: true,
  server: false,
  immediate: !!session.value?.data, 
  watch: [session]
})

// Computed stats
const stats = computed(() => {
  if (!programs.value) return { total: 0, perencanaan: 0, pelaksanaan: 0, selesai: 0 }
  return {
    total: programs.value.length,
    perencanaan: programs.value.filter((p: any) => p.status === 'perencanaan').length,
    pelaksanaan: programs.value.filter((p: any) => p.status === 'pelaksanaan').length,
    selesai: programs.value.filter((p: any) => p.status === 'selesai').length
  }
})

// Average realization percentage
const avgRealization = computed(() => {
  if (!programs.value?.length) return 0
  const totalProgress = programs.value.reduce((sum: number, p: any) => sum + (p.progresPersen || 0), 0)
  return Math.round(totalProgress / programs.value.length)
})

// Upcoming Deadline (≤ 7 days from now)
const upcomingDeadlines = computed(() => {
  if (!programs.value) return []
  const today = new Date()
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  return programs.value
    .filter((p: any) => {
      const endDate = new Date(p.tglSelesai)
      return endDate >= today && endDate <= sevenDaysLater && p.status !== 'selesai'
    })
    .sort((a: any, b: any) => new Date(a.tglSelesai).getTime() - new Date(b.tglSelesai).getTime())
    .slice(0, 5) // Top 5 urgent
})

// Current Month Programs (Riksus)
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const currentMonthPrograms = computed(() => {
  if (!programs.value) return []
  return programs.value.filter((p: any) => {
    const startDate = new Date(p.tglMulai)
    const endDate = new Date(p.tglSelesai)
    const now = new Date()
    // Program yang sedang berjalan di bulan ini
    return startDate <= now && endDate >= now
  })
})

// Riksus Programs (Pemeriksaan Khusus) - Secret and Regular
const riksusPrograms = computed(() => {
  if (!programs.value) return []
  return programs.value
    .filter((p: any) => p.jenisPengawasan === 'riksus')
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// Schedule Timeline (grouped by week)
const scheduleData = computed(() => {
  if (!programs.value) return []
  const today = new Date()
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  return programs.value
    .filter((p: any) => {
      const startDate = new Date(p.tglMulai)
      const endDate = new Date(p.tglSelesai)
      // Program yang berjalan di bulan ini
      return (startDate >= currentMonthStart && startDate <= currentMonthEnd) ||
             (endDate >= currentMonthStart && endDate <= currentMonthEnd) ||
             (startDate <= currentMonthStart && endDate >= currentMonthEnd)
    })
    .sort((a: any, b: any) => new Date(a.tglMulai).getTime() - new Date(b.tglMulai).getTime())
})

// Chart Data (Computed)
const statusChartData = computed(() => ({
  labels: ['Perencanaan', 'Pelaksanaan', 'Selesai'],
  datasets: [{
    label: 'Program',
    data: [
      stats.value?.perencanaan || 0,
      stats.value?.pelaksanaan || 0,
      stats.value?.selesai || 0
    ],
    backgroundColor: ['#e2e8f0', '#f59e0b', '#10b981'],
    borderRadius: 8
  }]
}))

const realizationChartData = computed(() => ({
  labels: ['Terealisasi', 'Sisa'],
  datasets: [{
    data: [
      avgRealization.value,
      100 - avgRealization.value
    ],
    backgroundColor: ['#10b981', '#f1f5f9'],
    borderWidth: 0
  }]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, grid: { display: false } },
        x: { grid: { display: false } }
    }
}

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const }
    }
}

// Helper functions
const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate)
  const today = new Date()
  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    'perencanaan': 'badge-ghost',
    'pelaksanaan': 'badge-info',
    'selesai': 'badge-success'
  }
  return map[status] || 'badge-ghost'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}
</script>

<template>
  <div>
    <!-- Render Admin View if logged in -->
    <NuxtLayout v-if="session.data" name="admin">
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h2>
            <p class="text-slate-500 mt-1">Monitor real-time inspection progress for {{ (session.data.user as any).irbanUnit }}.</p>
          </header>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="card bg-white shadow-sm border border-slate-200">
              <div class="card-body p-6 flex-row items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Icon name="lucide:clipboard-list" class="w-7 h-7" />
                </div>
                <div>
                  <span class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Program</span>
                  <p class="text-3xl font-bold text-slate-900">{{ stats?.total || 0 }}</p>
                </div>
              </div>
            </div>

            <div class="card bg-white shadow-sm border border-slate-200">
              <div class="card-body p-6 flex-row items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Icon name="lucide:loader" class="w-7 h-7" />
                </div>
                <div>
                  <span class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Pelaksanaan</span>
                  <p class="text-3xl font-bold text-slate-900">{{ stats?.pelaksanaan || 0 }}</p>
                </div>
              </div>
            </div>

            <div class="card bg-white shadow-sm border border-slate-200">
              <div class="card-body p-6 flex-row items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Icon name="lucide:check-circle" class="w-7 h-7" />
                </div>
                <div>
                  <span class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Selesai</span>
                  <p class="text-3xl font-bold text-slate-900">{{ stats?.selesai || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div v-if="stats && stats.total > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="card bg-white shadow-sm border border-slate-200 p-6">
                 <h3 class="font-bold text-slate-700 mb-4">Statistik Program</h3>
                 <div class="h-64">
                    <ClientOnly>
                        <Bar :data="statusChartData" :options="chartOptions" />
                    </ClientOnly>
                 </div>
             </div>
             
              <div class="card bg-white shadow-sm border border-slate-200 p-6">
                  <h3 class="font-bold text-slate-700 mb-4">Persentase Realisasi</h3>
                  <div class="h-64 flex justify-center relative">
                     <ClientOnly>
                         <Doughnut :data="realizationChartData" :options="doughnutOptions" />
                     </ClientOnly>
                  </div>
                  <div class="text-center mt-4">
                    <span class="text-4xl font-black text-indigo-600">{{ avgRealization }}%</span>
                    <p class="text-sm text-slate-500 mt-1">Rata-rata progres semua program</p>
                  </div>
              </div>
          </div>

          <!-- Upcoming Deadline Section -->
          <div class="card bg-white shadow-sm border border-slate-200">
            <div class="card-body p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-700 flex items-center gap-2">
                  <Icon name="lucide:alarm-clock" class="w-5 h-5 text-red-500" />
                  Upcoming Deadline (≤ 7 Hari)
                </h3>
                <span class="badge badge-error badge-sm">{{ upcomingDeadlines.length }} urgent</span>
              </div>
              
              <div v-if="upcomingDeadlines.length === 0" class="text-center py-8 text-slate-400">
                <Icon name="lucide:check-circle" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada deadline mendesak</p>
              </div>
              
              <div v-else class="space-y-3">
                <div v-for="p in upcomingDeadlines" :key="p.id" 
                     class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <span class="text-lg font-bold text-red-600">{{ getDaysRemaining(p.tglSelesai) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-slate-800 truncate">{{ p.namaKegiatan }}</p>
                    <p class="text-sm text-slate-500">{{ p.objekPengawasan }}</p>
                  </div>
                  <div class="text-right">
                    <div :class="['badge badge-sm', getStatusBadge(p.status)]">{{ p.status }}</div>
                    <p class="text-xs text-slate-400 mt-1">{{ formatDate(p.tglSelesai) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Timeline -->
          <div class="card bg-white shadow-sm border border-slate-200">
            <div class="card-body p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-700 flex items-center gap-2">
                  <Icon name="lucide:calendar-days" class="w-5 h-5 text-indigo-500" />
                  Jadwal Program Bulan Ini
                </h3>
                <span class="badge badge-info badge-sm">{{ scheduleData.length }} program</span>
              </div>
              
              <div v-if="scheduleData.length === 0" class="text-center py-8 text-slate-400">
                <Icon name="lucide:calendar-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada program di bulan ini</p>
              </div>
              
              <div v-else class="relative">
                <!-- Timeline line -->
                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                
                <div class="space-y-4">
                  <div v-for="p in scheduleData.slice(0, 6)" :key="p.id" 
                       class="relative flex items-start gap-4 pl-10">
                    <!-- Timeline dot -->
                    <div class="absolute left-2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                         :class="p.jenisPengawasan === 'riksus' ? 'bg-red-500' : 'bg-indigo-500'"></div>
                    
                    <div class="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <p class="font-semibold text-slate-800">{{ p.namaKegiatan }}</p>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-slate-500">
                              {{ formatDate(p.tglMulai) }} - {{ formatDate(p.tglSelesai) }}
                            </span>
                            <span v-if="p.jenisPengawasan === 'riksus'" class="badge badge-error badge-xs">Riksus</span>
                            <span v-if="p.isSecret" class="badge badge-warning badge-xs">
                              <Icon name="lucide:lock" class="w-3 h-3" /> Rahasia
                            </span>
                          </div>
                        </div>
                        <div :class="['badge badge-sm', getStatusBadge(p.status)]">{{ p.status }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="scheduleData.length > 6" class="text-center mt-4">
                  <NuxtLink to="/admin/programs" class="btn btn-ghost btn-sm text-indigo-600">
                    Lihat Semua {{ scheduleData.length }} Program
                    <Icon name="lucide:arrow-right" class="w-4 h-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Program Khusus (Riksus) Section -->
          <div class="card bg-white shadow-sm border border-slate-200">
            <div class="card-body p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-700 flex items-center gap-2">
                  <Icon name="lucide:shield-alert" class="w-5 h-5 text-red-500" />
                  Program Pemeriksaan Khusus (Riksus)
                </h3>
                <span class="badge badge-error badge-sm">{{ riksusPrograms.length }} riksus</span>
              </div>
              
              <div v-if="riksusPrograms.length === 0" class="text-center py-8 text-slate-400">
                <Icon name="lucide:shield-check" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada program Riksus</p>
              </div>
              
              <div v-else class="overflow-x-auto">
                <table class="table table-sm w-full">
                  <thead>
                    <tr class="border-b border-slate-100">
                      <th class="text-left py-2 text-xs font-bold text-slate-500 uppercase">Kode</th>
                      <th class="text-left py-2 text-xs font-bold text-slate-500 uppercase">Kegiatan</th>
                      <th class="text-left py-2 text-xs font-bold text-slate-500 uppercase">Pelaksana</th>
                      <th class="text-left py-2 text-xs font-bold text-slate-500 uppercase">Jadwal</th>
                      <th class="text-left py-2 text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th class="text-left py-2 text-xs font-bold text-slate-500 uppercase">Confidential</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in riksusPrograms" :key="p.id" class="border-b border-slate-50 hover:bg-slate-50">
                      <td class="py-3 font-mono text-xs text-indigo-600">{{ p.kodeProgram }}</td>
                      <td class="py-3">
                        <p class="font-medium text-slate-800">{{ p.namaKegiatan }}</p>
                        <p class="text-xs text-slate-400">{{ p.objekPengawasan }}</p>
                      </td>
                      <td class="py-3">
                        <span class="badge badge-outline badge-sm">{{ p.irbanPj }}</span>
                      </td>
                      <td class="py-3 text-sm text-slate-500">
                        {{ formatDate(p.tglMulai) }}
                      </td>
                      <td class="py-3">
                        <div :class="['badge badge-sm', getStatusBadge(p.status)]">{{ p.status }}</div>
                      </td>
                      <td class="py-3">
                        <span v-if="p.isSecret" class="badge badge-error badge-sm gap-1">
                          <Icon name="lucide:lock" class="w-3 h-3" /> Rahasia
                        </span>
                        <span v-else class="badge badge-success badge-sm gap-1">
                          <Icon name="lucide:unlock" class="w-3 h-3" /> Publik
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Empty State if no data -->
          <div v-if="!pending && (!stats || stats.total === 0)" class="card bg-white shadow-sm border border-slate-200">
            <div class="card-body p-12 text-center">
               <div class="inline-flex w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4 text-slate-300">
                 <Icon name="lucide:pie-chart" class="w-8 h-8" />
               </div>
               <h3 class="text-lg font-bold text-slate-800">Belum Ada Data Statistik</h3>
               <p class="text-slate-400 mt-1 max-w-sm mx-auto">Grafik akan muncul setelah Anda menambahkan data program.</p>
               <div class="flex gap-3 justify-center mt-6">
                 <NuxtLink to="/admin/programs" class="btn btn-primary">
                   <Icon name="lucide:plus" />
                   Tambah Data
                 </NuxtLink>
               </div>
            </div>
          </div>
        </div>
    </NuxtLayout>

    <!-- Render LandingView if guest -->
    <div v-else class="min-h-screen bg-slate-900 overflow-hidden relative">
      <!-- Decorative background -->
      <div class="absolute inset-0 pointer-events-none opacity-20">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <!-- Navigation -->
      <nav class="relative z-10 px-8 py-6 max-w-7xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl mt-6 mx-6 lg:mx-auto">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center text-white font-bold text-xl">P</div>
          <span class="text-2xl font-black tracking-tight text-white italic">E-PKPT</span>
        </div>
        <div class="flex gap-8 items-center">
            <NuxtLink to="/publik" class="text-slate-300 hover:text-white font-medium transition-colors">Public Directory</NuxtLink>
            <NuxtLink to="/login" class="btn btn-primary h-12 px-8 font-bold border-none bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl hover:shadow-xl hover:shadow-indigo-600/30 transition-all">
                Login Dashboard
            </NuxtLink>
        </div>
      </nav>

      <main class="relative z-10 max-w-7xl mx-auto px-8 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
        <div class="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-bold tracking-widest uppercase mb-4 animate-bounce">
          New Internal Version 2.0
        </div>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white max-w-5xl leading-[0.9]">
          MODERN INSPECTION <span class="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-600">MANAGEMENT.</span>
        </h1>
        <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The next generation of inspection monitoring for Inspectors. Fast, reliable, and beautifully designed for maximum efficiency.
        </p>
        <div class="pt-8 flex flex-col md:flex-row gap-4 items-center animate-in slide-in-from-top-8 duration-1000">
          <NuxtLink to="/login" class="btn btn-primary btn-lg min-w-[200px] h-16 rounded-2xl shadow-2xl shadow-indigo-600/20">
             Start Managing
             <Icon name="lucide:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>
          <NuxtLink to="/publik" class="btn btn-outline btn-lg min-w-[200px] h-16 rounded-2xl text-white">
            <Icon name="lucide:globe" class="mr-2 w-5 h-5" />
            Public View
          </NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Nuxt Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
