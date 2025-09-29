<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow p-4">
      <h1 class="text-xl font-semibold mb-4">Riwayat Pesanan</h1>
      <div v-if="loading" class="text-gray-600">Memuat...</div>
      <div v-else-if="orders.length===0" class="text-gray-600">Belum ada pesanan.</div>
      <div v-else class="divide-y">
        <div v-for="o in orders" :key="o.id" class="py-3 flex items-center justify-between">
          <div>
            <div class="text-gray-900 font-medium">TRX #{{ o.id }}</div>
            <div class="text-sm text-gray-600">Total: {{ formatIDR(o.harga_total) }}</div>
          </div>
          <RouterLink class="btn-secondary" :to="`/orders/${o.id}`">Detail</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiService } from '@/services/api'

const orders = ref<any[]>([])
const loading = ref(false)
const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

onMounted(async () => {
  loading.value = true
  try {
    const res = await apiService.getOrders()
    orders.value = Array.isArray(res.data) ? res.data : []
  } finally {
    loading.value = false
  }
})
</script>


