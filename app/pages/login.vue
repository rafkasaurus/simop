<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "~~/lib/auth-client";


definePageMeta({
  layout: false,
});

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    console.log('Attempting login for:', username.value);

    const { data, error } = await authClient.signIn.email({
      email: username.value,
      password: password.value,
      callbackURL: "/", // Redirect to home after login
    });

    console.log('Login response:', { data, error });

    if (error) {
      errorMessage.value = error.message || "Invalid username or password";
    }
  } catch (e: any) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
    </div>

    <div class="card w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
      <div class="card-body p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-2xl shadow-lg mb-4">
            <Icon name="lucide:shield-check" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">E-PKPT Nuxt</h1>
          <p class="text-slate-400 text-sm">Sign in to access the dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div v-if="errorMessage" class="alert alert-error bg-red-500/20 border-red-500/50 text-red-200 text-sm py-3 animate-shake">
            <Icon name="lucide:alert-circle" />
            <span>{{ errorMessage }}</span>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-slate-300 font-medium">Username</span>
            </label>
            <div class="relative">
              <input 
                v-model="username" 
                type="text" 
                placeholder="Enter your username" 
                class="input input-bordered w-full bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pl-10 h-12 transition-all"
                required
              />
              <Icon name="lucide:user" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-slate-300 font-medium">Password</span>
              <a href="#" class="label-text-alt text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</a>
            </label>
            <div class="relative">
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                class="input input-bordered w-full bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pl-10 h-12 transition-all"
                required
              />
              <Icon name="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 border-none hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-bold mt-6"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="divider before:bg-white/10 after:bg-white/10 text-slate-500 text-xs uppercase tracking-widest my-8">Or continue with</div>

        <div class="grid grid-cols-2 gap-4">
          <button class="btn btn-outline border-slate-700 text-slate-300 hover:bg-white/5 hover:border-slate-600 transition-all">
            <Icon name="logos:google-icon" class="w-5 h-5 mr-2" />
            Google
          </button>
          <button class="btn btn-outline border-slate-700 text-slate-300 hover:bg-white/5 hover:border-slate-600 transition-all">
            <Icon name="lucide:github" class="w-5 h-5 mr-2" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
