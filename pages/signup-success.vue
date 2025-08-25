<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="max-w-2xl mx-auto text-center">
      <!-- Success Animation -->
      <div class="mb-8">
        <div class="text-6xl mb-4 animate-bounce">🎉</div>
      </div>

      <!-- Success Message -->
      <h1
        class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-6"
      >
        Thank You for Joining!
      </h1>

      <p class="text-xl text-gray-300 mb-8 leading-relaxed">
        Your newsletter signup is complete! We've saved your category
        preferences and you'll receive personalized deals every Monday.
      </p>

      <!-- What's Next -->
      <div
        class="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8"
      >
        <h2 class="text-2xl font-bold text-orange-400 mb-6">
          What happens next?
        </h2>

        <div class="space-y-4 text-left">
          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >1</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">
                Your preferences are saved
              </h3>
              <p class="text-gray-300">
                We've saved your selected categories:
                <span class="text-orange-400 font-semibold">{{
                  categoryNames.join(", ")
                }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >2</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">
                Get your first newsletter
              </h3>
              <p class="text-gray-300">
                Every Monday at 9 AM, you'll receive deals ONLY from businesses
                in your selected categories.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >3</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">
                Personalized just for you
              </h3>
              <p class="text-gray-300">
                You'll ONLY see deals from {{ categoryNames.length }} categories
                you chose - no spam!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/directory"
          class="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
        >
          Browse Businesses
        </NuxtLink>
        <NuxtLink
          to="/preferences"
          class="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          Update Preferences
        </NuxtLink>
        <NuxtLink
          to="/"
          class="text-gray-400 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          Back to Home
        </NuxtLink>
      </div>

      <!-- Support -->
      <div class="mt-12 pt-8 border-t border-gray-700">
        <p class="text-gray-400 text-sm">
          Questions? Email us at
          <a
            href="mailto:support@pnwdeals.com"
            class="text-orange-400 hover:text-orange-300"
            >support@pnwdeals.com</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const categoryNames = ref([]);

onMounted(() => {
  // Get category names from localStorage (set during signup)
  const savedCategories = localStorage.getItem("selected_category_names");
  if (savedCategories) {
    categoryNames.value = JSON.parse(savedCategories);
    // Clean up localStorage
    localStorage.removeItem("selected_category_names");
  } else {
    categoryNames.value = ["your selected categories"];
  }
});
</script>
