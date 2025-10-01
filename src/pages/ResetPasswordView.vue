<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-[#03AC0E] mb-2">Evermos</h2>
        <h3 class="text-2xl font-bold text-gray-900">Reset Password</h3>
        <p class="mt-2 text-sm text-gray-600">
          Masukkan password baru Anda
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="submitResetPassword" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Masukkan password baru"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.confirmPassword }"
                placeholder="Konfirmasi password baru"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
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
                Memproses...
              </span>
              <span v-else>Reset Password</span>
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

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api'
import { useToastStore } from '@/store/toast'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()

const form = ref({
  password: '',
  confirmPassword: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const token = ref('')

onMounted(() => {
  // Get token from URL query parameter
  token.value = route.query.token as string || ''
  
  if (!token.value) {
    errorMessage.value = 'Token reset password tidak valid atau tidak ditemukan'
  }
})

const submitResetPassword = async () => {
  // Reset errors
  errors.value = {}
  successMessage.value = ''
  errorMessage.value = ''

  // Validation
  if (!form.value.password) {
    errors.value.password = 'Password harus diisi'
    return
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
    return
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi password harus diisi'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Password dan konfirmasi password tidak sama'
    return
  }

  if (!token.value) {
    errorMessage.value = 'Token reset password tidak valid'
    return
  }

  loading.value = true

  try {
    const response = await apiService.resetPassword({
      token: token.value,
      kata_sandi: form.value.password,
      confirm_password: form.value.confirmPassword
    })
    
    if (response.status) {
      successMessage.value = response.message || 'Password berhasil direset'
      form.value.password = ''
      form.value.confirmPassword = ''
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan'
    }
  } catch (error: any) {
    console.error('Reset password error:', error)
    errorMessage.value = error.message || 'Terjadi kesalahan saat reset password'
  } finally {
    loading.value = false
  }
}
</script>

