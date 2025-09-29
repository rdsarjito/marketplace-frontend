<template>
  <div>
    <header v-if="showHeader" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <!-- Kiri: Logo -->
        <RouterLink to="/dashboard" class="text-[#03AC0E] font-semibold text-lg">Evermos</RouterLink>

        <!-- Tengah: Kategori + Search -->
        <div class="flex-1 flex items-center gap-2">
          <div class="relative" ref="catRef" @mouseenter="onCatEnter" @mouseleave="onCatLeave">
            <button @click.stop="onCatClick" class="h-10 px-3 rounded-lg border text-sm flex items-center gap-2 hover:border-[#03AC0E]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#03AC0E]"></span>
              Kategori
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
              </svg>
            </button>
            <div v-show="openCat" class="absolute z-40 mt-2 w-56 bg-white border rounded-lg shadow p-2 transition ease-in-out duration-200" :class="openCat ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'">
              <div v-if="catLoading" class="text-sm text-gray-500 px-2 py-1">Sedang memuat…</div>
              <div v-else class="max-h-64 overflow-y-auto">
                <button v-for="c in categories" :key="c.id" @click="selectCategory(c)" class="w-full text-left px-2 py-1 rounded hover:bg-gray-50 text-sm">{{ c.name }}</button>
                <div v-if="!categories.length && !catError" class="text-xs text-gray-500 px-2 py-1">Tidak ada kategori</div>
                <div v-if="catError" class="text-xs text-red-600 px-2 py-1">{{ catError }}</div>
              </div>
            </div>
          </div>
          <form @submit.prevent="submitSearch" class="flex-1 flex items-stretch">
            <input v-model="q" type="text" class="input-field rounded-r-none h-10" placeholder="Cari di Evermos" />
            <button class="btn-primary rounded-l-none h-10">Cari</button>
          </form>
        </div>

        <!-- Kanan: Icons & Dropdowns -->
        <div class="ml-auto flex items-center gap-3">
          <!-- Notifikasi -->
          <button class="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50" @click="alertInfo('Fitur notifikasi dummy')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-700"><path d="M12 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z"/><path d="M8 16a4 4 0 008 0H8z"/></svg>
            <span v-if="notifCount>0" class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-full">{{ notifCount }}</span>
          </button>

          <!-- Pesan -->
          <button class="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50" @click="alertInfo('Fitur pesan dummy')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-700"><path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V5z"/></svg>
            <span v-if="msgCount>0" class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-full">{{ msgCount }}</span>
          </button>

          <!-- Cart -->
          <RouterLink to="/cart" class="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h13.5m-10.5-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span v-if="count>0" class="absolute -top-1 -right-1 bg-[#03AC0E] text-white text-[10px] px-1 py-0.5 rounded-full">{{ count }}</span>
          </RouterLink>

          <!-- Dropdown Toko -->
          <div class="relative" ref="shopRef" @mouseenter="onShopEnter" @mouseleave="onShopLeave">
            <button @click.stop="onShopClick" class="h-10 px-3 rounded-lg border text-sm hover:border-[#03AC0E]">Toko</button>
            <div v-show="openShop" class="absolute right-0 z-40 mt-2 w-44 bg-white border rounded-lg shadow p-2 transition ease-in-out duration-200" :class="openShop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'">
              <RouterLink to="/my-products" class="block px-2 py-1 text-sm rounded hover:bg-gray-50">Produk Saya</RouterLink>
            </div>
          </div>

          <!-- Dropdown Profile -->
          <div class="relative" ref="profileRef" @mouseenter="onProfileEnter" @mouseleave="onProfileLeave">
            <button @click.stop="onProfileClick" class="h-10 px-3 rounded-lg border text-sm hover:border-[#03AC0E]">Profile</button>
            <div v-show="openProfile" class="absolute right-0 z-40 mt-2 w-44 bg-white border rounded-lg shadow p-2 transition ease-in-out duration-200" :class="openProfile ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'">
              <RouterLink to="/profile" class="block px-2 py-1 text-sm rounded hover:bg-gray-50">Lihat Profil</RouterLink>
              <button class="block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-50 text-red-600" @click="logout">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <router-view />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import Toast from '@/components/Toast.vue'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService } from '@/services/api'
import { useAuthStore } from '@/store/auth'

