<template>
  <button
    :type="type"
    class="animated-button"
    :disabled="loading"
  >
    <span v-if="loading" class="animate-spin inline-block mr-2">⏳</span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  loading: Boolean,
});
</script>