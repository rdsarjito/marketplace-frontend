<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="mt-4 text-gray-600">Memuat status pembayaran...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <div class="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="checkPayment" class="btn-primary">Coba Lagi</button>
        </div>

        <div v-else-if="transaction" class="space-y-6">
          <!-- Payment Status Badge -->
          <div class="text-center">
            <div v-if="paymentStatus === 'paid'" class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div v-else-if="paymentStatus === 'expired'" class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
              <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div v-else-if="paymentStatus === 'failed' || paymentStatus === 'cancelled'" class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-4">
              <svg class="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div v-else class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-4">
              <svg class="w-12 h-12 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ statusTitle }}</h1>
            <p class="text-gray-600">{{ statusDescription }}</p>
          </div>

          <!-- Transaction Info -->
          <div class="border-t pt-6 space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Nomor Invoice:</span>
              <span class="font-medium">{{ transaction.kode_invoice || transaction.kode_invoice || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Metode Pembayaran:</span>
              <span class="font-medium">{{ formatPaymentMethod(transaction.method_bayar) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status Pembayaran:</span>
              <span class="font-medium" :class="statusBadgeClass">{{ formatPaymentStatus(transaction.payment_status) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Pembayaran:</span>
              <span class="font-semibold text-lg">{{ formatIDR(transaction.harga_total) }}</span>
            </div>
            <div v-if="transaction.payment_expired_at" class="flex justify-between">
              <span class="text-gray-600">Batas Waktu Pembayaran:</span>
              <span class="font-medium">{{ formatDate(transaction.payment_expired_at) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="border-t pt-6 space-y-3">
            <div v-if="paymentStatus === 'pending_payment' && transaction.payment_url" class="space-y-3">
              <p class="text-sm text-gray-600 text-center">Silakan selesaikan pembayaran Anda</p>
              <button @click="redirectToPayment" class="btn-primary w-full">
                Lanjutkan Pembayaran
              </button>
              <button @click="checkPayment" class="btn-secondary w-full">
                Periksa Status Pembayaran
              </button>
            </div>
            <div v-else-if="paymentStatus === 'paid'" class="space-y-3">
              <p class="text-sm text-green-600 text-center">Pembayaran Anda telah berhasil. Pesanan sedang diproses.</p>
              <button @click="goToOrders" class="btn-primary w-full">
                Lihat Pesanan
              </button>
            </div>
            <div v-else-if="paymentStatus === 'expired' || paymentStatus === 'failed' || paymentStatus === 'cancelled'" class="space-y-3">
              <p class="text-sm text-gray-600 text-center">Pembayaran tidak dapat diproses. Silakan buat pesanan baru.</p>
              <button @click="goToProducts" class="btn-primary w-full">
                Belanja Lagi
              </button>
            </div>
            <div v-else class="space-y-3">
              <button @click="checkPayment" class="btn-secondary w-full">
                Periksa Status Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import { useToastStore } from '@/store/toast'

const route = useRoute()
const router = useRouter()
const transaction = ref<any>(null)
const loading = ref(false)
const error = ref('')

const transactionId = computed(() => {
  // Get from route params or localStorage
  const id = route.params.id || localStorage.getItem('pending_transaction_id')
  return id ? Number(id) : null
})

const paymentStatus = computed(() => {
  return transaction.value?.payment_status || 'pending_payment'
})

const statusTitle = computed(() => {
  switch (paymentStatus.value) {
    case 'paid':
      return 'Pembayaran Berhasil'
    case 'expired':
      return 'Pembayaran Kadaluarsa'
    case 'failed':
      return 'Pembayaran Gagal'
    case 'cancelled':
      return 'Pembayaran Dibatalkan'
    case 'pending_payment':
      return 'Menunggu Pembayaran'
    default:
      return 'Status Pembayaran'
  }
})

const statusDescription = computed(() => {
  switch (paymentStatus.value) {
    case 'paid':
      return 'Pembayaran Anda telah berhasil diproses. Pesanan sedang dipersiapkan.'
    case 'expired':
      return 'Waktu pembayaran telah habis. Silakan buat pesanan baru.'
    case 'failed':
      return 'Pembayaran gagal diproses. Silakan coba lagi atau gunakan metode pembayaran lain.'
    case 'cancelled':
      return 'Pembayaran telah dibatalkan.'
    case 'pending_payment':
      return 'Silakan selesaikan pembayaran Anda untuk melanjutkan proses pesanan.'
    default:
      return 'Memeriksa status pembayaran...'
  }
})

const statusBadgeClass = computed(() => {
  switch (paymentStatus.value) {
    case 'paid':
      return 'text-green-600'
    case 'expired':
    case 'failed':
    case 'cancelled':
      return 'text-red-600'
    default:
      return 'text-yellow-600'
  }
})

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const formatPaymentMethod = (method: string) => {
  const methods: { [key: string]: string } = {
    'COD': 'Cash on Delivery',
    'virtual_account': 'Virtual Account',
    'e_wallet': 'E-Wallet',
    'bank_transfer': 'Bank Transfer',
    'credit_card': 'Credit Card'
  }
  return methods[method] || method
}

const formatPaymentStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    'pending_payment': 'Menunggu Pembayaran',
    'paid': 'Sudah Dibayar',
    'expired': 'Kadaluarsa',
    'failed': 'Gagal',
    'cancelled': 'Dibatalkan'
  }
  return statuses[status] || status
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTransaction = async () => {
  if (!transactionId.value) {
    error.value = 'Transaction ID tidak ditemukan'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await apiService.getOrderDetail(transactionId.value)
    transaction.value = res.data
  } catch (e: any) {
    error.value = e?.message || 'Gagal memuat data transaksi'
  } finally {
    loading.value = false
  }
}

const checkPayment = async () => {
  if (!transactionId.value) {
    error.value = 'Transaction ID tidak ditemukan'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await apiService.checkPaymentStatus(transactionId.value)
    // Reload transaction after checking
    await loadTransaction()
    useToastStore().success('Status pembayaran telah diperbarui')
  } catch (e: any) {
    error.value = e?.message || 'Gagal memeriksa status pembayaran'
    useToastStore().error(error.value)
  } finally {
    loading.value = false
  }
}

const redirectToPayment = () => {
  if (transaction.value?.payment_url) {
    window.location.href = transaction.value.payment_url
  }
}

const goToOrders = () => {
  localStorage.removeItem('pending_transaction_id')
  router.push('/orders')
}

const goToProducts = () => {
  localStorage.removeItem('pending_transaction_id')
  router.push('/products')
}

onMounted(async () => {
  // Check if redirected from Midtrans (check query params)
  const orderId = route.query.order_id as string
  const statusCode = route.query.status_code as string

  // If redirected from Midtrans, try to find transaction by invoice code
  if (orderId && !transactionId.value) {
    // Try to find transaction by invoice code
    try {
      const ordersRes = await apiService.getOrders()
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : []
      const found = orders.find((o: any) => o.kode_invoice === orderId)
      if (found) {
        localStorage.setItem('pending_transaction_id', String(found.id))
        await loadTransaction()
        // Check payment status if redirected from Midtrans
        if (statusCode) {
          await checkPayment()
        }
        return
      }
    } catch (e) {
      console.error('Failed to find transaction:', e)
    }
  }

  // Load transaction if ID is available
  if (transactionId.value) {
    await loadTransaction()
    
    // If transaction loaded and has payment_url, auto-redirect to Midtrans
    if (transaction.value?.payment_url && paymentStatus.value === 'pending_payment') {
      // Small delay for better UX (show loading state)
      setTimeout(() => {
        redirectToPayment()
      }, 1500)
      return
    }
    
    // Auto-check payment status on mount if redirected from Midtrans
    if (statusCode) {
      setTimeout(() => {
        checkPayment()
      }, 1000)
    }
  } else {
    error.value = 'Transaction ID tidak ditemukan'
  }
})
</script>