const cart = useCartStore()
const { count } = storeToRefs(cart)

const router = useRouter()
const route = useRoute()
const showHeader = computed(() => {
  const p = route.path
  return !(p.startsWith('/login') || p.startsWith('/register'))
})
const q = ref<string>((route.query.q as string) || '')
const selectedCategoryId = ref<number | null>(route.query.category_id ? Number(route.query.category_id) : null)
const openCat = ref(false)
const openShop = ref(false)
const openProfile = ref(false)
const notifCount = ref(2)
const msgCount = ref(1)
const categories = ref<{ id: number, name: string }[]>([])
const catLoading = ref(false)
const catError = ref('')

const loadCategories = async () => {
  try {
    catLoading.value = true
    catError.value = ''
    const res = await apiService.getCategories()
    const arr = Array.isArray(res.data) ? res.data : []
    categories.value = arr.map((c: any) => ({ id: c.id, name: c.name || c.nama || c.nama_kategori || 'Kategori' }))
  } catch (e: any) {
    catError.value = 'Gagal memuat kategori'
    categories.value = []
  } finally {
    catLoading.value = false
  }
}

const toggleCat = () => {
  const next = !openCat.value
  openCat.value = next
  if (next) { openShop.value = false; openProfile.value = false }
}
const selectCategory = (c: any) => {
  selectedCategoryId.value = c.id
  openCat.value = false
  router.push({ path: '/products', query: { category_id: c.id } })
}
const toggleShop = () => {
  const next = !openShop.value
  openShop.value = next
  if (next) { openCat.value = false; openProfile.value = false }
}
const toggleProfile = () => {
  const next = !openProfile.value
  openProfile.value = next
  if (next) { openCat.value = false; openShop.value = false }
}

// Hover handlers (desktop) + click handlers for mobile fallback
const isMobile = computed(() => window.matchMedia('(max-width: 640px)').matches)
let catHideTimer: number | null = null
const onCatEnter = () => {
  if (catHideTimer) { clearTimeout(catHideTimer); catHideTimer = null }
  if (!isMobile.value) { openCat.value = true; openShop.value = false; openProfile.value = false }
}
const onCatLeave = () => {
  if (!isMobile.value) {
    catHideTimer = window.setTimeout(() => { openCat.value = false }, 150)
  }
}
const onCatClick = () => { if (isMobile.value) toggleCat() }

let shopHideTimer: number | null = null
const onShopEnter = () => {
  if (shopHideTimer) { clearTimeout(shopHideTimer); shopHideTimer = null }
  if (!isMobile.value) { openShop.value = true; openCat.value = false; openProfile.value = false }
}
const onShopLeave = () => {
  if (!isMobile.value) {
    shopHideTimer = window.setTimeout(() => { openShop.value = false }, 150)
  }
}
const onShopClick = () => { if (isMobile.value) toggleShop() }

let profileHideTimer: number | null = null
const onProfileEnter = () => {
  if (profileHideTimer) { clearTimeout(profileHideTimer); profileHideTimer = null }
  if (!isMobile.value) { openProfile.value = true; openCat.value = false; openShop.value = false }
}
const onProfileLeave = () => {
  if (!isMobile.value) {
    profileHideTimer = window.setTimeout(() => { openProfile.value = false }, 150)
  }
}
const onProfileClick = () => { if (isMobile.value) toggleProfile() }
const alertInfo = (msg: string) => { console.log(msg) }
const submitSearch = () => {
  router.push({ path: '/products', query: { q: q.value || undefined, category_id: selectedCategoryId.value || undefined } })
}
const auth = useAuthStore()
const logout = () => {
  auth.logout()
  openProfile.value = false
  router.push('/login')
}

onMounted(() => {
  loadCategories()
})

// Close on outside click
const catRef = ref<HTMLElement | null>(null)
const shopRef = ref<HTMLElement | null>(null)
const profileRef = ref<HTMLElement | null>(null)
const onDocClick = (e: MouseEvent) => {
  const t = e.target as Node
  if (openCat.value && catRef.value && !catRef.value.contains(t)) openCat.value = false
  if (openShop.value && shopRef.value && !shopRef.value.contains(t)) openShop.value = false
  if (openProfile.value && profileRef.value && !profileRef.value.contains(t)) openProfile.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
