<template>
  <div class="grid" :class="gridClass">
    <div v-for="i in count" :key="i" class="animate-pulse border rounded p-3">
      <div class="aspect-square bg-gray-200 rounded mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ columns?: string, count?: number }>()
const gridClass = props.columns || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
const count = props.count || 8
</script>


