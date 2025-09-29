<template>
  <div>
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <RouterLink to="/products" class="text-primary-600 font-semibold">Evermos</RouterLink>
        <div class="flex items-center gap-4">
          <RouterLink to="/profile" class="text-gray-700 hover:text-primary-600">Profil</RouterLink>
          <RouterLink to="/my-products" class="text-gray-700 hover:text-primary-600">Produk Saya</RouterLink>
          <RouterLink to="/orders" class="text-gray-700 hover:text-primary-600">Pesanan</RouterLink>
          <RouterLink to="/cart" class="relative inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h13.5m-10.5-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span v-if="count>0" class="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">{{ count }}</span>
          </RouterLink>
        </div>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
const cart = useCartStore()
const { count } = storeToRefs(cart)
</script>
