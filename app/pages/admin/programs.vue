<script setup lang="ts">
import { authClient } from '~~/lib/auth-client'

definePageMeta({
  layout: 'admin'
})

const session = authClient.useSession()
const user = computed(() => (session.value.data?.user as any))

const { data: programs, refresh, pending } = await useFetch('/api/programs', {
    lazy: true,
    server: false
})

const filterIrban = ref('')

const filteredPrograms = computed(() => {
    if (!programs.value) return []
    if (!filterIrban.value) return programs.value
    return programs.value.filter((p: any) => p?.irbanPj === filterIrban.value)
})

// Modal and form state
const isModalOpen = ref(false)
const selectedProgram = ref<any>(null)
const isSubmitting = ref(false)

const form = ref({
  namaKegiatan: '',
  objekPengawasan: '',
  irbanPj: '',
  jenisPengawasan: 'regular' as 'regular' | 'riksus',
  tglMulai: '',
  tglSelesai: '',
  status: 'perencanaan' as 'perencanaan' | 'pelaksanaan' | 'selesai',
  progresPersen: 0,
  isPublished: true,
  isSecret: false
})

// Modal functions
const openModal = (program: any = null) => {
  selectedProgram.value = program
  if (program) {
    form.value = { 
      namaKegiatan: program.namaKegiatan || '',
      objekPengawasan: program.objekPengawasan || '',
      irbanPj: program.irbanPj || '',
      jenisPengawasan: program.jenisPengawasan || 'regular',
      tglMulai: program.tglMulai ? program.tglMulai.split('T')[0] : '',
      tglSelesai: program.tglSelesai ? program.tglSelesai.split('T')[0] : '',
      status: program.status || 'perencanaan',
      progresPersen: program.progresPersen || 0,
      isPublished: program.isPublished !== false,
      isSecret: program.isSecret || false
    }
  } else {
    form.value = {
      namaKegiatan: '',
      objekPengawasan: '',
      irbanPj: user.value?.irbanUnit || '',
      jenisPengawasan: 'regular',
      tglMulai: '',
      tglSelesai: '',
      status: 'perencanaan',
      progresPersen: 0,
      isPublished: true,
      isSecret: false
    }
  }
  isModalOpen.value = true
}

const saveProgram = async () => {
  isSubmitting.value = true
  try {
    const url = selectedProgram.value 
      ? `/api/programs/${selectedProgram.value.id}` 
      : '/api/programs/create'
    const method = selectedProgram.value ? 'PATCH' : 'POST'
    
    const response = await $fetch(url, {
      method,
      body: form.value
    })
    
    console.log('Saved:', response)
    isModalOpen.value = false
    refresh()
  } catch (error: any) {
    console.error('Error saving program:', error)
    alert(error.data?.statusMessage || 'Gagal menyimpan program')
  } finally {
    isSubmitting.value = false
  }
}

const deleteProgram = async (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus program ini?')) {
    try {
      await $fetch(`/api/programs/${id}`, { method: 'DELETE' })
      refresh()
    } catch (error: any) {
      console.error('Error deleting program:', error)
      alert(error.data?.statusMessage || 'Gagal menghapus program')
    }
  }
}

// Status badge function
const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    'perencanaan': 'badge-ghost',
    'pelaksanaan': 'badge-info',
    'selesai': 'badge-success'
  }
  return map[status] || 'badge-ghost'
}

// Watch jenisPengawasan - auto set isSecret if riksus (optional behavior)
watch(() => form.value.jenisPengawasan, (newVal) => {
  if (newVal === 'riksus' && user.value?.role !== 'admin') {
    // Non-admin creating riksus might need to be secret by default
    // But let's leave it optional
  }
})
</script>

