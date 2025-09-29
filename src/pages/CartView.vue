<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow p-4">
        <h1 class="text-xl font-semibold mb-4">Keranjang</h1>
        <div v-if="items.length === 0" class="text-gray-600">Keranjang kosong.</div>
        <div v-else class="space-y-4">
          <div v-for="it in items" :key="it.id" class="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden">
              <img v-if="it.image" :src="resolveAssetUrl(it.image)" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="text-gray-900 font-medium">{{ it.nama }}</div>
              <div class="text-gray-600 text-sm">{{ formatIDR(it.harga) }}</div>
              <div class="mt-2 inline-flex items-center border rounded">
                <button class="px-2 py-1" @click="dec(it.id)">-</button>
                <input class="w-12 text-center py-1" type="number" min="1" :value="it.qty" @change="onQtyChange(it.id, $event)" />
                <button class="px-2 py-1" @click="inc(it.id)">+</button>
              </div>
            </div>
            <div class="text-right">
              <div class="text-gray-900 font-semibold">{{ formatIDR(it.harga * it.qty) }}</div>
              <button class="text-red-600 text-sm mt-2" @click="remove(it.id)">Hapus</button>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-4 h-fit">
        <h2 class="text-lg font-semibold mb-3">Ringkasan</h2>
        <div class="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>{{ formatIDR(subtotal) }}</span>
        </div>
        <RouterLink class="btn-primary w-full mt-3 text-center block" :class="{ 'pointer-events-none opacity-50': items.length===0 }" :to="items.length>0 ? '/checkout' : '#'">Checkout</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import { resolveAssetUrl } from '@/services/api'

const cart = useCartStore()
const { items, subtotal } = storeToRefs(cart)

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const dec = (id: number) => {
  const it = cart.items.find(i => i.id === id)
  if (!it) return
  cart.updateQty(id, Math.max(1, it.qty - 1))
}
const inc = (id: number) => {
  const it = cart.items.find(i => i.id === id)
  if (!it) return
  cart.updateQty(id, it.qty + 1)
}
const onQtyChange = (id: number, e: Event) => {
  const val = Number((e.target as HTMLInputElement).value)
  if (Number.isNaN(val) || val < 1) return
  cart.updateQty(id, val)
}
const remove = (id: number) => cart.remove(id)
</script>


