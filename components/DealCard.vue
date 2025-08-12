<template>
  <div
    class="deal-card card-bg p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-pnw-orange mb-2">{{ deal.title }}</h3>
        <div
          v-if="deal.discount"
          class="inline-block bg-pnw-orange/20 text-pnw-orange px-3 py-1 rounded-full text-sm font-medium mb-3"
        >
          {{ deal.discount }}
        </div>
      </div>
      <div v-if="showActions" class="flex space-x-2 ml-4">
        <button
          v-if="onEdit"
          @click="onEdit"
          class="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
          title="Edit Deal"
        >
          <svg
            class="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
        </button>
        <button
          v-if="onDelete"
          @click="confirmDelete"
          class="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
          title="Delete Deal"
        >
          <svg
            class="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <p class="text-gray-300 mb-4 leading-relaxed">{{ deal.description }}</p>

    <div class="space-y-2 text-sm text-gray-400">
      <div v-if="deal.start_date" class="flex items-center">
        <svg
          class="w-4 h-4 mr-2 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span>Starts: {{ formatDate(deal.start_date) }}</span>
      </div>

      <div v-if="deal.end_date" class="flex items-center">
        <svg
          class="w-4 h-4 mr-2 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span>Ends: {{ formatDate(deal.end_date) }}</span>
      </div>

      <div v-if="deal.businesses?.name" class="flex items-center">
        <svg
          class="w-4 h-4 mr-2 text-pnw-yellow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          ></path>
        </svg>
        <span>{{ deal.businesses.name }}</span>
      </div>

      <div class="flex items-center">
        <svg
          class="w-4 h-4 mr-2 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Created: {{ formatDate(deal.created_at) }}</span>
      </div>
    </div>

    <!-- Status indicator -->
    <div class="mt-4 pt-4 border-t border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            :class="[
              'w-3 h-3 rounded-full mr-2',
              isActive
                ? 'bg-green-400'
                : isExpired
                  ? 'bg-red-400'
                  : 'bg-yellow-400',
            ]"
          ></div>
          <span
            :class="[
              'text-sm font-medium',
              isActive
                ? 'text-green-400'
                : isExpired
                  ? 'text-red-400'
                  : 'text-yellow-400',
            ]"
          >
            {{ dealStatus }}
          </span>
        </div>

        <div v-if="deal.businesses?.slug" class="text-right">
          <a
            :href="`/business/${deal.businesses.slug}`"
            class="text-pnw-orange hover:text-pnw-yellow transition-colors duration-200 text-sm font-medium"
            target="_blank"
          >
            View Business →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { format, isAfter, isBefore } from "date-fns";

const props = defineProps({
  deal: {
    type: Object,
    required: true,
  },
  onDelete: {
    type: Function,
    default: null,
  },
  onEdit: {
    type: Function,
    default: null,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
});

const formatDate = (date) => {
  if (!date) return "Not set";
  return format(new Date(date), "MMM dd, yyyy");
};

const confirmDelete = () => {
  if (confirm(`Are you sure you want to delete "${props.deal.title}"?`)) {
    props.onDelete();
  }
};

const now = new Date();

const isActive = computed(() => {
  if (!props.deal.start_date && !props.deal.end_date) return true;
  if (props.deal.start_date && isBefore(now, new Date(props.deal.start_date)))
    return false;
  if (props.deal.end_date && isAfter(now, new Date(props.deal.end_date)))
    return false;
  return true;
});

const isExpired = computed(() => {
  return props.deal.end_date && isAfter(now, new Date(props.deal.end_date));
});

const dealStatus = computed(() => {
  if (isExpired.value) return "Expired";
  if (!props.deal.start_date && !props.deal.end_date) return "Active";
  if (props.deal.start_date && isBefore(now, new Date(props.deal.start_date)))
    return "Scheduled";
  if (isActive.value) return "Active";
  return "Inactive";
});
</script>
