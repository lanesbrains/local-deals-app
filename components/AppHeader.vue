<template>
  <header class="header-bg sticky top-0 z-50 transition-all duration-300">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Enhanced Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <div class="logo-container">
            <span class="text-2xl font-bold text-pnw-yellow group-hover:text-pnw-orange transition-colors duration-300">
              PNW Deals
            </span>
            <div class="logo-underline"></div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="nav-link"
            active-class="nav-link active"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/directory"
            class="nav-link"
            active-class="nav-link active"
          >
            Directory
          </NuxtLink>
          <NuxtLink
            to="/business-signup"
            class="nav-link"
            active-class="nav-link active"
          >
            List Your Business
          </NuxtLink>
          <NuxtLink
            to="/preferences"
            class="nav-link"
            active-class="nav-link active"
          >
            Preferences
          </NuxtLink>
          
          <!-- CTA Button -->
          <NuxtLink 
            to="/business-signup" 
            class="cta-button"
          >
            Get Started
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden mobile-menu-button"
          @click="toggleMenu"
          aria-label="Toggle navigation menu"
          aria-expanded="isMenuOpen"
        >
          <div class="hamburger" :class="{ 'is-active': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <!-- Enhanced Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 transform -translate-y-4"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-4"
      >
        <div
          v-if="isMenuOpen"
          class="md:hidden mobile-menu"
        >
          <div class="mobile-menu-content">
            <NuxtLink
              to="/"
              class="mobile-nav-link"
              active-class="mobile-nav-link active"
              @click="closeMenu"
            >
              <span class="mobile-nav-icon">🏠</span>
              Home
            </NuxtLink>
            <NuxtLink
              to="/directory"
              class="mobile-nav-link"
              active-class="mobile-nav-link active"
              @click="closeMenu"
            >
              <span class="mobile-nav-icon">📋</span>
              Directory
            </NuxtLink>
            <NuxtLink
              to="/business-signup"
              class="mobile-nav-link"
              active-class="mobile-nav-link active"
              @click="closeMenu"
            >
              <span class="mobile-nav-icon">🏢</span>
              List Your Business
            </NuxtLink>
            <NuxtLink
              to="/preferences"
              class="mobile-nav-link"
              active-class="mobile-nav-link active"
              @click="closeMenu"
            >
              <span class="mobile-nav-icon">⚙️</span>
              Preferences
            </NuxtLink>
            
            <!-- Mobile CTA -->
            <div class="mobile-cta">
              <NuxtLink 
                to="/business-signup" 
                class="mobile-cta-button"
                @click="closeMenu"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Prevent body scroll when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

// Close menu on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
};

// Close menu on window resize
const handleResize = () => {
  if (window.innerWidth >= 768 && isMenuOpen.value) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Logo Styles */
.logo-container {
  position: relative;
}

.logo-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #F28C38, #E8B923);
  transition: width 0.3s ease;
}

.logo-container:hover .logo-underline {
  width: 100%;
}

/* Navigation Links */
.nav-link {
  @apply text-gray-300 hover:text-pnw-orange transition-all duration-300 relative font-medium;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #F28C38, #E8B923);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active {
  @apply text-pnw-orange font-semibold;
}

.nav-link.active::after {
  width: 100%;
}

/* CTA Button */
.cta-button {
  @apply bg-gradient-to-r from-pnw-orange to-pnw-yellow text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-pnw-orange/25 hover:transform hover:scale-105;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.05);
}

/* Mobile Menu Button */
.mobile-menu-button {
  @apply p-2 rounded-lg transition-colors duration-200;
}

.mobile-menu-button:hover {
  @apply bg-white/10;
}

/* Hamburger Icon */
.hamburger {
  @apply relative w-6 h-6 flex flex-col justify-center items-center;
}

.hamburger span {
  @apply w-6 h-0.5 bg-white rounded-full transition-all duration-300;
  position: absolute;
}

.hamburger span:nth-child(1) {
  transform: translateY(-8px);
}

.hamburger span:nth-child(2) {
  transform: translateY(0);
}

.hamburger span:nth-child(3) {
  transform: translateY(8px);
}

.hamburger.is-active span:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  @apply backdrop-blur-xl border-t border-white/10 mt-4 rounded-2xl overflow-hidden;
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-menu-content {
  @apply py-4 px-4 space-y-2;
}

.mobile-nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-pnw-orange transition-all duration-300 font-medium;
}

.mobile-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav-link.active {
  @apply text-pnw-orange font-semibold;
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav-icon {
  @apply text-lg;
}

.mobile-cta {
  @apply pt-4 mt-4 border-t border-white/10;
}

.mobile-cta-button {
  @apply w-full text-white px-6 py-3 rounded-xl font-semibold text-center block transition-all duration-300;
  background: linear-gradient(135deg, #F28C38, #E8B923);
}

.mobile-cta-button:hover {
  @apply shadow-lg;
  box-shadow: 0 10px 25px rgba(242, 140, 56, 0.25);
}

/* Header scroll effect */
.header-bg {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background-color: rgba(255, 255, 255, 0.08);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .mobile-menu {
    @apply mx-2;
  }
}

/* Animation delays for mobile menu items */
.mobile-nav-link:nth-child(1) { animation-delay: 0.1s; }
.mobile-nav-link:nth-child(2) { animation-delay: 0.2s; }
.mobile-nav-link:nth-child(3) { animation-delay: 0.3s; }
.mobile-nav-link:nth-child(4) { animation-delay: 0.4s; }

/* Focus states for accessibility */
.nav-link:focus-visible,
.mobile-nav-link:focus-visible,
.cta-button:focus-visible,
.mobile-cta-button:focus-visible {
  @apply outline-none ring-2 ring-pnw-orange/50 ring-offset-2 ring-offset-gray-900;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .nav-link,
  .mobile-nav-link {
    @apply border border-transparent;
  }
  
  .nav-link:hover,
  .mobile-nav-link:hover {
    @apply border-white;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .nav-link::after,
  .logo-underline,
  .hamburger span {
    transition: none;
  }
}
</style>