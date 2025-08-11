<template>
  <div class="app-container">
    <!-- Dynamic Background -->
    <DynamicBackground />

    <!-- Background Toggle Controls -->
    <div class="background-controls">
      <button
        @click="toggleBackgroundType"
        class="bg-toggle-btn"
        :title="
          backgroundType === 'photos' ? 'Switch to Webcams' : 'Switch to Photos'
        "
      >
        {{ backgroundType === "photos" ? "📷" : "📹" }}
      </button>
    </div>

    <!-- Webcam Background (alternative) -->
    <WebcamBackground v-if="backgroundType === 'webcam'" />

    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRuntimeConfig } from "#app";
import { ref } from "vue";

// Background type switching
const backgroundType = ref("photos"); // 'photos' or 'webcam'

const toggleBackgroundType = () => {
  backgroundType.value =
    backgroundType.value === "photos" ? "webcam" : "photos";
};

useHead({
  titleTemplate: (title) =>
    `${title ? `${title} | ` : ""}PNW Deals - Local Offers & Directory`,
  meta: [
    {
      name: "description",
      content:
        "Discover the best local deals in the Pacific Northwest. Join our $1/month newsletter or list your business for $5/month!",
    },
    {
      name: "keywords",
      content:
        "PNW deals, Pacific Northwest, local businesses, newsletter, discounts",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charset: "utf-8" },
    { name: "robots", content: "index, follow" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});

// Safely compute canonical URL
const route = useRoute();
const {
  public: { appUrl },
} = useRuntimeConfig();
const canonicalUrl = computed(() => `${appUrl}${route.fullPath}`);

useHead({
  link: [{ rel: "canonical", hid: "canonical", href: canonicalUrl }],
});
</script>
<style scoped>
.app-container {
  @apply relative min-h-screen;
}

.main-content {
  @apply relative z-10 min-h-screen;
}

/* Background Controls */
.background-controls {
  @apply fixed top-4 right-4 z-20;
}

.bg-toggle-btn {
  @apply bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 text-lg shadow-lg hover:shadow-xl hover:scale-105;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .background-controls {
    @apply top-2 right-2;
  }

  .bg-toggle-btn {
    @apply p-2 text-base;
  }
}
</style>
