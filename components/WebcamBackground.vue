<template>
  <div class="webcam-background">
    <!-- Live webcam feeds from various PNW locations -->
    <div
      v-for="(webcam, index) in webcams"
      :key="index"
      class="webcam-feed"
      :class="{ active: currentWebcamIndex === index }"
    >
      <iframe
        :src="webcam.url"
        class="webcam-iframe"
        frameborder="0"
        allowfullscreen
      ></iframe>

      <!-- Overlay for better text readability -->
      <div class="webcam-overlay"></div>
    </div>

    <!-- Location info -->
    <div class="webcam-info" v-if="currentWebcam">
      <div class="location-badge">📍 {{ currentWebcam.location }}</div>
    </div>

    <!-- Controls -->
    <div class="webcam-controls">
      <button
        @click="toggleAutoRotate"
        class="control-button"
        :class="{ active: autoRotate }"
      >
        {{ autoRotate ? "⏸️" : "▶️" }}
      </button>
      <button @click="nextWebcam" class="control-button">⏭️</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const currentWebcamIndex = ref(0);
const autoRotate = ref(true);
const intervalId = ref(null);

// Working webcam feeds from Washington, Idaho, and Montana
const webcams = ref([
  {
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1",
    location: "Seattle Waterfront, WA",
    description: "Live view of Seattle waterfront and ferries",
  },
  {
    url: "https://www.youtube.com/embed/live_stream?channel=UCvW8JzztV3k3srucu4bqRfA&autoplay=1&mute=1&controls=0",
    location: "Pike Place Market, Seattle, WA",
    description: "Live view of the famous Pike Place Market",
  },
  {
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1",
    location: "Spokane Downtown, WA",
    description: "Downtown Spokane city view",
  },
  {
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1",
    location: "Boise Downtown, ID",
    description: "Live view of downtown Boise",
  },
  {
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1",
    location: "Glacier National Park, MT",
    description: "Live mountain and wildlife cam",
  },
  {
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1",
    location: "Coeur d'Alene Lake, ID",
    description: "Beautiful lake and resort area",
  },
]);

const currentWebcam = computed(() => webcams.value[currentWebcamIndex.value]);

const nextWebcam = () => {
  currentWebcamIndex.value =
    (currentWebcamIndex.value + 1) % webcams.value.length;
};

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value;
  if (autoRotate.value) {
    startAutoRotate();
  } else {
    stopAutoRotate();
  }
};

const startAutoRotate = () => {
  if (intervalId.value) clearInterval(intervalId.value);
  intervalId.value = setInterval(nextWebcam, 15000); // Change every 15 seconds
};

const stopAutoRotate = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

onMounted(() => {
  if (autoRotate.value) {
    startAutoRotate();
  }
});

onUnmounted(() => {
  stopAutoRotate();
});
</script>

<style scoped>
.webcam-background {
  @apply fixed inset-0 -z-10;
}

.webcam-feed {
  @apply absolute inset-0 opacity-0;
  transition: opacity 2s ease-in-out;
}

.webcam-feed.active {
  @apply opacity-100;
}

.webcam-iframe {
  @apply w-full h-full object-cover;
}

.webcam-overlay {
  @apply absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-gray-900/80;
}

/* Location info */
.webcam-info {
  @apply absolute top-4 left-4 z-10;
}

.location-badge {
  @apply bg-black/30 text-white px-3 py-2 rounded-lg backdrop-blur-sm text-sm font-medium;
}

/* Controls */
.webcam-controls {
  @apply absolute bottom-4 left-4 z-10 flex gap-2;
}

.control-button {
  @apply bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg backdrop-blur-sm transition-all duration-200 text-sm;
}

.control-button.active {
  @apply bg-orange-500/30 text-orange-200;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .webcam-info {
    @apply top-2 left-2;
  }

  .webcam-controls {
    @apply bottom-2 left-2;
  }

  .location-badge {
    @apply px-2 py-1 text-xs;
  }

  .control-button {
    @apply p-1.5 text-xs;
  }
}
</style>
