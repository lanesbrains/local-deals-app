<template>
  <div class="deal-card relative">
    <h3 class="text-lg font-semibold text-orange-500">{{ deal.title }}</h3>
    <p class="text-gray-300">{{ deal.description }}</p>
    <p v-if="deal.expires_at" class="text-sm text-gray-500 mt-2">Expires: {{ formatDate(deal.expires_at) }}</p>
    <p class="text-sm text-gray-500 mt-2">From: {{ deal.businesses?.name || 'Unknown' }}</p>
    <button v-if="onDelete" @click="onDelete" class="absolute top-2 right-2 text-red-500 hover:text-red-700">Delete</button>
  </div>
</template>

<script setup>
import { format } from 'date-fns';

defineProps({
  deal: Object,
  onDelete: Function,
});

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};
</script>