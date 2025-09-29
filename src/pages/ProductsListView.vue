<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Produk</h1>

      <div class="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input v-model="q" type="text" class="input-field" placeholder="Cari produk..." @keyup.enter="fetchProducts" />
        <select v-model="categoryId" class="input-field">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nama_kategori || cat.name }}</option>
        </select>
        <button class="btn-primary" @click="fetchProducts">Cari</button>
      </div>

      <div v-if="filteredProducts.length === 0" class="text-gray-600 text-center py-10">
        Tidak ada produk.
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ProductCard v-for="p in filteredProducts" :key="p.id" :product="p" @view="goDetail" />
      </div>

      <div class="mt-6 flex items-center justify-center space-x-3">
        <button class="btn-secondary" :disabled="page<=1" @click="prevPage">Sebelumnya</button>
        <span class="text-sm text-gray-600">Halaman {{ page }}</span>
        <button class="btn-secondary" :disabled="!hasMore" @click="nextPage">Berikutnya</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService } from '@/services/api'
import ProductCard from '@/components/ProductCard.vue'
import type { ProductItem } from '@/types/product'

const products = ref<ProductItem[]>([])
const categories = ref<any[]>([])
const page = ref(1)
const pageSize = ref(20)
const q = ref('')
const categoryId = ref('')
const hasMore = ref(false)

const fetchCategories = async () => {
  try {
    const res = await apiService.getCategories()
    categories.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    categories.value = []
  }
}

const fetchProducts = async () => {
  const res = await apiService.getProducts({ page: page.value, page_size: pageSize.value, q: q.value || undefined, category_id: categoryId.value || undefined })
  products.value = Array.isArray(res.data) ? res.data : []
  hasMore.value = products.value.length === pageSize.value
}

const filteredProducts = computed(() => {
  const byCategory = categoryId.value
    ? products.value.filter(p => (p.id_category ?? p.category?.id) === Number(categoryId.value))
    : products.value
  const keyword = q.value.trim().toLowerCase()
  if (!keyword) return byCategory
  return byCategory.filter(p =>
    p.nama_produk.toLowerCase().includes(keyword) ||
    (p.deskripsi || '').toLowerCase().includes(keyword)
  )
})

const prevPage = async () => {
  if (page.value > 1) {
    page.value -= 1
    await fetchProducts()
  }
}

const nextPage = async () => {
  if (hasMore.value) {
    page.value += 1
    await fetchProducts()
  }
}

const goDetail = (p: ProductItem) => {
  // placeholder: route to detail page when implemented
  console.log('view product', p.slug)
}

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})
</script>


