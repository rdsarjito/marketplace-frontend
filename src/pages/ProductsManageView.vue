<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow p-4 lg:col-span-2">
        <h1 class="text-xl font-semibold mb-4">Produk Saya</h1>
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <input v-model="query" type="text" class="input-field sm:flex-1" placeholder="Cari nama produk..." />
        </div>
        <div v-if="loading">
          <SkeletonList :columns="'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'" :count="8" />
        </div>
        <EmptyState v-else-if="paginatedProducts.length === 0" title="Tidak ada produk" description="Coba ubah kata kunci pencarian.">
          <template #action>
            <button class="btn-secondary" @click="query=''; page=1">Reset</button>
          </template>
        </EmptyState>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="p in paginatedProducts" :key="p.id" class="border rounded p-3">
            <div class="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
              <img v-if="p.photos_product && p.photos_product.length" :src="resolveAssetUrl(p.photos_product[0].url)" class="w-full h-full object-cover" />
            </div>
            <div class="text-gray-900 font-medium line-clamp-2">{{ p.nama_produk }}</div>
            <div class="text-sm text-gray-600 mt-1">{{ formatIDR(Number(p.harga_konsumen || p.harga_reseller || 0)) }}</div>
            <div class="mt-3 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <label class="text-xs text-gray-600">Stok</label>
                <input v-model.number="p.stok" @change="updateStock(p)" type="number" class="input-field py-1 px-2 h-8 w-24" />
              </div>
              <div class="flex items-center justify-between gap-2">
                <label class="text-xs text-gray-600">Aktif</label>
                <button class="px-2 py-1 rounded text-xs" :class="p.is_active === false || p.status === 'INACTIVE' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'" @click="toggleActive(p)">
                  {{ (p.is_active === false || p.status === 'INACTIVE') ? 'Nonaktif' : 'Aktif' }}
                </button>
              </div>
              <div class="flex gap-2 pt-1">
                <button class="btn-secondary" @click="edit(p)">Edit</button>
                <button class="text-red-600 hover:text-red-700 p-1" @click="del(p.id)" title="Hapus" aria-label="Hapus">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h3.75a.75.75 0 0 1 0 1.5h-.39l-1.02 13.005A3 3 0 0 1 14.35 22.5H9.65a3 3 0 0 1-2.99-3.495L5.64 6H5.25a.75.75 0 0 1 0-1.5H9V3.75Zm1.5.75h3V3.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4.5Zm-2.86 1.5 1.01 12.9a1.5 1.5 0 0 0 1.49 1.35h4.7a1.5 1.5 0 0 0 1.49-1.35l1.01-12.9H7.64Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-4">
          <button class="btn-secondary" :disabled="page===1" @click="page = page - 1">Sebelumnya</button>
          <div class="text-sm text-gray-600">Halaman {{ page }} / {{ totalPages }}</div>
          <button class="btn-secondary" :disabled="page===totalPages" @click="page = page + 1">Berikutnya</button>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-lg font-semibold mb-3">{{ form.id ? 'Ubah' : 'Buat' }} Produk</h2>
        <div class="space-y-2">
          <input v-model="form.nama_produk" type="text" class="input-field" placeholder="Nama produk" />
          <input v-model="form.harga_reseller" type="number" class="input-field" placeholder="Harga reseller" />
          <input v-model="form.harga_konsumen" type="number" class="input-field" placeholder="Harga konsumen" />
          <input v-model.number="form.stok" type="number" class="input-field" placeholder="Stok" />
          <textarea v-model="form.deskripsi" rows="3" class="input-field" placeholder="Deskripsi"></textarea>
          <!-- ID Toko di-set otomatis dari API getMyShop; field disembunyikan -->
          <select v-model.number="form.id_category" class="input-field">
            <option :value="0">Pilih Kategori</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nama }}</option>
          </select>
          <div>
            <label class="text-sm text-gray-700 mb-1 block">Foto Produk (opsional)</label>
            <input ref="photoInput" type="file" accept="image/*" @change="onSelectPhoto" class="block w-full text-sm text-gray-700" />
            <div v-if="previewUrl" class="mt-2 w-full aspect-square bg-gray-100 rounded overflow-hidden">
              <img :src="previewUrl" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn-primary" @click="submit">Simpan</button>
            <button v-if="form.id" class="btn-secondary" @click="reset">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiService, resolveAssetUrl } from '@/services/api'
