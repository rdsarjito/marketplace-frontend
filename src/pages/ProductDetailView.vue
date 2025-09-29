<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
      <div v-if="!product" class="text-center text-gray-600">Memuat...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img :src="activeImage || fallbackImage" alt="Product" class="w-full h-full object-cover" />
          </div>
          <div class="mt-3 grid grid-cols-5 gap-2">
            <button
              v-for="photo in product.photos_product || []"
              :key="photo.id"
              class="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-primary-500"
              @click="activeImage = photo.url"
            >
              <img :src="photo.url" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ product.nama_produk }}</h1>
          <div class="mt-2 text-primary-600 text-2xl font-semibold">{{ formattedPrice }}</div>
          <div class="mt-1 text-sm text-gray-500">Stok: {{ product.stok }}</div>
          <div class="mt-4 prose max-w-none" v-html="formattedDescription"></div>
          <div class="mt-6 flex space-x-3">
            <button class="btn-primary">Tambah ke Keranjang</button>
            <button class="btn-secondary">Beli Sekarang</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/services/api'
import type { ProductItem } from '@/types/product'

const route = useRoute()
const product = ref<ProductItem | null>(null)
const activeImage = ref('')

const fallbackImage = 'https://via.placeholder.com/800x800?text=No+Image'

const formattedPrice = computed(() => {
  if (!product.value) return ''
  const raw = product.value.harga_konsumen || product.value.harga_reseller || '0'
  const num = Number(raw)
  if (Number.isNaN(num)) return raw
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
})

const formattedDescription = computed(() => {
  return (product.value?.deskripsi || '').replace(/\n/g, '<br/>')
})

onMounted(async () => {
  const id = route.params.id as string
  const res = await apiService.getProductDetail(id)
  product.value = res.data as any
  activeImage.value = product.value?.photos_product?.[0]?.url || ''
})
</script>


