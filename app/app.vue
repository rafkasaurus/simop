<script setup lang="ts">
// app.vue
</script>

<template>
  <div class="antialiased font-sans text-slate-900 bg-slate-50 min-h-screen">
    <NuxtPage />
  </div>
</template>



<style>
/* Global transitions or styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

