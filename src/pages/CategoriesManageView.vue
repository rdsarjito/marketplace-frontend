<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Tambah Kategori</h2>
          <form @submit.prevent="handleSubmit" class="flex gap-3">
            <input v-model="form.nama" type="text" placeholder="Nama kategori" class="input flex-1" />
            <button type="submit" class="btn-primary">Simpan</button>
          </form>
          <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Daftar Kategori</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="cat in categories" :key="cat.id" class="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div class="text-base font-semibold text-gray-900">{{ cat.nama }}</div>
                <div class="text-xs text-gray-500">ID: {{ cat.id }}</div>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn-secondary px-3 py-1" @click="startEdit(cat)">Edit</button>
                <button class="btn-danger px-3 py-1" @click="remove(cat)">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { apiService } from '@/services/api'

type Category = { id: number; nama: string }

const categories = ref<Category[]>([])
const form = reactive<{ nama: string; id?: number | null }>({ nama: '', id: null })
const error = ref('')

async function load() {
  const res = await apiService.getCategories()
  categories.value = Array.isArray(res.data) ? res.data : []
}

onMounted(load)

async function handleSubmit() {
  error.value = ''
  try {
    if (form.id) {
      await apiService.updateCategory(form.id, { nama: form.nama })
    } else {
      await apiService.createCategory({ nama: form.nama })
    }
    form.nama = ''
    form.id = null
    await load()
  } catch (e: any) {
    error.value = e?.message || 'Gagal menyimpan kategori'
  }
}

function startEdit(cat: Category) {
  form.nama = cat.nama
  form.id = cat.id
}

async function remove(cat: Category) {
  if (!confirm(`Hapus kategori "${cat.nama}"?`)) return
  try {
    await apiService.deleteCategory(cat.id)
    await load()
  } catch (e: any) {
    error.value = e?.message || 'Gagal menghapus kategori'
  }
}
</script>


