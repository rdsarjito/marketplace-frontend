<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="text-lg font-semibold mb-3">Alamat Pengiriman</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input v-model="form.nama_penerima" type="text" class="input-field" placeholder="Nama penerima" />
            <input v-model="form.no_telp" type="tel" class="input-field" placeholder="No. Telepon" />
            <select v-model="form.id_provinsi" class="input-field" @change="loadCities">
              <option value="">Pilih Provinsi</option>
              <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <select v-model="form.id_kota" class="input-field" :disabled="!form.id_provinsi">
              <option value="">Pilih Kota</option>
              <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <input v-model="form.alamat" type="text" class="input-field sm:col-span-2" placeholder="Alamat lengkap" />
            <input v-model="form.kode_pos" type="text" class="input-field" placeholder="Kode pos" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="text-lg font-semibold mb-3">Pengiriman</h2>
          <div class="space-y-2">
            <label class="flex items-center gap-3">
              <input type="radio" value="REG" v-model="shippingMethod" />
              <span>REG (3-5 hari) - {{ formatIDR(shippingCost) }}</span>
            </label>
            <label class="flex items-center gap-3">
              <input type="radio" value="YES" v-model="shippingMethod" />
              <span>YES (1-2 hari) - {{ formatIDR(shippingCostFast) }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4 h-fit">
        <h2 class="text-lg font-semibold mb-3">Ringkasan Pesanan</h2>
        <div class="space-y-2 mb-3">
          <div v-for="it in items" :key="it.id" class="flex justify-between text-sm text-gray-700">
            <span>{{ it.nama }} × {{ it.qty }}</span>
            <span>{{ formatIDR(it.harga * it.qty) }}</span>
          </div>
        </div>
        <div class="flex justify-between text-gray-700 mb-1"><span>Subtotal</span><span>{{ formatIDR(subtotal) }}</span></div>
        <div class="flex justify-between text-gray-700 mb-1"><span>Ongkir</span><span>{{ formatIDR(selectedShippingCost) }}</span></div>
        <div class="flex justify-between text-gray-900 font-semibold border-t pt-2"><span>Total</span><span>{{ formatIDR(total) }}</span></div>
        <button class="btn-primary w-full mt-3" :disabled="!canPlaceOrder" @click="ensureAddressAndPlaceOrder">Buat Pesanan</button>
        <p v-if="successMsg" class="text-green-600 text-sm mt-2">{{ successMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiService } from '@/services/api'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'

const cart = useCartStore()
const { items, subtotal } = storeToRefs(cart)

const provinces = ref<any[]>([])
const cities = ref<any[]>([])
const form = ref({
  nama_penerima: '',
  no_telp: '',
  id_provinsi: '',
  id_kota: '',
  alamat: '',
  kode_pos: ''
})

const shippingMethod = ref<'REG' | 'YES'>('REG')
const shippingCost = computed(() => 20000)
const shippingCostFast = computed(() => 40000)
const selectedShippingCost = computed(() => shippingMethod.value === 'YES' ? shippingCostFast.value : shippingCost.value)
const total = computed(() => subtotal.value + selectedShippingCost.value)
const canPlaceOrder = computed(() => items.value.length > 0 && !!form.value.nama_penerima && !!form.value.alamat && !!form.value.id_kota)
const successMsg = ref('')

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const loadProvinces = async () => {
  const res = await fetch('http://127.0.0.1:8080/api/v1/provcity/listprovincies')
  const data = await res.json()
  provinces.value = data.data || []
}

const loadCities = async () => {
  if (!form.value.id_provinsi) { cities.value = []; form.value.id_kota = ''; return }
  const res = await fetch(`http://127.0.0.1:8080/api/v1/provcity/listcities/${form.value.id_provinsi}`)
  const data = await res.json()
  cities.value = data.data || []
}

const ensureAddressAndPlaceOrder = async () => {
  const addressRes = await fetch('http://127.0.0.1:8080/api/v1/user/alamat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
    },
    body: JSON.stringify({
      judul_alamat: 'Checkout',
      nama_penerima: form.value.nama_penerima,
      no_telp: form.value.no_telp,
      detail_alamat: `${form.value.alamat}, ${form.value.id_kota}, ${form.value.id_provinsi}, ${form.value.kode_pos}`
    })
  })
  const addressData = await addressRes.json()
  if (!addressRes.ok) throw new Error(addressData.message || 'Gagal membuat alamat')
  const idAlamat = addressData.data?.id || addressData.data?.ID || addressData.data?.Id || 0

  // Ensure each item has id_toko; fetch detail if missing
  const detail_trx = await Promise.all(cart.items.map(async (it) => {
    let id_toko = it.id_toko
    if (!id_toko) {
      try {
        const detail = await apiService.getProductDetail(it.id)
        id_toko = (detail.data as any)?.id_toko || (detail.data as any)?.toko?.id || 0
      } catch {}
    }
    return {
      id_produk: it.id,
      id_toko: id_toko || 0,
      kuantitas: it.qty,
      harga_total: it.harga * it.qty
    }
  }))

  const trxPayload = {
    harga_total: subtotal.value,
    method_bayar: 'COD',
    id_alamat: idAlamat,
    detail_trx
  }

  await apiService.createTransaction(trxPayload)

  cart.clear()
  successMsg.value = 'Pesanan berhasil dibuat.'
}

onMounted(() => {
  loadProvinces()
})
</script>