<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Program PKPT</h1>
          <p class="text-slate-500 mt-1">Kelola daftar kegiatan pengawasan Inspektorat.</p>
        </div>
        <button @click="openModal()" class="btn btn-primary h-12 px-6 rounded-2xl shadow-lg shadow-indigo-600/20">
          <Icon name="lucide:plus" class="w-5 h-5" />
          Tambah Program
        </button>
      </header>

      <!-- Filters & Stats (Mini) -->
      <div class="flex flex-wrap gap-4 items-center p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-700">
          <Icon name="lucide:filter" class="w-4 h-4 text-slate-500" />
          <span>Filter Unit:</span>
        </div>
        <select v-model="filterIrban" class="select select-sm select-bordered rounded-xl h-10 min-w-[200px] bg-white text-slate-700 border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
          <option value="">Semua Irban</option>
          <option value="irban1">Irban 1</option>
          <option value="irban2">Irban 2</option>
          <option value="irban3">Irban 3</option>
          <option value="irbansus">Irban Khusus</option>
        </select>
        
        <div class="ml-auto flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Riksus</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Rahasia</span>
          </div>
          <span class="text-sm text-slate-500 font-medium px-2 border-l border-slate-200">
            Total <span class="font-bold text-indigo-600">{{ filteredPrograms.length }}</span> data
          </span>
        </div>
      </div>

      <!-- Data Table -->
      <div class="card bg-white shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto min-h-[400px]">
          <table class="table w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="py-4 pl-6 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Kode</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Kegiatan / Objek</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Pelaksana</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-40">Jadwal</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Status</th>
                <th class="py-4 pr-6 text-xs font-bold text-slate-600 uppercase tracking-wider text-center w-28">Tipe</th>
                <th class="py-4 pr-6 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pending" v-for="i in 5" :key="i">
                <td colspan="7"><div class="h-10 bg-slate-50 animate-pulse rounded-xl"></div></td>
              </tr>
              <tr v-else-if="!filteredPrograms.length">
                <td colspan="7" class="py-20 text-center">
                  <div class="flex flex-col items-center">
                    <Icon name="lucide:database-zap" class="w-12 h-12 text-slate-200 mb-2" />
                    <p class="text-slate-400 font-medium">Belum ada data program.</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="p in filteredPrograms" :key="p?.id" 
                  class="hover:bg-slate-50/80 transition-colors group border-b border-slate-100/50"
                  :class="{ 'bg-red-50/30': p?.isSecret }">
                <td class="py-4 pl-6">
                  <span class="font-mono text-xs font-bold" :class="p?.isSecret ? 'text-red-600' : 'text-indigo-600'">
                    {{ p?.kodeProgram }}
                  </span>
                </td>

                 <td class="py-4">
                   <div class="flex flex-col">
                     <div class="flex items-center gap-2">
                       <span class="font-semibold text-slate-800">{{ p?.namaKegiatan }}</span>
                       <Icon v-if="p?.isSecret" name="lucide:lock" class="w-4 h-4 text-amber-500" title="Data Rahasia" />
                     </div>
                     <span class="text-xs text-slate-400">{{ p?.objekPengawasan }}</span>
                   </div>
                 </td>
                <td class="py-4">
                  <div class="badge badge-outline border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    {{ p?.irbanPj }}
                  </div>
                </td>
                <td class="py-4">
                  <div class="flex flex-col text-xs font-medium text-slate-500">
                    <span>{{ new Date(p.tglMulai).toLocaleDateString('id-ID') }}</span>
                    <span class="opacity-40">-</span>
                    <span>{{ new Date(p.tglSelesai).toLocaleDateString('id-ID') }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <div class="flex flex-col gap-1.5">
                    <div :class="['badge badge-sm font-bold uppercase tracking-tighter h-5', getStatusBadge(p?.status)]">
                      {{ p?.status }}
                    </div>
                    <div class="w-20 group-hover:w-24 transition-all h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full" 
                           :class="p?.isSecret ? 'bg-red-500' : 'bg-indigo-500'"
                           :style="{ width: `${p?.progresPersen || 0}%` }"></div>
                    </div>
                  </div>
                </td>
                <td class="py-4 text-center">
                  <div class="flex flex-col gap-1 items-center">
                    <span v-if="p?.jenisPengawasan === 'riksus'" 
                          class="badge badge-error badge-xs gap-1">
                      <Icon name="lucide:shield-alert" class="w-3 h-3" /> Riksus
                    </span>
                    <span v-else class="badge badge-ghost badge-xs">
                      Regular
                    </span>
                    <span v-if="!p?.isPublished" class="badge badge-warning badge-xs">
                      <Icon name="lucide:eye-off" class="w-3 h-3" /> Draft
                    </span>
                  </div>
                </td>
                <td class="py-4 pr-6 text-right">
                  <div class="flex justify-end gap-1">
                    <button @click="openModal(p)" class="btn btn-ghost btn-xs btn-square hover:bg-indigo-50 hover:text-indigo-600">
                      <Icon name="lucide:edit-3" class="w-4 h-4" />
                    </button>
                    <button @click="deleteProgram(p?.id)" class="btn btn-ghost btn-xs btn-square hover:bg-red-50 hover:text-red-600">
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Form -->
      <div :class="['modal bg-slate-900/40 backdrop-blur-[2px]', isModalOpen ? 'modal-open' : '']">
        <div class="modal-box max-w-3xl bg-white rounded-3xl p-0 shadow-2xl border border-slate-100 max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">
                {{ selectedProgram ? 'Edit Program' : 'Program Baru' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">{{ selectedProgram ? 'Update informasi program yang sudah ada' : 'Tambahkan program pengawasan baru' }}</p>
            </div>
            <button @click="isModalOpen = false" class="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
          
          <!-- Form Content -->
          <div class="overflow-y-auto flex-1 p-6">
            <form @submit.prevent="saveProgram" class="space-y-6">
              
              <!-- Section: Informasi Dasar -->
              <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name="lucide:file-text" class="w-4 h-4 text-indigo-500" />
                  Informasi Dasar
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama Kegiatan -->
                  <div class="form-control md:col-span-2">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      Nama Kegiatan <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="form.namaKegiatan" 
                      type="text" 
                      placeholder="Contoh: Audit Kinerja Dinas X..."
                      class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all" 
                      required 
                    />
                  </div>

                  <!-- Objek Pengawasan -->
                  <div class="form-control md:col-span-2">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      Objek Pengawasan <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="form.objekPengawasan" 
                      type="text" 
                      placeholder="Nama OPD / Unit yang diawasi"
                      class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <!-- Section: Penugasan -->
              <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name="lucide:users" class="w-4 h-4 text-indigo-500" />
                  Penugasan
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- PJ Irban -->
                  <div class="form-control">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      PJ Irban <span class="text-red-500">*</span>
                    </label>
                    <select 
                      v-model="form.irbanPj" 
                      class="select select-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all"
                      :disabled="user?.role === 'operator'"
                      required
                    >
                      <option value="" disabled>Pilih Irban Penanggung Jawab</option>
                      <option value="irban1">Irban Wilayah 1</option>
                      <option value="irban2">Irban Wilayah 2</option>
                      <option value="irban3">Irban Wilayah 3</option>
                      <option value="irbansus">Irban Khusus</option>
                    </select>
                    <label v-if="user?.role === 'operator'" class="label">
                      <span class="label-text-alt text-amber-500 text-xs">
                        <Icon name="lucide:info" class="w-3 h-3 inline" /> Otomatis sesuai unit Anda
                      </span>
                    </label>
                  </div>

                  <!-- Jenis Pengawasan -->
                  <div class="form-control">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      Jenis Pengawasan <span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-2 p-1 bg-white rounded-xl border border-slate-200">
                      <button 
                        type="button"
                        @click="form.jenisPengawasan = 'regular'"
                        :class="['flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all', 
                          form.jenisPengawasan === 'regular' 
                            ? 'bg-indigo-500 text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-50']"
                      >
                        <Icon name="lucide:clipboard-list" class="w-4 h-4 inline mr-1" />
                        Regular
                      </button>
                      <button 
                        type="button"
                        @click="form.jenisPengawasan = 'riksus'"
                        :class="['flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all', 
                          form.jenisPengawasan === 'riksus' 
                            ? 'bg-red-500 text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-50']"
                      >
                        <Icon name="lucide:shield-alert" class="w-4 h-4 inline mr-1" />
                        Riksus
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section: Jadwal -->
              <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name="lucide:calendar" class="w-4 h-4 text-indigo-500" />
                  Jadwal Pelaksanaan
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Tanggal Mulai -->
                  <div class="form-control">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      Tanggal Mulai <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="form.tglMulai" 
                      type="date" 
                      class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all" 
                      required 
                    />
                  </div>

                  <!-- Tanggal Selesai -->
                  <div class="form-control">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      Tanggal Selesai <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="form.tglSelesai" 
                      type="date" 
                      class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <!-- Section: Progress & Status -->
              <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name="lucide:activity" class="w-4 h-4 text-indigo-500" />
                  Progress & Status
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Status -->
                  <div class="form-control">
                    <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                      Status Saat Ini
                    </label>
                    <select 
                      v-model="form.status" 
                      class="select select-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all"
                    >
                      <option value="perencanaan">Perencanaan</option>
                      <option value="pelaksanaan">Pelaksanaan</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>

                   <!-- Progres -->
                   <div class="form-control">
                     <div class="flex justify-between items-center mb-2">
                       <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider p-0">
                         Progres Realisasi
                       </label>
                       <span class="text-sm font-black text-indigo-600 bg-indigo-50 py-1 px-2 rounded-lg">{{ form.progresPersen }}%</span>
                     </div>
                     <input 
                       v-model.number="form.progresPersen" 
                       type="range" 
                       min="0" 
                       max="100" 
                       class="range range-primary range-sm" 
                     />
                     <div class="w-full flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-2">
                       <span>0%</span>
                       <span>25%</span>
                       <span>50%</span>
                       <span>75%</span>
                       <span>100%</span>
                     </div>
                   </div>
                </div>
              </div>

              <!-- Section: Pengaturan Publikasi -->
              <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name="lucide:settings" class="w-4 h-4 text-indigo-500" />
                  Pengaturan Publikasi
                </h4>
                <div class="space-y-4">
                   <!-- Publish Toggle -->
                   <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                     <div class="flex items-center gap-3">
                       <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                            :class="form.isPublished ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'">
                         <Icon :name="form.isPublished ? 'lucide:eye' : 'lucide:eye-off'" class="w-5 h-5" />
                       </div>
                       <div>
                         <p class="font-semibold text-slate-800">Tampil di Publik</p>
                         <p class="text-xs text-slate-500">Program akan terlihat di halaman publik</p>
                       </div>
                     </div>
                     <input 
                       v-model="form.isPublished" 
                       type="checkbox" 
                       class="toggle toggle-primary toggle-lg"
                     />
                   </div>

                  <!-- Secret Toggle (Admin Only) -->
                  <div v-if="user?.role === 'admin'" 
                       class="flex items-center justify-between p-3 rounded-xl border"
                       :class="form.isSecret ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                           :class="form.isSecret ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'">
                        <Icon :name="form.isSecret ? 'lucide:lock' : 'lucide:unlock'" class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="font-semibold" :class="form.isSecret ? 'text-red-700' : 'text-slate-800'">
                          Data Rahasia
                        </p>
                        <p class="text-xs" :class="form.isSecret ? 'text-red-500' : 'text-slate-500'">
                          Program tidak akan tampil di halaman publik meskipun dipublish
                        </p>
                      </div>
                    </div>
                    <input 
                      v-model="form.isSecret" 
                      type="checkbox" 
                      class="toggle toggle-error toggle-lg"
                    />
                  </div>
                  
                  <!-- Info for non-admin -->
                  <div v-if="form.jenisPengawasan === 'riksus' && user?.role !== 'admin'" 
                       class="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <p class="text-sm text-amber-700 flex items-center gap-2">
                      <Icon name="lucide:info" class="w-4 h-4" />
                      Program Riksus memerlukan persetujuan admin untuk di-publish
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <!-- Footer Actions -->
          <div class="p-6 border-t border-slate-100 bg-slate-50">
            <div class="flex justify-end gap-3">
              <button type="button" @click="isModalOpen = false" 
                      class="btn btn-ghost text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-xl h-12 px-6 font-bold">
                Batal
              </button>
              <button type="button" @click="saveProgram" 
                      :disabled="isSubmitting"
                      class="btn btn-primary rounded-xl h-12 px-8 shadow-xl shadow-indigo-600/20 font-bold"
                      :class="{ 'loading': isSubmitting }">
                <Icon v-if="!isSubmitting" name="lucide:save" class="w-5 h-5 mr-1" />
                {{ selectedProgram ? 'Simpan Perubahan' : 'Simpan Program' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
