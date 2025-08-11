<template>
  <div class="dynamic-background">
    <!-- Background Images -->
    <transition-group name="fade" tag="div">
      <div
        v-for="(image, index) in images"
        v-show="currentImageIndex === index"
        :key="index"
        class="background-image"
        :style="{ backgroundImage: `url(${image.url})` }"
      >
        <div class="background-overlay"></div>
      </div>
    </transition-group>

    <!-- Floating particles -->
    <div class="particles-container">
      <div
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Location info with enhanced design -->
    <div class="photo-credit" v-if="currentImage">
      <div
        class="location-info"
        @mouseover="showDescription = true"
        @mouseleave="showDescription = false"
      >
        <div class="location-header">
          <div class="location-icon">📍</div>
          <div class="location-text">
            <div class="location-name">{{ currentImage.location }}</div>
            <div class="location-region">{{ currentImage.region }}</div>
          </div>
          <span v-if="currentImage.isLocal" class="local-badge">🔴 LIVE</span>
        </div>
        <transition name="fade">
          <div v-if="showDescription" class="location-details">
            <p class="location-description">
              {{ currentImage.description || "" }}
            </p>
            <div class="photo-source">
              <span class="source-label">Photo by:</span>
              <a 
                v-if="currentImage.photographerUrl" 
                :href="currentImage.photographerUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="photographer-link"
              >
                {{ currentImage.photographer }}
              </a>
              <span v-else>{{ currentImage.photographer }}</span>
              <span class="source-separator">•</span>
              <span class="source-name">{{ currentImage.source }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Enhanced Controls -->
    <div class="webcam-controls">
      <button
        @click="toggleAutoRotate"
        class="control-button"
        :class="{ active: autoRotate }"
        title="Toggle auto-rotation"
      >
        <span class="control-icon">{{ autoRotate ? "⏸️" : "▶️" }}</span>
        <span class="control-text">{{ autoRotate ? "Pause" : "Play" }}</span>
      </button>
      <button 
        @click="nextImage" 
        class="control-button"
        title="Next image"
      >
        <span class="control-icon">⏭️</span>
        <span class="control-text">Next</span>
      </button>
    </div>

    <!-- Image counter -->
    <div class="image-counter">
      {{ currentImageIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useLocalImages } from "@/composables/useLocalImages";

const { images, loading, error, fetchLocationImages } = useLocalImages();

const currentImageIndex = ref(0);
const autoRotate = ref(true);
const showDescription = ref(false);

const currentImage = computed(() => images.value[currentImageIndex.value]);

function nextImage() {
  if (images.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % images.value.length;
  }
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value;
}

function getParticleStyle(i) {
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 10 + 5;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
}

onMounted(() => {
  fetchLocationImages();

  // Auto-rotate images every 10 seconds (longer for real photos)
  setInterval(() => {
    if (autoRotate.value && images.value.length > 0) {
      nextImage();
    }
  }, 10000);

  // Refresh real-time images every 10 minutes
  setInterval(() => {
    const hasLocalImages = images.value.some((img) => img.isLocal);
    if (hasLocalImages) {
      fetchLocationImages();
    }
  }, 600000); // 10 minutes
});
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

/* Enhanced fade animation for background transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatUp linear infinite;
  backdrop-filter: blur(1px);
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) scale(1);
    opacity: 0;
  }
}

.photo-credit {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-size: 1rem;
  z-index: 10;
}

.location-info {
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  max-width: 400px;
}

.location-info:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.location-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.location-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.location-text {
  flex: 1;
  min-width: 0;
}

.location-name {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
  margin-bottom: 2px;
}

.location-region {
  font-size: 0.8rem;
  opacity: 0.8;
  color: #F28C38;
  font-weight: 500;
}

.local-badge {
  background: linear-gradient(135deg, #ff4757, #ff3742);
  color: white;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.location-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.location-description {
  font-size: 0.85rem;
  margin-bottom: 8px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

.photo-source {
  font-size: 0.75rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.source-label {
  color: rgba(255, 255, 255, 0.7);
}

.photographer-link {
  color: #F28C38;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.photographer-link:hover {
  color: #E8B923;
  text-decoration: underline;
}

.source-separator {
  color: rgba(255, 255, 255, 0.5);
}

.source-name {
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
}

.webcam-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.control-button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.control-button.active {
  background: linear-gradient(135deg, #F28C38, #E8B923);
  border-color: rgba(255, 255, 255, 0.3);
}

.control-icon {
  font-size: 1rem;
}

.control-text {
  font-weight: 500;
}

.image-counter {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 10;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .photo-credit {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  .location-info {
    padding: 10px 12px;
    max-width: none;
  }

  .location-name {
    font-size: 0.9rem;
  }

  .location-region {
    font-size: 0.75rem;
  }

  .webcam-controls {
    top: 10px;
    right: 10px;
    gap: 6px;
  }

  .control-button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .control-text {
    display: none;
  }

  .image-counter {
    bottom: 10px;
    right: 10px;
    padding: 4px 8px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .location-header {
    gap: 8px;
  }

  .location-icon {
    font-size: 1rem;
  }

  .local-badge {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}
</style>
