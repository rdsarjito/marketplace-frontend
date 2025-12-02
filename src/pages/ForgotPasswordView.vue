<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-[#03AC0E] mb-2">Warung Budeh Ramah</h2>
        <h3 class="text-2xl font-bold text-gray-900">Lupa Password</h3>
        <p class="mt-2 text-sm text-gray-600">
          Masukkan email Anda untuk mendapatkan link reset password
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="submitForgotPassword" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.email }"
                placeholder="Masukkan email Anda"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
              <span v-else>Kirim Link Reset</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Ingat password Anda?
              <RouterLink to="/login" class="font-medium text-[#03AC0E] hover:text-[#028A0B]">
                Kembali ke Login
              </RouterLink>
            </p>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import { useToastStore } from '@/store/toast'

const router = useRouter()
const toast = useToastStore()

const form = ref({
  email: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const successMessage = ref('')

const submitForgotPassword = async () => {
  // Reset errors
  errors.value = {}
  successMessage.value = ''

  // Basic validation
  if (!form.value.email) {
    errors.value.email = 'Email harus diisi'
    return
  }

  if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
    return
  }

  loading.value = true

  try {
    const response = await apiService.forgotPassword(form.value.email)
    
    if (response.status) {
      successMessage.value = response.message || 'Link reset password telah dikirim ke email Anda'
      form.value.email = ''
    } else {
      toast.error(response.message || 'Terjadi kesalahan')
    }
  } catch (error: any) {
    console.error('Forgot password error:', error)
    toast.error('Terjadi kesalahan saat mengirim link reset password')
  } finally {
    loading.value = false
  }
}
</script>

