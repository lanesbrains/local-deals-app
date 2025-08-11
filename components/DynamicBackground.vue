<template>
  <div class="dynamic-background">
    <!-- Background Images -->
    <div
      v-for="(image, index) in backgroundImages"
      :key="index"
      class="background-image"
      :class="{ active: currentImageIndex === index }"
      :style="{ backgroundImage: `url(${image.url})` }"
    >
      <!-- Overlay for better text readability -->
      <div class="background-overlay"></div>
    </div>

    <!-- Floating particles for extra visual interest -->
    <div class="particles-container">
      <div
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Location info -->
    <div class="photo-credit" v-if="currentImage">
      <div class="location-info">📍 {{ currentImage.location }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const currentImageIndex = ref(0);
const intervalId = ref(null);

// Working photos of specific locations in WA, ID, MT
const backgroundImages = ref([
  // WASHINGTON LOCATIONS
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "Seattle Skyline & Space Needle, WA",
  },
  {
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "Pike Place Market, Seattle, WA",
  },
  {
    url: "https://images.unsplash.com/photo-1555400082-6e5b3e6b6b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "University of Washington, Seattle, WA",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "Spokane Falls & Downtown, WA",
  },

  // MONTANA LOCATIONS
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "Bozeman & Bridger Mountains, MT",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    location: "Montana State University, Bozeman, MT",
  },
  {
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "Butte Historic District, MT",
  },
  {
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "University of Montana, Missoula, MT",
  },

  // IDAHO LOCATIONS
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    location: "Coeur d'Alene Lake & Resort, ID",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    location: "Post Falls & Spokane River, ID",
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "Boise State University & Downtown, ID",
  },
  {
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "University of Idaho, Moscow, ID",
  },
]);

const currentImage = computed(
  () => backgroundImages.value[currentImageIndex.value]
);

// Generate random particle styles
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const animationDelay = Math.random() * 10;
  const animationDuration = Math.random() * 20 + 10;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`,
  };
};

// Rotate background images
const rotateBackground = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % backgroundImages.value.length;
};

onMounted(() => {
  // Change background every 8 seconds
  intervalId.value = setInterval(rotateBackground, 8000);
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped>
.dynamic-background {
  @apply fixed inset-0 -z-10;
}

.background-image {
  @apply absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0;
  transition: opacity 2s ease-in-out;
}

.background-image.active {
  @apply opacity-100;
}

.background-overlay {
  @apply absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/70;
}

/* Floating particles */
.particles-container {
  @apply absolute inset-0 overflow-hidden pointer-events-none;
}

.particle {
  @apply absolute bg-orange-400/20 rounded-full;
  animation: float infinite ease-in-out;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

/* Photo credit */
.photo-credit {
  @apply absolute bottom-4 right-4 z-10;
}

.location-info {
  @apply text-xs text-gray-300 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm font-medium border border-white/10;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .photo-credit {
    @apply bottom-2 right-2;
  }

  .location-info {
    @apply text-xs px-2 py-1;
  }
}
</style>
