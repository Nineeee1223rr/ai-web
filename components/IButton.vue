<script setup lang="ts">
defineProps({
  name: String
})
</script>

<template>
  <button
      class="w-8 h-8 flex justify-center items-center cursor-pointer rounded-full transition-all hover:bg-neutral-300 dark:hover:bg-neutral-700">
    <UIcon class="h-6 w-6 m-1 block" :name="name"/>
  </button>
</template>