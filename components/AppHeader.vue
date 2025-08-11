<template>
    <header class="bg-pnw-evergreen text-white shadow-lg">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-pnw-yellow">PNW Deals</span>
          </NuxtLink>
  
          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-8">
            <NuxtLink
              to="/"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/directory"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
            >
              Directory
            </NuxtLink>
            <NuxtLink
              to="/business-signup"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
            >
              List Your Business
            </NuxtLink>
            <NuxtLink
              to="/preferences"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
            >
              Preferences
            </NuxtLink>
          </div>
  
          <!-- Mobile Menu Button -->
          <button
            class="md:hidden text-gray-300 hover:text-pnw-orange focus:outline-none"
            @click="toggleMenu"
            aria-label="Toggle navigation menu"
            aria-expanded="isMenuOpen"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
  
        <!-- Mobile Menu -->
        <div
          v-if="isMenuOpen"
          class="md:hidden bg-pnw-evergreen"
          :class="{ 'animate-slide-in': isMenuOpen, 'animate-slide-out': !isMenuOpen }"
        >
          <div class="flex flex-col space-y-4 py-4">
            <NuxtLink
              to="/"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
              @click="toggleMenu"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/directory"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
              @click="toggleMenu"
            >
              Directory
            </NuxtLink>
            <NuxtLink
              to="/business-signup"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
              @click="toggleMenu"
            >
              List Your Business
            </NuxtLink>
            <NuxtLink
              to="/preferences"
              class="text-gray-300 hover:text-pnw-orange transition-colors duration-300"
              active-class="text-pnw-orange font-semibold"
              @click="toggleMenu"
            >
              Preferences
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isMenuOpen = ref(false);
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  </script>
  
  <style scoped>
  .animate-slide-in {
    animation: slideIn 0.3s ease-in-out forwards;
  }
  .animate-slide-out {
    animation: slideOut 0.3s ease-in-out forwards;
  }
  @keyframes slideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
  </style>