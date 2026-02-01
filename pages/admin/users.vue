<script setup lang="ts">
import { authClient } from '~~/lib/auth-client'

definePageMeta({
  layout: 'admin'
})

const session = authClient.useSession()
const user = computed(() => (session.value.data?.user as any))
const router = useRouter()

// Redirect if not admin
onMounted(() => {
  if (user.value?.role !== 'admin') {
    router.push('/')
  }
})

const { data: users, refresh, pending } = await useFetch('/api/users', {
  lazy: true,
  server: false
})

// Modal and form state
const isModalOpen = ref(false)
const selectedUser = ref<any>(null)
const isSubmitting = ref(false)
const isCreateMode = ref(false)

const form = ref({
  username: '',
  password: '',
  name: '',
  role: 'operator' as 'admin' | 'operator',
  irbanUnit: '' as '' | 'irban1' | 'irban2' | 'irban3' | 'irbansus'
})

// Modal functions
const openModal = (editUser: any = null) => {
  selectedUser.value = editUser
  isCreateMode.value = !editUser
  if (editUser) {
    form.value = {
      username: editUser.username || '',
      password: '',
      name: editUser.name || '',
      role: editUser.role || 'operator',
      irbanUnit: editUser.irbanUnit || ''
    }
  } else {
    form.value = {
      username: '',
      password: '',
      name: '',
      role: 'operator',
      irbanUnit: ''
    }
  }
  isModalOpen.value = true
}

const saveUser = async () => {
  isSubmitting.value = true
  try {
    if (isCreateMode.value) {
      // Create new user
      const response = await $fetch('/api/users/create', {
        method: 'POST',
        body: form.value
      })
      console.log('Created:', response)
    } else {
      // Update existing user
      const response = await $fetch(`/api/users/${selectedUser.value.id}`, {
        method: 'PATCH',
        body: {
          name: form.value.name,
          role: form.value.role,
          irbanUnit: form.value.irbanUnit
        }
      })
      console.log('Updated:', response)
    }
    isModalOpen.value = false
    refresh()
  } catch (error: any) {
    console.error('Error saving user:', error)
    alert(error.data?.statusMessage || 'Gagal menyimpan user')
  } finally {
    isSubmitting.value = false
  }
}

const deleteUser = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.')) {
    try {
      await $fetch(`/api/users/${id}`, { method: 'DELETE' })
      refresh()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      alert(error.data?.statusMessage || 'Gagal menghapus user')
    }
  }
}

// Role badge function
const getRoleBadge = (role: string | null | undefined) => {
  return role === 'admin' ? 'badge-error' : 'badge-info'
}

const getIrbanLabel = (irban: string) => {
  const map: Record<string, string> = {
    'irban1': 'Irban 1',
    'irban2': 'Irban 2',
    'irban3': 'Irban 3',
    'irbansus': 'Irban Khusus'
  }
  return map[irban] || irban || '-'
}
</script>