import { useToastStore } from '@/store/toast'
import type { ProductItem } from '@/types/product'
import SkeletonList from '@/components/SkeletonList.vue'
import EmptyState from '@/components/EmptyState.vue'

const products = ref<ProductItem[]>([])
const loading = ref(false)
const query = ref('')
const page = ref(1)
const perPage = ref(8)
const form = ref<any>({ id: null, nama_produk: '', harga_reseller: '', harga_konsumen: '', stok: 0, deskripsi: '', id_toko: 0, id_category: 0 })
const categories = ref<any[]>([])
const photoFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const photoInput = ref<HTMLInputElement | null>(null)

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const load = async () => {
  loading.value = true
  const res = await apiService.getProducts()
  const cats = await apiService.getCategories()
  categories.value = Array.isArray(cats.data) ? cats.data : []
  try {
    const my = await apiService.getMyShop()
    const myShopId = my.data?.id
    const list = Array.isArray(res.data) ? res.data : []
    products.value = myShopId ? list.filter((p: any) => (p.id_toko ?? p.toko?.id) === myShopId) : list
    if (myShopId) form.value.id_toko = myShopId
  } catch {
    products.value = Array.isArray(res.data) ? res.data : []
  }
  page.value = 1
  loading.value = false
}

const edit = (p: ProductItem) => {
  form.value = { id: p.id, nama_produk: p.nama_produk, harga_reseller: p.harga_reseller, harga_konsumen: p.harga_konsumen, stok: p.stok, deskripsi: p.deskripsi, id_toko: p.id_toko, id_category: p.id_category }
  photoFile.value = null
  previewUrl.value = ''
}

const reset = () => {
  form.value = { id: null, nama_produk: '', harga_reseller: '', harga_konsumen: '', stok: 0, deskripsi: '', id_toko: 0, id_category: 0 }
  photoFile.value = null
  previewUrl.value = ''
  if (photoInput.value) photoInput.value.value = ''
}

const submit = async () => {
  if (!form.value.id) {
    const created = await apiService.createProduct({
      nama_produk: form.value.nama_produk,
      harga_reseller: String(form.value.harga_reseller),
      harga_konsumen: String(form.value.harga_konsumen),
      stok: Number(form.value.stok),
      deskripsi: form.value.deskripsi,
      id_toko: Number(form.value.id_toko),
      id_category: Number(form.value.id_category)
    })
    const newId = (created as any).data?.id
    if (photoFile.value && newId) {
      await apiService.uploadProductPhoto(newId, photoFile.value)
    }
    useToastStore().success('Produk berhasil dibuat')
  } else {
    await apiService.updateProduct(form.value.id, {
      nama_produk: form.value.nama_produk,
      harga_reseller: String(form.value.harga_reseller),
      harga_konsumen: String(form.value.harga_konsumen),
      stok: Number(form.value.stok),
      deskripsi: form.value.deskripsi,
      id_category: Number(form.value.id_category)
    })
    if (photoFile.value) {
      await apiService.uploadProductPhoto(form.value.id, photoFile.value)
    }
    useToastStore().success('Produk berhasil diperbarui')
  }
  reset()
  await load()
}

const del = async (id: number) => {
  if (!confirm('Hapus produk ini? Tindakan tidak dapat dibatalkan.')) return
  await apiService.deleteProduct(id)
  useToastStore().success('Produk dihapus')
  await load()
}

const onSelectPhoto = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) { photoFile.value = null; previewUrl.value=''; return }
  photoFile.value = files[0]
  previewUrl.value = URL.createObjectURL(photoFile.value)
}

onMounted(load)

const filteredProducts = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter((p: any) => (p.nama_produk || '').toString().toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage.value)))
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredProducts.value.slice(start, start + perPage.value)
})

const updateStock = async (p: any) => {
  if (!p || !p.id) return
  await apiService.updateProduct(p.id, { stok: Number(p.stok) })
  useToastStore().success('Stok diperbarui')
}

const toggleActive = async (p: any) => {
  if (!p || !p.id) return
  const isInactive = p.is_active === false || p.status === 'INACTIVE'
  const nextActive = !isInactive
  await apiService.updateProduct(p.id, { is_active: nextActive, status: nextActive ? 'ACTIVE' : 'INACTIVE' })
  p.is_active = nextActive
  p.status = nextActive ? 'ACTIVE' : 'INACTIVE'
  useToastStore().success(nextActive ? 'Produk diaktifkan' : 'Produk dinonaktifkan')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>


