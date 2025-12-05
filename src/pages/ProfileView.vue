<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-700">
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
          <path d="M4.5 20.25a7.5 7.5 0 0115 0 .75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75z" />
        </svg>
        <h1 class="text-xl font-semibold text-gray-900">{{ user?.nama || 'Profil' }}</h1>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white border-b border-gray-200 mb-6">
        <div class="flex gap-6">
          <button
            @click="activeTab = 'biodata'"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'biodata' 
              ? 'border-[#03AC0E] text-[#03AC0E]' 
              : 'border-transparent text-gray-600 hover:text-gray-900'"
          >
            Biodata Diri
          </button>
          <button
            @click="activeTab = 'alamat'"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'alamat' 
              ? 'border-[#03AC0E] text-[#03AC0E]' 
              : 'border-transparent text-gray-600 hover:text-gray-900'"
          >
            Daftar Alamat
          </button>
        </div>
      </div>

      <!-- Tab Content: Biodata Diri -->
      <div v-if="activeTab === 'biodata'" class="bg-white rounded-lg shadow-sm p-6">
        <!-- Ubah Biodata Diri -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Ubah Biodata Diri</h2>
          
          <!-- Nama -->
          <div class="flex items-center justify-between py-4 border-b border-gray-100">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-500 mb-1">Nama</label>
              <p v-if="!editing.nama" class="text-sm text-gray-900">{{ form.nama || '-' }}</p>
              <input
                v-else
                v-model="editForm.nama"
                type="text"
                class="input-field text-sm"
                placeholder="Masukkan nama"
              />
            </div>
            <button
              v-if="!editing.nama"
              @click="startEdit('nama')"
              class="ml-4 text-[#03AC0E] text-sm font-medium hover:underline"
            >
              Ubah
            </button>
            <div v-else class="ml-4 flex gap-2">
              <button
                @click="saveField('nama')"
                class="px-3 py-1 text-sm bg-[#03AC0E] text-white rounded hover:bg-[#028a0b]"
              >
                Simpan
              </button>
              <button
                @click="cancelEdit('nama')"
                class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>

          <!-- Tanggal Lahir -->
          <div class="flex items-center justify-between py-4 border-b border-gray-100">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-500 mb-1">Tanggal Lahir</label>
              <p v-if="!editing.tanggal_lahir" class="text-sm text-gray-900">
                {{ formatDate(form.tanggal_lahir) || '-' }}
              </p>
              <input
                v-else
                v-model="editForm.tanggal_lahir"
                type="date"
                class="input-field text-sm"
              />
            </div>
            <button
              v-if="!editing.tanggal_lahir"
              @click="startEdit('tanggal_lahir')"
              class="ml-4 text-[#03AC0E] text-sm font-medium hover:underline"
            >
              Ubah Tanggal Lahir
            </button>
            <div v-else class="ml-4 flex gap-2">
              <button
                @click="saveField('tanggal_lahir')"
                class="px-3 py-1 text-sm bg-[#03AC0E] text-white rounded hover:bg-[#028a0b]"
              >
                Simpan
              </button>
              <button
                @click="cancelEdit('tanggal_lahir')"
                class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>

          <!-- Jenis Kelamin -->
          <div class="flex items-center justify-between py-4 border-b border-gray-100">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
              <p v-if="!editing.jenis_kelamin" class="text-sm text-gray-900">
                {{ form.jenis_kelamin === 'L' ? 'Pria' : form.jenis_kelamin === 'P' ? 'Wanita' : '-' }}
              </p>
              <select
                v-else
                v-model="editForm.jenis_kelamin"
                class="input-field text-sm"
              >
                <option value="L">Pria</option>
                <option value="P">Wanita</option>
              </select>
            </div>
            <button
              v-if="!editing.jenis_kelamin"
              @click="startEdit('jenis_kelamin')"
              class="ml-4 text-[#03AC0E] text-sm font-medium hover:underline"
            >
              Ubah
            </button>
            <div v-else class="ml-4 flex gap-2">
              <button
                @click="saveField('jenis_kelamin')"
                class="px-3 py-1 text-sm bg-[#03AC0E] text-white rounded hover:bg-[#028a0b]"
              >
                Simpan
              </button>
              <button
                @click="cancelEdit('jenis_kelamin')"
                class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>

        <!-- Ubah Kontak -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Ubah Kontak</h2>
          
          <!-- Email -->
          <div class="flex items-center justify-between py-4 border-b border-gray-100">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p class="text-sm text-gray-900">{{ form.email || '-' }}</p>
            </div>
            <button
              class="ml-4 text-[#03AC0E] text-sm font-medium hover:underline"
              disabled
            >
              Ubah
            </button>
          </div>

          <!-- Nomor HP -->
          <div class="flex items-center justify-between py-4 border-b border-gray-100">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-500 mb-1">Nomor HP</label>
              <div class="flex items-center gap-2">
                <p v-if="!editing.no_telp" class="text-sm text-gray-900">{{ form.no_telp || '-' }}</p>
                <input
                  v-else
                  v-model="editForm.no_telp"
                  type="tel"
                  class="input-field text-sm"
                  placeholder="Masukkan nomor HP"
                />
              </div>
            </div>
            <button
              v-if="!editing.no_telp"
              @click="startEdit('no_telp')"
              class="ml-4 text-[#03AC0E] text-sm font-medium hover:underline"
            >
              Ubah
            </button>
            <div v-else class="ml-4 flex gap-2">
              <button
                @click="saveField('no_telp')"
                class="px-3 py-1 text-sm bg-[#03AC0E] text-white rounded hover:bg-[#028a0b]"
              >
                Simpan
              </button>
              <button
                @click="cancelEdit('no_telp')"
                class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Daftar Alamat -->
      <div v-if="activeTab === 'alamat'" class="space-y-4">
        <!-- Search and Add Button -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex gap-3">
            <div class="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                v-model="addressSearch"
                type="text"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#03AC0E] focus:border-transparent"
                placeholder="Tulis Nama Alamat / Kota / Kecamatan tujuan pengiriman"
              />
            </div>
            <button
              @click="showAddressForm = true; editingAddress = null"
              class="px-4 py-2 bg-[#03AC0E] text-white rounded-lg font-medium hover:bg-[#028a0b] flex items-center gap-2 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              + Tambah Alamat Baru
            </button>
          </div>
        </div>

        <!-- Filter (only all addresses) -->
            <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors border-[#03AC0E] text-[#03AC0E] bg-green-50"
            disabled
          >
            Semua Alamat
          </button>
        </div>

        <!-- Address List -->
        <div class="space-y-3">
          <div
            v-for="addr in filteredAddresses"
            :key="addr.id"
            class="bg-white rounded-lg shadow-sm border-l-4 border-[#03AC0E] p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-semibold text-gray-900">{{ addr.judul_alamat }}</h3>
                  <span v-if="addr.id === primaryAddressId" class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                    Utama
                  </span>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ addr.nama_penerima }}</p>
                <p class="text-sm text-gray-600 mb-1">{{ addr.no_telp }}</p>
                <p class="text-sm text-gray-700 mb-2">{{ addr.detail_alamat }}</p>
                <div class="flex items-center gap-4 text-sm">
                  <button
                    @click="editAddress(addr)"
                    class="text-[#03AC0E] hover:underline"
                  >
                    Ubah Alamat
                  </button>
                  <button
                    @click="shareAddress(addr)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Share
                  </button>
                </div>
              </div>
              <button
                @click="setPrimaryAddress(addr.id)"
                class="ml-4 px-4 py-2 bg-[#03AC0E] text-white rounded-lg text-sm font-medium hover:bg-[#028a0b] whitespace-nowrap"
              >
                Pilih
              </button>
            </div>
          </div>

          <div v-if="filteredAddresses.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <p class="text-gray-500">Tidak ada alamat ditemukan</p>
          </div>
        </div>
      </div>

      <!-- Address Form Modal -->
      <div
        v-if="showAddressForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeAddressForm"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingAddress ? 'Ubah Alamat' : 'Tambah Alamat Baru' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Alamat</label>
              <input
                v-model="addrForm.judul_alamat"
                type="text"
                class="input-field"
                placeholder="Contoh: Rumah, Kantor"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
              <input
                v-model="addrForm.nama_penerima"
                type="text"
                class="input-field"
                placeholder="Masukkan nama penerima"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input
                v-model="addrForm.no_telp"
                type="tel"
                class="input-field"
                placeholder="Masukkan nomor telepon"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Detail Alamat</label>
              <textarea
                v-model="addrForm.detail_alamat"
                rows="3"
                class="input-field"
                placeholder="Masukkan detail alamat lengkap"
              />
            </div>
            <div class="flex gap-3 pt-4">
              <button
                @click="submitAddress"
                class="flex-1 btn-primary"
                :disabled="savingAddress"
              >
                {{ savingAddress ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button
                @click="closeAddressForm"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const activeTab = ref<'biodata' | 'alamat'>('biodata')
const form = ref<any>({
  nama: '',
  email: '',
  no_telp: '',
  tanggal_lahir: '',
  jenis_kelamin: 'L',
  tentang: '',
  pekerjaan: ''
})

const editing = ref<{ [key: string]: boolean }>({})
const editForm = ref<any>({})

const addresses = ref<any[]>([])
const addressSearch = ref('')
// Filter removed; always show all
const showAddressForm = ref(false)
const editingAddress = ref<any>(null)
const savingAddress = ref(false)
const primaryAddressId = ref<number | null>(null)

const addrForm = ref({
  id: null as number | null,
  judul_alamat: '',
  nama_penerima: '',
  no_telp: '',
  detail_alamat: ''
})

const filteredAddresses = computed(() => {
  let result = addresses.value
  if (addressSearch.value) {
    const search = addressSearch.value.toLowerCase()
    result = result.filter(addr =>
      addr.judul_alamat?.toLowerCase().includes(search) ||
      addr.detail_alamat?.toLowerCase().includes(search) ||
      addr.nama_penerima?.toLowerCase().includes(search)
    )
  }
  return result
})

const loadProfile = async () => {
  try {
  const res = await apiService.getUserProfile()
  form.value = { ...form.value, ...res.data }
  } catch (e) {
    console.error('Failed to load profile:', e)
  }
}

const loadAddresses = async () => {
  try {
  const res = await apiService.getAddresses()
  addresses.value = Array.isArray(res.data) ? res.data : []
    // Set primary address (bisa dari flag atau alamat pertama)
    if (addresses.value.length > 0 && !primaryAddressId.value) {
      primaryAddressId.value = addresses.value[0].id
    }
  } catch (e) {
    console.error('Failed to load addresses:', e)
    addresses.value = []
  }
}

const startEdit = (field: string) => {
  editing.value[field] = true
  editForm.value[field] = form.value[field]
}

const cancelEdit = (field: string) => {
  editing.value[field] = false
  editForm.value[field] = ''
}

const saveField = async (field: string) => {
  try {
    const payload: any = {}
    payload[field] = editForm.value[field]
    await apiService.updateUserProfile(payload)
    form.value[field] = editForm.value[field]
    editing.value[field] = false
    // Update auth store
    if (authStore.user) {
      authStore.user = { ...authStore.user, ...payload }
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
  } catch (e: any) {
    alert(e?.message || 'Gagal menyimpan perubahan')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const editAddress = (addr: any) => {
  editingAddress.value = addr
  addrForm.value = {
    id: addr.id,
    judul_alamat: addr.judul_alamat,
    nama_penerima: addr.nama_penerima,
    no_telp: addr.no_telp,
    detail_alamat: addr.detail_alamat
  }
  showAddressForm.value = true
}

const closeAddressForm = () => {
  showAddressForm.value = false
  editingAddress.value = null
  addrForm.value = {
    id: null,
    judul_alamat: '',
    nama_penerima: '',
    no_telp: '',
    detail_alamat: ''
  }
}

const submitAddress = async () => {
  if (!addrForm.value.judul_alamat || !addrForm.value.nama_penerima || !addrForm.value.detail_alamat) {
    alert('Mohon lengkapi semua field yang wajib')
    return
  }
  savingAddress.value = true
  try {
  if (addrForm.value.id) {
    await apiService.updateAddress(addrForm.value.id, addrForm.value)
  } else {
    await apiService.createAddress(addrForm.value)
  }
  await loadAddresses()
    closeAddressForm()
  } catch (e: any) {
    alert(e?.message || 'Gagal menyimpan alamat')
  } finally {
    savingAddress.value = false
  }
}

const setPrimaryAddress = (id: number) => {
  primaryAddressId.value = id
  // Bisa ditambahkan API call untuk set primary address jika ada endpoint-nya
}

const shareAddress = (addr: any) => {
  // Implementasi share address
  const text = `${addr.judul_alamat}\n${addr.nama_penerima}\n${addr.no_telp}\n${addr.detail_alamat}`
  if (navigator.share) {
    navigator.share({ text })
  } else {
    navigator.clipboard.writeText(text)
    alert('Alamat disalin ke clipboard')
  }
}

const removeAddress = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
    return
  }
  try {
  await apiService.deleteAddress(id)
  await loadAddresses()
    if (primaryAddressId.value === id) {
      primaryAddressId.value = addresses.value.length > 0 ? addresses.value[0].id : null
    }
  } catch (e: any) {
    alert(e?.message || 'Gagal menghapus alamat')
  }
}

onMounted(async () => {
  await loadProfile()
  await loadAddresses()
})
</script>
