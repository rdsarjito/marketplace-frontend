<template>
  <div class="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
    <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
      <img v-if="imageUrl" :src="imageUrl" alt="Product image" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
    </div>
    <h3 class="text-gray-900 font-medium line-clamp-2 min-h-[3rem]">{{ product.nama_produk }}</h3>
    <div class="mt-2">
      <div class="text-primary-600 font-semibold">{{ formattedPrice }}</div>
      <div class="text-xs text-gray-500">Stok: {{ product.stok }}</div>
    </div>
    <RouterLink class="mt-3 btn-primary py-2 text-sm text-center" :to="`/products/${product.id}`">Lihat Detail</RouterLink>
  </div>

  
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductItem } from '@/types/product'

const props = defineProps<{ product: ProductItem }>()

const imageUrl = computed(() => props.product.photos_product?.[0]?.url || '')

const formattedPrice = computed(() => {
  const raw = props.product.harga_konsumen || props.product.harga_reseller || '0'
  const num = Number(raw)
  if (Number.isNaN(num)) return raw
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>


