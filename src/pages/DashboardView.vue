<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Welcome Card -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h2>
          <p class="text-gray-600">
            You have successfully logged in to the marketplace. This is your personal dashboard where you can manage your account, products, and transactions.
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Profile</p>
                <p class="text-2xl font-semibold text-gray-900">Complete</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Products</p>
                <p class="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Orders</p>
                <p class="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Kategori Pilihan -->
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Kategori Pilihan</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center transition-transform duration-200 ease-out hover:shadow-md hover:scale-105"
              @click="goToCategory(cat)"
            >
              <div class="w-full aspect-square overflow-hidden rounded-md border border-gray-100 mb-3 flex items-center justify-center bg-white">
                <img
                  v-if="cat.photo"
                  :src="resolveAssetUrl(cat.photo)"
                  alt=""
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🛍️</div>
              </div>
              <div class="text-center">
                <div class="text-base font-semibold text-gray-900 leading-tight">{{ firstWord(cat.nama) }}</div>
                <div class="text-sm text-gray-500">{{ restWords(cat.nama) }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- User Info Card -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Your Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Name</label>
              <p class="mt-1 text-sm text-gray-900">{{ user?.nama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Email</label>
              <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Phone</label>
              <p class="mt-1 text-sm text-gray-900">{{ user?.no_telp }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Job</label>
              <p class="mt-1 text-sm text-gray-900">{{ user?.pekerjaan }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500">About</label>
              <p class="mt-1 text-sm text-gray-900">{{ user?.tentang }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { apiService, resolveAssetUrl } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Categories state
const categories = ref<Array<{ id: number; nama: string; photo?: string }>>([])

onMounted(async () => {
  try {
    const res = await apiService.getCategories()
    categories.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    // Fail silently on dashboard extra content
    categories.value = []
  }
})

function firstWord(name: string): string {
  if (!name) return ''
  const parts = name.split(' ')
  return parts[0]
}

function restWords(name: string): string {
  if (!name) return ''
  const parts = name.split(' ')
  return parts.slice(1).join(' ') || ''
}

function goToCategory(cat: { id: number }) {
  const params = new URLSearchParams({ category_id: String(cat.id) })
  router.push(`/products?${params.toString()}`)
}
</script>
