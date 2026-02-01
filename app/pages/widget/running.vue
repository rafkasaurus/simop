<script setup lang="ts">
const { data: programs } = await useFetch('/api/public/programs', {
    lazy: true,
    server: false,
    transform: (items: any[]) => items.filter(p => p.status === 'pelaksanaan')
})

definePageMeta({
    layout: false
})
</script>

<template>
  <div class="bg-transparent p-2">
    <div class="space-y-3">
        <div v-if="!programs?.length" class="text-slate-400 text-xs text-center py-4 border border-dashed border-slate-200 rounded-xl">
            Tidak ada program berjalan saat ini.
        </div>
        <div v-for="p in programs" :key="p.id" class="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex items-center gap-4 transition-all hover:border-indigo-200">
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 truncate">{{ p.namaKegiatan }}</h4>
                <p class="text-[10px] text-slate-500 truncate">{{ p.objekPengawasan }}</p>
            </div>
            <div class="flex flex-col items-end gap-1">
                <span class="text-[10px] font-black text-indigo-600">{{ p.progresPersen }}%</span>
                <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 rounded-full" :style="{ width: `${p.progresPersen}%` }"></div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style>
body {
    background-color: transparent !important;
}
</style>
