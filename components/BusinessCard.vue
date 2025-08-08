<template>
  <div class="deal-card" role="article" :aria-label="`Business: ${business.name}`">
    <h2 class="text-xl font-semibold text-white">{{ business.name }}</h2>
    <p class="text-gray-300">{{ business.description || 'No description available.' }}</p>
    <p v-if="business.categories" class="text-gray-400">{{ business.categories.name }}</p>
    <p v-if="business.subcategories" class="text-gray-400">{{ business.subcategories.name }}</p>
    <p v-if="detailed && business.website" class="text-gray-400">
      <a :href="business.website" target="_blank" rel="noopener noreferrer" aria-label="Visit website">Website</a>
    </p>
  </div>
</template>

<script setup>
defineProps({
  business: Object,
  detailed: Boolean,
});
</script>