<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow p-4 lg:col-span-2">
        <h1 class="text-xl font-semibold mb-4">Profil</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input v-model="form.nama" type="text" class="input-field" placeholder="Nama" />
          <input v-model="form.email" type="email" class="input-field" placeholder="Email" disabled />
          <input v-model="form.no_telp" type="tel" class="input-field" placeholder="No. Telepon" />
          <input v-model="form.tanggal_lahir" type="date" class="input-field" />
          <select v-model="form.jenis_kelamin" class="input-field">
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <input v-model="form.pekerjaan" type="text" class="input-field" placeholder="Pekerjaan" />
          <textarea v-model="form.tentang" rows="3" class="input-field sm:col-span-2" placeholder="Tentang"></textarea>
        </div>
        <button class="btn-primary mt-4" :disabled="saving" @click="save">Simpan</button>
        <p v-if="msg" class="text-green-600 text-sm mt-2">{{ msg }}</p>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Alamat</h2>
        <div class="space-y-3">
          <div class="border rounded p-3" v-for="a in addresses" :key="a.id">
            <div class="font-medium text-gray-900">{{ a.judul_alamat }}</div>
            <div class="text-sm text-gray-600">{{ a.nama_penerima }} • {{ a.no_telp }}</div>
            <div class="text-sm text-gray-700 mt-1">{{ a.detail_alamat }}</div>
            <div class="mt-2 flex gap-2">
              <button class="btn-secondary" @click="editAddress(a)">Edit</button>
              <button class="text-red-600 text-sm" @click="removeAddress(a.id)">Hapus</button>
            </div>
          </div>
        </div>

        <div class="mt-4 border-t pt-4">
          <h3 class="font-semibold mb-2">Tambah / Ubah Alamat</h3>
          <div class="space-y-2">
            <input v-model="addrForm.judul_alamat" type="text" class="input-field" placeholder="Judul alamat" />
            <input v-model="addrForm.nama_penerima" type="text" class="input-field" placeholder="Nama penerima" />
            <input v-model="addrForm.no_telp" type="tel" class="input-field" placeholder="No. Telepon" />
            <textarea v-model="addrForm.detail_alamat" rows="2" class="input-field" placeholder="Detail alamat"></textarea>
            <div class="flex gap-2">
              <button class="btn-primary" @click="submitAddress">Simpan Alamat</button>
              <button v-if="addrForm.id" class="btn-secondary" @click="resetAddr">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiService } from '@/services/api'

const form = ref<any>({ nama: '', email: '', no_telp: '', tanggal_lahir: '', jenis_kelamin: 'L', tentang: '', pekerjaan: '' })
const saving = ref(false)
const msg = ref('')

const addresses = ref<any[]>([])
const addrForm = ref<any>({ id: null, judul_alamat: '', nama_penerima: '', no_telp: '', detail_alamat: '' })

const loadProfile = async () => {
  const res = await apiService.getUserProfile()
  form.value = { ...form.value, ...res.data }
}

const loadAddresses = async () => {
  const res = await apiService.getAddresses()
  addresses.value = Array.isArray(res.data) ? res.data : []
}

const save = async () => {
  saving.value = true
  msg.value = ''
  try {
    const payload: any = { ...form.value }
    delete payload.email
    await apiService.updateUserProfile(payload)
    msg.value = 'Profil tersimpan.'
  } finally {
    saving.value = false
  }
}

const editAddress = (a: any) => {
  addrForm.value = { id: a.id, judul_alamat: a.judul_alamat, nama_penerima: a.nama_penerima, no_telp: a.no_telp, detail_alamat: a.detail_alamat }
}

const resetAddr = () => {
  addrForm.value = { id: null, judul_alamat: '', nama_penerima: '', no_telp: '', detail_alamat: '' }
}

const submitAddress = async () => {
  if (addrForm.value.id) {
    await apiService.updateAddress(addrForm.value.id, addrForm.value)
  } else {
    await apiService.createAddress(addrForm.value)
  }
  resetAddr()
  await loadAddresses()
}

const removeAddress = async (id: number) => {
  await apiService.deleteAddress(id)
  await loadAddresses()
}

onMounted(async () => {
  await loadProfile()
  await loadAddresses()
})
</script>



