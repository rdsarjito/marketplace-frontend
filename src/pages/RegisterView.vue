<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Register Form Card -->
      <div class="card">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Register</h2>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Field -->
          <div>
            <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="nama"
              v-model="form.nama"
              type="text"
              required
              class="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
            />
          </div>

          <!-- Phone Field -->
          <div>
            <label for="no_telp" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="no_telp"
              v-model="form.no_telp"
              type="tel"
              required
              class="input-field"
              placeholder="Enter your phone number"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.kata_sandi"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Date of Birth Field -->
          <div>
            <label for="tanggal_lahir" class="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              id="tanggal_lahir"
              v-model="form.tanggal_lahir"
              type="date"
              required
              class="input-field"
            />
          </div>

          <!-- Gender Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="form.jenis_kelamin"
                  type="radio"
                  value="L"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.jenis_kelamin"
                  type="radio"
                  value="P"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <!-- About Field -->
          <div>
            <label for="tentang" class="block text-sm font-medium text-gray-700 mb-2">
              About
            </label>
            <textarea
              id="tentang"
              v-model="form.tentang"
              required
              rows="3"
              class="input-field"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <!-- Job Field -->
          <div>
            <label for="pekerjaan" class="block text-sm font-medium text-gray-700 mb-2">
              Job
            </label>
            <input
              id="pekerjaan"
              v-model="form.pekerjaan"
              type="text"
              required
              class="input-field"
              placeholder="Enter your job"
            />
          </div>

          <!-- Province Field -->
          <div>
            <label for="id_provinsi" class="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <select
              id="id_provinsi"
              v-model="form.id_provinsi"
              required
              class="input-field"
              @change="loadCities"
            >
              <option value="">Select Province</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
          </div>

          <!-- City Field -->
          <div>
            <label for="id_kota" class="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              id="id_kota"
              v-model="form.id_kota"
              required
              class="input-field"
              :disabled="!form.id_provinsi"
            >
              <option value="">Select City</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Register</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import type { RegisterRequest } from '@/types/auth'
import { useToastStore } from '@/store/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const form = reactive<RegisterRequest>({
  nama: '',
  kata_sandi: '',
  no_telp: '',
  tanggal_lahir: '',
  jenis_kelamin: 'L',
  tentang: '',
  pekerjaan: '',
  email: '',
  id_provinsi: '',
  id_kota: ''
})

const showPassword = ref(false)
const error = ref('')
const provinces = ref([])
const cities = ref([])

const { isLoading } = authStore

const loadProvinces = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8080/api/v1/provcity/listprovincies')
    const data = await response.json()
    provinces.value = data.data
  } catch (err) {
    console.error('Failed to load provinces:', err)
  }
}

const loadCities = async () => {
  if (!form.id_provinsi) {
    cities.value = []
    form.id_kota = ''
    return
  }

  try {
    const response = await fetch(`http://127.0.0.1:8080/api/v1/provcity/listcities/${form.id_provinsi}`)
    const data = await response.json()
    cities.value = data.data
    form.id_kota = ''
  } catch (err) {
    console.error('Failed to load cities:', err)
  }
}

const handleRegister = async () => {
  error.value = ''
  
  try {
    await authStore.register(form)
    toast.success('Akun berhasil dibuat. Silakan login.')
    router.push('/login')
  } catch (err: any) {
    error.value = err.message || 'Registration failed'
  }
}

onMounted(() => {
  loadProvinces()
})
</script>
