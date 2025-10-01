<template>
  <div class="text-center py-10">
    <div class="mx-auto mb-2 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z" />
        </svg>
      </slot>
    </div>
    <h3 class="text-gray-900 font-medium">{{ title }}</h3>
    <p class="text-gray-600 text-sm mt-1">{{ description }}</p>
    <div class="mt-3">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string, description: string }>()
</script>




