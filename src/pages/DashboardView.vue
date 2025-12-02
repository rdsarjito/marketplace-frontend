<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="space-y-8">
        <!-- Kategori Pilihan -->
        <section aria-labelledby="kategori-pilihan-heading">
          <h3
            id="kategori-pilihan-heading"
            class="text-xl sm:text-2xl font-bold text-gray-900 mb-4"
          >
            Kategori Pilihan
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 flex flex-col items-center transition-transform duration-200 ease-out hover:shadow-md hover:scale-[1.02] sm:hover:scale-105"
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
        </section>

        <!-- User Info Card -->
        <section aria-labelledby="user-info-heading">
          <div class="card">
            <h3
              id="user-info-heading"
              class="text-lg sm:text-xl font-medium text-gray-900 mb-4"
            >
              Informasi Akun
            </h3>
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
        </section>
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
