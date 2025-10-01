<template>
  <div class="fixed inset-0 pointer-events-none z-50 flex flex-col items-end gap-2 p-4 sm:p-6">
    <div v-for="t in toasts" :key="t.id" class="pointer-events-auto w-full sm:w-96 rounded-lg shadow border p-3 flex items-start gap-2"
         :class="t.type==='success' ? 'bg-green-50 border-green-200' : t.type==='error' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'">
      <div class="flex-1 text-sm" :class="t.type==='success' ? 'text-green-800' : t.type==='error' ? 'text-red-800' : 'text-gray-800'">{{ t.message }}</div>
      <button class="text-xs text-gray-500 hover:text-gray-900" @click="dismiss(t.id)">Tutup</button>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/store/toast'

const toast = useToastStore()
const { toasts } = storeToRefs(toast)
const dismiss = (id: number) => toast.dismiss(id)
</script>




