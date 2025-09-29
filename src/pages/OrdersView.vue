<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow p-4">
      <h1 class="text-xl font-semibold mb-4">Riwayat Pesanan</h1>
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input v-model="search" type="text" class="input-field sm:flex-1" placeholder="Cari nomor invoice / ID pesanan" />
        <select v-model="statusFilter" class="input-field sm:w-64">
          <option value="ALL">Semua status</option>
          <option value="BARU">Baru</option>
          <option value="DIPROSES">Diproses</option>
          <option value="SELESAI">Selesai</option>
        </select>
      </div>
      <div v-if="loading" class="text-gray-600">
        <SkeletonList :columns="'grid-cols-1'" :count="4" />
      </div>
      <EmptyState v-else-if="filteredOrders.length===0" title="Belum ada pesanan yang cocok" description="Coba ubah kata kunci atau filter status.">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-500">
            <path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 1115.534 3.977l2.369 2.37a.75.75 0 11-1.06 1.06l-2.37-2.369A8.25 8.25 0 012.25 13.5zm8.25-6a.75.75 0 01.75.75v3.75H15a.75.75 0 010 1.5h-3.75V18a.75.75 0 01-1.5 0v-4.5H6a.75.75 0 010-1.5h3.75V8.25a.75.75 0 01.75-.75z" clip-rule="evenodd" />
          </svg>
        </template>
        <template #action>
          <RouterLink class="btn-primary" to="/products">Belanja sekarang</RouterLink>
        </template>
      </EmptyState>
      <div v-else class="divide-y">
        <div v-for="o in filteredOrders" :key="o.id" class="py-3 flex items-center justify-between">
          <div>
            <div class="text-gray-900 font-medium">
              {{ displayInvoice(o) }}
              <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="badgeClass(orderStatus(o))">{{ orderStatus(o) }}</span>
            </div>
            <div class="text-sm text-gray-600">Total: {{ formatIDR(o.harga_total) }}</div>
          </div>
          <RouterLink class="btn-secondary" :to="`/orders/${o.id}`">Detail</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiService } from '@/services/api'
import SkeletonList from '@/components/SkeletonList.vue'
import EmptyState from '@/components/EmptyState.vue'

const orders = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref<'ALL' | 'BARU' | 'DIPROSES' | 'SELESAI'>('ALL')
const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
const badgeClass = (st: 'BARU' | 'DIPROSES' | 'SELESAI') => {
  if (st === 'SELESAI') return 'bg-green-100 text-green-800'
  if (st === 'DIPROSES') return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

const orderStatus = (o: any): 'BARU' | 'DIPROSES' | 'SELESAI' => {
  const raw = (o.status || o.status_trx || o.Status || '').toString().toUpperCase()
  if (raw.includes('SELESAI') || raw === 'DONE' || raw === 'COMPLETED') return 'SELESAI'
  if (raw.includes('PROSES') || raw === 'PROCESS' || raw === 'IN_PROGRESS') return 'DIPROSES'
  return 'BARU'
}

const displayInvoice = (o: any): string => {
  const invoice = o.no_invoice || o.invoice || o.nomor_invoice || null
  return invoice ? `Invoice ${invoice}` : `TRX #${o.id}`
}

const filteredOrders = computed(() => {
  const q = search.value.trim().toLowerCase()
  const f = statusFilter.value
  return orders.value.filter((o: any) => {
    const statusOk = f === 'ALL' ? true : orderStatus(o) === f
    if (!statusOk) return false
    if (!q) return true
    const invoice = (o.no_invoice || o.invoice || o.nomor_invoice || '').toString().toLowerCase()
    const idStr = (o.id ?? '').toString().toLowerCase()
    return invoice.includes(q) || idStr.includes(q)
  })
})

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



