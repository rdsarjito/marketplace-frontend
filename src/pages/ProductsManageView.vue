<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow p-4 lg:col-span-2">
        <h1 class="text-xl font-semibold mb-4">Produk Saya</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="p in products" :key="p.id" class="border rounded p-3">
            <div class="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
              <img v-if="p.photos_product && p.photos_product.length" :src="resolveAssetUrl(p.photos_product[0].url)" class="w-full h-full object-cover" />
            </div>
            <div class="text-gray-900 font-medium line-clamp-2">{{ p.nama_produk }}</div>
            <div class="text-sm text-gray-600 mt-1">{{ formatIDR(Number(p.harga_konsumen || p.harga_reseller || 0)) }}</div>
            <div class="mt-2 flex gap-2">
              <button class="btn-secondary" @click="edit(p)">Edit</button>
              <button class="text-red-600 text-sm" @click="del(p.id)">Hapus</button>
            </div>
          </div>
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
          <input v-model.number="form.id_toko" type="number" class="input-field" placeholder="ID Toko" />
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
import { onMounted, ref } from 'vue'
import { apiService, resolveAssetUrl } from '@/services/api'
import type { ProductItem } from '@/types/product'

const products = ref<ProductItem[]>([])
const form = ref<any>({ id: null, nama_produk: '', harga_reseller: '', harga_konsumen: '', stok: 0, deskripsi: '', id_toko: 0, id_category: 0 })
const categories = ref<any[]>([])
const photoFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const photoInput = ref<HTMLInputElement | null>(null)

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const load = async () => {
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
  }
  reset()
  await load()
}

const del = async (id: number) => {
  await apiService.deleteProduct(id)
  await load()
}

const onSelectPhoto = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) { photoFile.value = null; previewUrl.value=''; return }
  photoFile.value = files[0]
  previewUrl.value = URL.createObjectURL(photoFile.value)
}

onMounted(load)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>


