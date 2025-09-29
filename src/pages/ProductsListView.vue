<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div v-if="activeCategoryLabel" class="mb-3 text-sm text-gray-700">
        <span class="text-gray-500">Kategori:</span>
        <span class="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
          {{ activeCategoryLabel }}
        </span>
      </div>

      

      <div v-if="loading">
        <SkeletonList :columns="'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'" :count="10" />
      </div>
      <EmptyState v-else-if="filteredProducts.length === 0" title="Produk tidak ditemukan" description="Produk tidak tersedia untuk kriteria saat ini." />
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
import { ref, onMounted, computed, watch } from 'vue'
import { apiService } from '@/services/api'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { ProductItem } from '@/types/product'

const products = ref<ProductItem[]>([])
const loading = ref(false)
const categories = ref<any[]>([])
const page = ref(1)
const pageSize = ref(20)
import { useRoute } from 'vue-router'
const route = useRoute()
const q = ref<string>((route.query.q as string) || '')
const categoryId = ref<string>((route.query.category_id as string) || '')
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
  loading.value = true
  try {
    const res = await apiService.getProducts({ page: page.value, page_size: pageSize.value, q: q.value || undefined, category_id: categoryId.value || undefined })
    products.value = Array.isArray(res.data) ? res.data : []
    hasMore.value = products.value.length === pageSize.value
  } finally {
    loading.value = false
  }
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

const activeCategoryLabel = computed(() => {
  const id = Number(categoryId.value || 0)
  if (!id) return ''
  const c = categories.value.find((x: any) => Number(x.id) === id)
  return c ? (c.nama_kategori || c.name) : ''
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

const resetFilters = async () => {
  q.value = ''
  categoryId.value = ''
  page.value = 1
  await fetchProducts()
}

// React to route query changes (from header search/category)
watch(() => route.query.q, async (newQ) => {
  q.value = (newQ as string) || ''
  page.value = 1
  await fetchProducts()
})

watch(() => route.query.category_id, async (newCat) => {
  categoryId.value = (newCat as string) || ''
  page.value = 1
  await fetchProducts()
})
</script>


