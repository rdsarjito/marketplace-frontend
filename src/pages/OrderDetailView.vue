<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow p-4">
      <h1 class="text-xl font-semibold mb-4">Detail Pesanan</h1>
      <div v-if="loading" class="text-gray-600">Memuat...</div>
      <div v-else-if="!order" class="text-gray-600">Tidak ditemukan.</div>
      <div v-else>
        <div class="text-gray-900 font-medium">TRX #{{ order.id }}</div>
        <div class="text-sm text-gray-600">Total: {{ formatIDR(order.harga_total) }}</div>
        <div class="mt-4">
          <h2 class="text-lg font-semibold">Item</h2>
          <template v-if="items.length > 0">
            <div class="mt-2 divide-y">
              <div v-for="d in items" :key="d.id" class="py-2 flex justify-between text-sm">
                <span>{{ d.nama_produk || d.product?.nama_produk || ('Produk #' + d.id_produk) }} × {{ d.kuantitas }}</span>
                <span>{{ formatIDR(d.harga_total) }}</span>
              </div>
            </div>
          </template>
          <p v-else class="text-sm text-gray-600 mt-2">Item tidak tersedia untuk pesanan ini.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/services/api'

const route = useRoute()
const order = ref<any>(null)
const items = ref<any[]>([])
const loading = ref(false)
const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await apiService.getOrderDetail(id)
    order.value = res.data
    items.value = (order.value?.detail_trx || order.value?.detail || []) as any[]
  } finally {
    loading.value = false
  }
})
</script>


