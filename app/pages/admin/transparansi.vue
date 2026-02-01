<script setup lang="ts">
import { authClient } from '~~/lib/auth-client'

definePageMeta({
  layout: 'admin'
})

const session = authClient.useSession()
const user = computed(() => (session.value.data?.user as any))

const { data: programs, pending } = await useFetch('/api/programs', {
  lazy: true,
  server: false
})

// Filter state
const selectedMonth = ref('')
const selectedYear = ref(new Date().getFullYear().toString())

// Get available months from programs
const availableMonths = computed(() => {
  if (!programs.value) return []
  const months = new Set<string>()
  programs.value.forEach((p: any) => {
    const date = new Date(p.tglMulai)
    months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  })
  return Array.from(months).sort().reverse()
})

// Month names in Indonesian
const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const getMonthName = (monthStr: string) => {
  const parts = monthStr.split('-')
  if (parts.length !== 2) return monthStr
  const year = parts[0]
  const month = parts[1]
  if (!year || !month) return monthStr
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

// Filter programs by selected month
const filteredPrograms = computed(() => {
  if (!programs.value) return []
  if (!selectedMonth.value) return programs.value.filter((p: any) => p.isPublished && !p.isSecret)
  
  const [year, month] = selectedMonth.value.split('-').map(Number)
  return programs.value.filter((p: any) => {
    const date = new Date(p.tglMulai)
    return p.isPublished && !p.isSecret && 
           date.getFullYear() === year && 
           date.getMonth() + 1 === month
  })
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6

const paginatedPrograms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPrograms.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredPrograms.value.length / itemsPerPage))

// Status badge function
const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    'perencanaan': 'badge-ghost',
    'pelaksanaan': 'badge-info',
    'selesai': 'badge-success'
  }
  return map[status] || 'badge-ghost'
}

// Watch for month change to reset pagination
watch(selectedMonth, () => {
  currentPage.value = 1
})
</script>

<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Transparansi Publik</h1>
          <p class="text-slate-500 mt-1">Preview halaman transparansi yang akan tampil di publik.</p>
        </div>
        <NuxtLink to="/publik" target="_blank" class="btn btn-primary h-12 px-6 rounded-2xl shadow-lg shadow-indigo-600/20">
          <Icon name="lucide:external-link" class="w-5 h-5" />
          Lihat Halaman Publik
        </NuxtLink>
      </header>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 items-center p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-700">
          <Icon name="lucide:filter" class="w-4 h-4 text-slate-500" />
          <span>Filter:</span>
        </div>
        <select v-model="selectedMonth" class="select select-sm select-bordered rounded-xl h-10 min-w-[200px] bg-white text-slate-700 border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
          <option value="">Semua Bulan</option>
          <option v-for="month in availableMonths" :key="month" :value="month">
            {{ getMonthName(month) }}
          </option>
        </select>
        
        <div class="ml-auto flex items-center gap-4">
          <span class="text-sm text-slate-500 font-medium px-2 border-l border-slate-200">
            Total <span class="font-bold text-indigo-600">{{ filteredPrograms.length }}</span> data
          </span>
        </div>
      </div>

      <!-- Cards Grid -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-48 bg-white rounded-3xl animate-pulse"></div>
      </div>

      <div v-else-if="!filteredPrograms.length" class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <Icon name="lucide:search-x" class="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p class="text-slate-500 font-medium">Tidak ada data transparansi yang dirilis.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="p in paginatedPrograms" :key="p.id" 
             class="card bg-white shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="card-body p-6 flex-col gap-4">
            <div class="flex items-start justify-between gap-3">
              <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                {{ p.kodeProgram }}
              </span>
              <div :class="['badge badge-sm font-bold uppercase tracking-tighter', getStatusBadge(p.status)]">
                {{ p.status }}
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-black text-slate-900 leading-tight">{{ p.namaKegiatan }}</h3>
              <div class="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
                <Icon name="lucide:building-2" class="w-4 h-4 opacity-40" />
                {{ p.objekPengawasan }}
              </div>
            </div>
            
            <div class="flex items-center gap-2 text-sm text-slate-500 font-medium pt-2 border-t border-slate-100">
              <Icon name="lucide:calendar" class="w-4 h-4 opacity-40" />
              {{ new Date(p.tglMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="btn btn-sm btn-circle btn-ghost"
        >
          <Icon name="lucide:chevron-left" class="w-4 h-4" />
        </button>
        
        <div class="flex gap-1">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="['btn btn-sm btn-square min-w-[2.5rem]', 
              currentPage === page ? 'btn-primary' : 'btn-ghost']"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="btn btn-sm btn-circle btn-ghost"
        >
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