<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p class="text-slate-500 mt-1">Kelola pengguna sistem E-PKPT.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="badge badge-lg badge-error gap-2">
            <Icon name="lucide:shield" class="w-4 h-4" />
            Admin Only
          </div>
          <button @click="openModal()" class="btn btn-primary h-12 px-6 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Icon name="lucide:plus" class="w-5 h-5" />
            Tambah User
          </button>
        </div>
      </header>

      <!-- Info Card -->
      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <Icon name="lucide:info" class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div class="text-sm text-indigo-700">
          <p class="font-semibold">Informasi Akses:</p>
          <ul class="mt-1 space-y-1 list-disc list-inside">
            <li><strong>Admin:</strong> Dapat melihat semua data PKPT dan mengelola users</li>
            <li><strong>Operator:</strong> Hanya dapat CRUD PKPT sesuai unit Irban masing-masing</li>
          </ul>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card bg-white shadow-sm border border-slate-200">
          <div class="card-body p-4 flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icon name="lucide:users" class="w-6 h-6" />
            </div>
            <div>
              <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Users</span>
              <p class="text-2xl font-bold text-slate-900">{{ users?.length || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="card bg-white shadow-sm border border-slate-200">
          <div class="card-body p-4 flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Icon name="lucide:shield" class="w-6 h-6" />
            </div>
            <div>
              <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Admin</span>
              <p class="text-2xl font-bold text-slate-900">{{ users?.filter((u: any) => u.role === 'admin').length || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="card bg-white shadow-sm border border-slate-200">
          <div class="card-body p-4 flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon name="lucide:user" class="w-6 h-6" />
            </div>
            <div>
              <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Operator</span>
              <p class="text-2xl font-bold text-slate-900">{{ users?.filter((u: any) => u.role === 'operator').length || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card bg-white shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto min-h-[400px]">
          <table class="table w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="py-4 pl-6 text-xs font-bold text-slate-600 uppercase tracking-wider">User</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Role</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-40">Unit Irban</th>
                <th class="py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-48">Bergabung</th>
                <th class="py-4 pr-6 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pending" v-for="i in 5" :key="i">
                <td colspan="5"><div class="h-10 bg-slate-50 animate-pulse rounded-xl m-2"></div></td>
              </tr>
              <tr v-else-if="!users?.length">
                <td colspan="5" class="py-20 text-center">
                  <div class="flex flex-col items-center">
                    <Icon name="lucide:users" class="w-12 h-12 text-slate-200 mb-2" />
                    <p class="text-slate-400 font-medium">Belum ada data user.</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="u in users" :key="u?.id" 
                  class="hover:bg-slate-50/80 transition-colors group border-b border-slate-100/50"
                  :class="{ 'bg-indigo-50/30': u?.id === user?.id }">
                <td class="py-4 pl-6">
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-10 rounded-full ring-2" :class="u?.role === 'admin' ? 'ring-red-200' : 'ring-slate-200'">
                        <img :src="u?.image || `https://ui-avatars.com/api/?name=${u?.name}&background=6366f1&color=fff`" />
                      </div>
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 flex items-center gap-2">
                        {{ u?.name }}
                        <span v-if="u?.id === user?.id" class="badge badge-xs badge-primary">You</span>
                      </p>
                      <p class="text-xs text-slate-500">@{{ u?.username }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <div :class="['badge badge-sm font-bold uppercase tracking-tighter', getRoleBadge(u?.role)]">
                    {{ u?.role }}
                  </div>
                </td>
                <td class="py-4">
                  <div v-if="u?.irbanUnit" class="badge badge-outline border-slate-200 text-slate-500 text-xs">
                    {{ getIrbanLabel(u?.irbanUnit) }}
                  </div>
                  <span v-else class="text-slate-400 text-xs">-</span>
                </td>
                <td class="py-4 text-sm text-slate-500">
                  {{ new Date(u?.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </td>
                <td class="py-4 pr-6 text-right">
                  <div class="flex justify-end gap-1">
                    <button @click="openModal(u)" 
                            class="btn btn-ghost btn-xs btn-square hover:bg-indigo-50 hover:text-indigo-600"
                            :disabled="u?.id === user?.id"
                            :title="u?.id === user?.id ? 'Cannot edit yourself' : 'Edit user'">
                      <Icon name="lucide:edit-3" class="w-4 h-4" />
                    </button>
                    <button @click="deleteUser(u?.id)" 
                            class="btn btn-ghost btn-xs btn-square hover:bg-red-50 hover:text-red-600"
                            :disabled="u?.id === user?.id"
                            :title="u?.id === user?.id ? 'Cannot delete yourself' : 'Delete user'">
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
        <div class="modal-box max-w-lg bg-white rounded-3xl p-0 shadow-2xl border border-slate-100">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">
                {{ isCreateMode ? 'Tambah User Baru' : 'Edit User' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                {{ isCreateMode ? 'Tambahkan pengguna baru ke sistem' : 'Update informasi user' }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
          
          <!-- Form Content -->
          <div class="p-6 space-y-4">
            <!-- User Info (Read Only for Edit) -->
            <div v-if="!isCreateMode" class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div class="avatar">
                <div class="w-12 rounded-full ring-2 ring-indigo-200">
                  <img :src="selectedUser?.image || `https://ui-avatars.com/api/?name=${selectedUser?.name}&background=6366f1&color=fff`" />
                </div>
              </div>
              <div>
                <p class="font-bold text-slate-800">{{ selectedUser?.name }}</p>
                <p class="text-sm text-slate-500">@{{ selectedUser?.username }}</p>
              </div>
            </div>

            <!-- Username (Create Only) -->
            <div v-if="isCreateMode" class="form-control">
              <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                Username <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.username" 
                type="text" 
                placeholder="Masukkan username"
                class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all"
                required
              />
            </div>

            <!-- Password (Create Only) -->
            <div v-if="isCreateMode" class="form-control">
              <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.password" 
                type="password" 
                placeholder="Minimal 6 karakter"
                class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all"
                required
                minlength="6"
              />
              <label class="label">
                <span class="label-text-alt text-slate-400 text-xs">
                  Password minimal 6 karakter
                </span>
              </label>
            </div>

            <!-- Name -->
            <div class="form-control">
              <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Masukkan nama lengkap"
                class="input input-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all"
                required
              />
            </div>

            <!-- Role Selection -->
            <div class="form-control">
              <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                Role
              </label>
              <div class="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
                <button 
                  type="button"
                  @click="form.role = 'operator'"
                  :class="['flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all', 
                    form.role === 'operator' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-white']"
                >
                  <Icon name="lucide:user" class="w-4 h-4 inline mr-1" />
                  Operator
                </button>
                <button 
                  type="button"
                  @click="form.role = 'admin'"
                  :class="['flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all', 
                    form.role === 'admin' 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-white']"
                >
                  <Icon name="lucide:shield" class="w-4 h-4 inline mr-1" />
                  Admin
                </button>
              </div>
            </div>

            <!-- Irban Unit Selection -->
            <div class="form-control">
              <label class="label font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
                Unit Irban
              </label>
              <select 
                v-model="form.irbanUnit" 
                class="select select-bordered bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 w-full transition-all"
              >
                <option value="">Tidak ada unit</option>
                <option value="irban1">Irban Wilayah 1</option>
                <option value="irban2">Irban Wilayah 2</option>
                <option value="irban3">Irban Wilayah 3</option>
                <option value="irbansus">Irban Khusus</option>
              </select>
              <label class="label">
                <span class="label-text-alt text-slate-400 text-xs">
                  Unit Irban menentukan akses data PKPT untuk operator
                </span>
              </label>
            </div>
          </div>
          
          <!-- Footer Actions -->
          <div class="p-6 border-t border-slate-100 bg-slate-50">
            <div class="flex justify-end gap-3">
              <button type="button" @click="isModalOpen = false" 
                      class="btn btn-ghost text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-xl h-12 px-6 font-bold">
                Batal
              </button>
              <button type="button" @click="saveUser" 
                      :disabled="isSubmitting"
                      class="btn btn-primary rounded-xl h-12 px-8 shadow-xl shadow-indigo-600/20 font-bold"
                      :class="{ 'loading': isSubmitting }">
                <Icon v-if="!isSubmitting" name="lucide:save" class="w-5 h-5 mr-1" />
                {{ isCreateMode ? 'Buat User' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
