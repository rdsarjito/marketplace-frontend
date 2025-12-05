<template>
  <div>
    <header v-if="showHeader" class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center gap-3 sm:gap-4">
        <!-- Kiri: Logo (truncate di mobile) -->
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-2 text-[#03AC0E] font-semibold text-base sm:text-lg truncate max-w-[40vw] sm:max-w-none"
        >
          <img
            src="@/assets/warung_budeh_ramah.svg"
            alt="Warung Budeh Ramah"
            class="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          />
          <span class="truncate">Warung Budeh Ramah</span>
        </RouterLink>

        <!-- Tengah: Kategori + Search -->
        <div class="flex-1 flex items-center gap-2 min-w-0">
          <!-- Kategori: hanya tampil mulai tablet ke atas, mirip Tokopedia yang fokus ke search di mobile -->
          <div
            class="relative hidden sm:block"
            ref="catRef"
            @mouseenter="onCatEnter"
            @mouseleave="onCatLeave"
          >
            <button
              @click.stop="onCatClick"
              class="h-10 px-3 rounded-lg border text-sm flex items-center gap-2 hover:border-[#03AC0E]"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[#03AC0E]"></span>
              Kategori
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
              </svg>
            </button>
            <div
              v-show="openCat"
              class="absolute z-40 mt-2 w-56 bg-white border rounded-lg shadow p-2 transition ease-in-out duration-200"
              :class="openCat ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'"
            >
              <div v-if="catLoading" class="text-sm text-gray-500 px-2 py-1">Sedang memuat…</div>
              <div v-else class="max-h-64 overflow-y-auto">
                <button
                  v-for="c in categories"
                  :key="c.id"
                  @click="selectCategory(c)"
                  class="w-full text-left px-2 py-1 rounded hover:bg-gray-50 text-sm"
                >
                  {{ c.name }}
                </button>
                <div v-if="!categories.length && !catError" class="text-xs text-gray-500 px-2 py-1">
                  Tidak ada kategori
                </div>
                <div v-if="catError" class="text-xs text-red-600 px-2 py-1">{{ catError }}</div>
              </div>
            </div>
          </div>
          <!-- Search: full width di mobile, compact di tablet/desktop -->
          <form @submit.prevent="submitSearch" class="flex-1 flex items-stretch min-w-0">
            <input
              v-model="q"
              type="text"
              class="input-field rounded-r-none h-10 text-sm"
              placeholder="Cari di Warung Budeh Ramah"
            />
            <button class="btn-primary rounded-l-none h-10 px-3 sm:px-4 text-sm sm:text-base">
              Cari
            </button>
          </form>
        </div>

        <!-- Kanan: Icons & Dropdowns -->
        <div class="ml-auto flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <!-- Notifikasi (sembunyikan badge di layar sangat kecil) -->
          <button
            class="hidden sm:inline-flex relative items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50"
            @click="alertInfo('Fitur notifikasi dummy')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-700"><path d="M12 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z"/><path d="M8 16a4 4 0 008 0H8z"/></svg>
            <span
              v-if="notifCount>0"
              class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-full"
            >
              {{ notifCount }}
            </span>
          </button>

          <!-- Pesan (sembunyikan di layar paling kecil) -->
          <button
            class="hidden sm:inline-flex relative items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50"
            @click="alertInfo('Fitur pesan dummy')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-700"><path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V5z"/></svg>
            <span v-if="msgCount>0" class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-full">{{ msgCount }}</span>
          </button>

          <!-- Cart dropdown (desktop hover, mobile click) -->
          <div class="relative" ref="cartRef" @mouseenter="onCartEnter" @mouseleave="onCartLeave">
            <button @click.stop="onCartClick" class="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h13.5m-10.5-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span v-if="count>0" class="absolute -top-1 -right-1 bg-[#03AC0E] text-white text-[10px] px-1 py-0.5 rounded-full">{{ count }}</span>
            </button>
            <div v-show="openCart" class="absolute right-0 z-40 mt-2 w-80 bg-white border rounded-lg shadow-md p-3 transition ease-in-out duration-200" :class="openCart ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-gray-900">Keranjang ({{ count }})</div>
                <RouterLink to="/cart" class="text-[#03AC0E] text-sm">Lihat</RouterLink>
              </div>
              <div v-if="count === 0" class="py-6 text-center text-sm text-gray-600">Keranjang masih kosong</div>
              <div v-else class="divide-y">
                <div v-for="it in items" :key="it.id" class="py-2 flex items-center">
                  <div class="w-12 h-12 rounded bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                    <img v-if="it.image" :src="resolveAssetUrl(it.image)" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm text-gray-900 line-clamp-2">{{ it.nama }}</div>
                  </div>
                  <div class="ml-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{{ it.qty }} × {{ formatIDR(it.harga) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dropdown Toko (sembunyikan di layar paling kecil, fokus ke search + cart seperti Tokopedia) -->
          <div class="relative hidden sm:block" ref="shopRef" @mouseenter="onShopEnter" @mouseleave="onShopLeave">
            <button
              @click.stop="onShopClick"
              class="h-10 px-2 sm:px-3 rounded-lg text-xs sm:text-sm hover:bg-gray-50"
            >
              Toko
            </button>
            <div v-show="openShop" class="absolute right-0 z-40 mt-2 w-44 bg-white border rounded-lg shadow p-2 transition ease-in-out duration-200" :class="openShop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'">
              <RouterLink to="/my-products" class="block px-2 py-1 text-sm rounded hover:bg-gray-50">Produk Saya</RouterLink>
              <RouterLink to="/categories" class="block px-2 py-1 text-sm rounded hover:bg-gray-50">Kategori</RouterLink>
            </div>
          </div>

          <!-- Dropdown Profile (sembunyikan di layar paling kecil) -->
          <div class="relative hidden sm:block" ref="profileRef" @mouseenter="onProfileEnter" @mouseleave="onProfileLeave">
            <button
              @click.stop="onProfileClick"
              class="h-10 px-2 sm:px-3 rounded-lg text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <div class="w-9 h-9 rounded-full bg-gray-100 border overflow-hidden flex items-center justify-center text-white font-semibold">
                <img
                  v-if="userAvatarUrl"
                  :src="userAvatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                  @error="onAvatarError"
                />
                <span v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#03AC0E] to-emerald-500">
                  {{ userInitial }}
                </span>
              </div>
              <div class="hidden sm:flex flex-col items-start">
                <span class="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{{ userName }}</span>
                <span class="text-xs text-gray-500 truncate max-w-[120px]">{{ userEmailOrPhone }}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
              </svg>
            </button>
            <div
              v-show="openProfile"
              class="absolute right-0 z-40 mt-2 w-80 bg-white border rounded-xl shadow-lg p-3 transition ease-in-out duration-200"
              :class="openProfile ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'"
            >
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div class="w-12 h-12 rounded-full bg-gray-100 border overflow-hidden flex items-center justify-center text-white text-lg font-semibold">
                  <img
                    v-if="userAvatarUrl"
                    :src="userAvatarUrl"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                    @error="onAvatarError"
                  />
                  <span v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#03AC0E] to-emerald-500">
                    {{ userInitial }}
                  </span>
                </div>
                <div class="min-w-0">
                  <div class="text-base font-semibold text-gray-900 truncate">{{ userName }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ userEmailOrPhone }}</div>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2">
                <RouterLink to="/orders" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m-.75-13.5h-4.5A2.25 2.25 0 007.5 4.75v14.5A2.25 2.25 0 009.75 21.5h4.5A2.25 2.25 0 0016.5 19.25V4.75A2.25 2.25 0 0014.25 2.5z" />
                    </svg>
                  </span>
                  <span class="text-sm font-medium text-gray-900">Pembelian</span>
                </RouterLink>
                <RouterLink to="/cart" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h13.5m-10.5-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  </span>
                  <span class="text-sm font-medium text-gray-900">Keranjang</span>
                </RouterLink>
                <RouterLink to="/my-products" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5h16.5M4.5 7.5A1.5 1.5 0 003 9v7.5A1.5 1.5 0 004.5 18h15a1.5 1.5 0 001.5-1.5V9a1.5 1.5 0 00-1.5-1.5M9 7.5V6a3 3 0 013-3 3 3 0 013 3v1.5" />
                    </svg>
                  </span>
                  <span class="text-sm font-medium text-gray-900">Produk Saya</span>
                </RouterLink>
                <RouterLink to="/profile" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.938a3 3 0 014.812 0l.295.401a2.25 2.25 0 001.691.86l.5.022a3 3 0 012.85 3.65l-.114.49a2.25 2.25 0 00.505 1.99l.343.396a3 3 0 01-.21 4.24l-.386.35a2.25 2.25 0 00-.7 2.074l.106.487a3 3 0 01-3.223 3.645l-.497-.063a2.25 2.25 0 00-1.962.75l-.33.384a3 3 0 01-4.542 0l-.33-.384a2.25 2.25 0 00-1.962-.75l-.498.063a3 3 0 01-3.222-3.645l.105-.487a2.25 2.25 0 00-.699-2.074l-.386-.35a3 3 0 01-.21-4.24l.343-.396a2.25 2.25 0 00.505-1.99l-.114-.49a3 3 0 012.85-3.65l.5-.022a2.25 2.25 0 001.69-.86l.296-.401z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.88 9h4.24M9.88 12.25h4.24M9.88 15.5h2.62" />
                    </svg>
                  </span>
                  <span class="text-sm font-medium text-gray-900">Pengaturan</span>
                </RouterLink>
              </div>

              <div class="mt-3 pt-3 border-t">
                <button
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                  @click="logout"
                >
                  <span>Keluar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 12h9m0 0l-3-3m3 3l-3 3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </header>
    <router-view />

    <!-- Bottom Nav (mobile, ala Tokopedia) -->
    <nav
      v-if="showHeader"
      class="fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white sm:hidden"
    >
      <div class="max-w-7xl mx-auto px-2 py-1 flex justify-between text-[11px]">
        <RouterLink
          to="/dashboard"
          class="flex-1 flex flex-col items-center gap-0.5 py-1"
          :class="route.path === '/dashboard' ? 'text-[#03AC0E]' : 'text-gray-500'"
        >
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full">
            <!-- Home icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 11-1.06 1.06L12 5.56 3.84 13.6a.75.75 0 11-1.06-1.06l8.69-8.69z" />
              <path d="M12 5.25L4.5 12.75V20a.75.75 0 00.75.75H9.75a.75.75 0 00.75-.75v-4.5h3v4.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-7.25L12 5.25z" />
            </svg>
          </span>
          <span>Beranda</span>
        </RouterLink>

        <RouterLink
          to="/products"
          class="flex-1 flex flex-col items-center gap-0.5 py-1"
          :class="route.path.startsWith('/products') ? 'text-[#03AC0E]' : 'text-gray-500'"
        >
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full">
            <!-- Produk icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M4.5 5.25A2.25 2.25 0 016.75 3h10.5A2.25 2.25 0 0119.5 5.25v13.5a.75.75 0 01-1.2.6L12 14.25l-6.3 5.1a.75.75 0 01-1.2-.6V5.25z" />
            </svg>
          </span>
          <span>Produk</span>
        </RouterLink>

        <RouterLink
          to="/cart"
          class="flex-1 flex flex-col items-center gap-0.5 py-1"
          :class="route.path === '/cart' ? 'text-[#03AC0E]' : 'text-gray-500'"
        >
          <span class="relative inline-flex items-center justify-center w-6 h-6">
            <!-- Cart icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h13.5m-10.5-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span
              v-if="count>0"
              class="absolute -top-1 -right-2 bg-[#03AC0E] text-white text-[9px] px-1 py-0.5 rounded-full"
            >
              {{ Math.min(count, 99) }}
            </span>
          </span>
          <span>Keranjang</span>
        </RouterLink>

        <RouterLink
          to="/orders"
          class="flex-1 flex flex-col items-center gap-0.5 py-1"
          :class="route.path.startsWith('/orders') ? 'text-[#03AC0E]' : 'text-gray-500'"
        >
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full">
            <!-- Transaksi icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M5.25 4.5A2.25 2.25 0 017.5 2.25h9a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 20.25h-9A2.25 2.25 0 015.25 18V4.5z" />
              <path d="M9 7.5h6a.75.75 0 000-1.5H9a.75.75 0 000 1.5zm0 4.5h6a.75.75 0 000-1.5H9a.75.75 0 000 1.5zm0 4.5h3a.75.75 0 000-1.5H9a.75.75 0 000 1.5z" />
            </svg>
          </span>
          <span>Transaksi</span>
        </RouterLink>

        <RouterLink
          to="/profile"
          class="flex-1 flex flex-col items-center gap-0.5 py-1"
          :class="route.path === '/profile' ? 'text-[#03AC0E]' : 'text-gray-500'"
        >
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full">
            <!-- Akun icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
              <path d="M4.5 20.25a7.5 7.5 0 0115 0 .75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75z" />
            </svg>
          </span>
          <span>Akun</span>
        </RouterLink>
      </div>
    </nav>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import Toast from '@/components/Toast.vue'
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService, resolveAssetUrl } from '@/services/api'
import { useAuthStore } from '@/store/auth'

const cart = useCartStore()
const { count, items } = storeToRefs(cart)

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
const avatarError = ref(false)
const openCart = ref(false)
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

// Cart hover/click behavior
let cartHideTimer: number | null = null
const cartRef = ref<HTMLElement | null>(null)
const onCartEnter = () => {
  if (cartHideTimer) { clearTimeout(cartHideTimer); cartHideTimer = null }
  if (!isMobile.value) openCart.value = true
}
const onCartLeave = () => {
  if (!isMobile.value) cartHideTimer = window.setTimeout(() => { openCart.value = false }, 150)
}
const onCartClick = () => {
  if (isMobile.value) {
    // On mobile, go straight to cart if already open once, else open dropdown
    if (openCart.value) {
      router.push('/cart')
    } else {
      openCart.value = true
    }
  }
}
const alertInfo = (msg: string) => { console.log(msg) }
const submitSearch = () => {
  router.push({ path: '/products', query: { q: q.value || undefined, category_id: selectedCategoryId.value || undefined } })
}
const auth = useAuthStore()
const userName = computed(() => auth.user?.nama || 'Pengguna')
const userEmailOrPhone = computed(() => auth.user?.email || auth.user?.no_telp || 'Akun saya')
const userInitial = computed(() => (userName.value?.[0] || 'U').toUpperCase())
const userAvatarUrl = computed(() => {
  if (avatarError.value) return ''
  const raw = (auth.user as any)?.photo_url || (auth.user as any)?.picture || (auth.user as any)?.avatar || ''
  if (!raw) return ''
  if (typeof raw === 'string' && raw.startsWith('http')) return raw
  return resolveAssetUrl(raw)
})
const onAvatarError = () => { avatarError.value = true }
const logout = () => {
  auth.logout()
  openProfile.value = false
  router.push('/login')
}

onMounted(() => {
  // Only load categories if user is authenticated to prevent 401 loops
  if (auth.isAuthenticated) {
    loadCategories()
  }
})

// Watch for authentication changes to load categories when user logs in
watch(() => auth.isAuthenticated, (isAuth) => {
  if (isAuth) {
    loadCategories()
  } else {
    // Clear categories when user logs out
    categories.value = []
  }
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

// Utils
const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
</script>
