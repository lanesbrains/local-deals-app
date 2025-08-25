<template>
  <div>
    <!-- Restaurant Hero Section -->
    <section
      class="hero-section bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700"
    >
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1
          class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight"
        >
          🍴 PNW Restaurant Deals
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed"
        >
          Discover the best restaurant deals across Washington, Oregon, Idaho,
          and Montana. From farm-to-table dining to craft breweries.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#signup"
            class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          >
            Get Restaurant Deals - $1/month
          </a>
          <NuxtLink
            to="/directory"
            class="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Browse Restaurants
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Restaurant Categories -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-red-400 mb-12 text-center">
          Restaurant Categories
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="restaurant-category-card">
            <div class="text-4xl mb-4">☕</div>
            <h3 class="text-xl font-bold text-white mb-2">Coffee Shops</h3>
            <p class="text-gray-300 text-sm">
              Local roasters, cozy cafes, and artisan coffee
            </p>
          </div>
          <div class="restaurant-category-card">
            <div class="text-4xl mb-4">🍽️</div>
            <h3 class="text-xl font-bold text-white mb-2">Fine Dining</h3>
            <p class="text-gray-300 text-sm">
              Farm-to-table, upscale restaurants, chef specials
            </p>
          </div>
          <div class="restaurant-category-card">
            <div class="text-4xl mb-4">🍺</div>
            <h3 class="text-xl font-bold text-white mb-2">Breweries</h3>
            <p class="text-gray-300 text-sm">
              Craft beer, taprooms, brewery tours
            </p>
          </div>
          <div class="restaurant-category-card">
            <div class="text-4xl mb-4">🚚</div>
            <h3 class="text-xl font-bold text-white mb-2">Food Trucks</h3>
            <p class="text-gray-300 text-sm">
              Street food, mobile eats, festival favorites
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup - Restaurant Focused -->
    <section
      class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-gray-900"
      id="signup"
    >
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-red-400 mb-6 text-center">
          Get Restaurant Deals Delivered
        </h2>
        <p class="text-xl text-white/90 mb-12 text-center max-w-2xl mx-auto">
          Choose your favorite restaurant types and get personalized deals every
          Monday!
        </p>

        <!-- Error Message -->
        <div
          v-if="error"
          class="error-message bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-md max-w-2xl mx-auto"
        >
          <div class="flex items-center">
            <span class="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 class="text-red-400 font-semibold mb-1">Signup Error</h3>
              <p class="text-red-300">{{ error }}</p>
            </div>
          </div>
        </div>

        <form
          @submit.prevent="handleRestaurantSignup"
          class="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 max-w-4xl mx-auto"
        >
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Email Input -->
            <div class="lg:col-span-1">
              <label class="block text-gray-300 font-semibold mb-3 text-lg"
                >Your Email</label
              >
              <input
                v-model="email"
                type="email"
                placeholder="your@email.com"
                class="w-full p-4 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
              />
              <div class="mt-6">
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  {{
                    loading ? "Joining..." : "Get Restaurant Deals - $1/month"
                  }}
                </button>
              </div>
            </div>

            <!-- Restaurant Types Selection -->
            <div class="lg:col-span-2">
              <label class="block text-gray-300 font-semibold mb-3 text-lg"
                >Choose Restaurant Types</label
              >
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="category in restaurantCategories"
                  :key="category.id"
                  class="restaurant-checkbox-card"
                  :class="{
                    selected: selectedCategories.includes(category.id),
                  }"
                >
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="selectedCategories"
                    class="sr-only"
                  />
                  <div class="text-2xl mb-2">{{ category.icon }}</div>
                  <div class="font-semibold text-sm">{{ category.name }}</div>
                </label>
              </div>
              <p class="text-gray-400 text-sm mt-3">
                Select the types of restaurants you want deals from. You'll only
                receive deals from your selected categories.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Featured Restaurants -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-red-400 mb-12 text-center">
          Featured PNW Restaurants
        </h2>
        <div
          v-if="featuredRestaurants.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="restaurant in featuredRestaurants"
            :key="restaurant.id"
            class="restaurant-featured-card"
          >
            <div class="p-6">
              <h3 class="text-xl font-bold text-white mb-2">
                {{ restaurant.name }}
              </h3>
              <p class="text-gray-300 text-sm mb-4">
                {{ restaurant.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-red-400 font-semibold">{{
                  restaurant.category_name
                }}</span>
                <NuxtLink
                  :to="`/business/${restaurant.slug}`"
                  class="text-orange-400 hover:text-orange-300 font-semibold text-sm"
                >
                  View Deals →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400">
          <p>
            Featured restaurants will appear here once businesses start joining!
          </p>
        </div>
      </div>
    </section>

    <!-- Why Choose PNW Restaurant Deals -->
    <section
      class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-gray-900"
    >
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-red-400 mb-12">
          Why PNW Restaurant Deals?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="benefit-card">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold mb-3 text-white">Personalized</h3>
            <p class="text-gray-300">
              Only get deals from restaurant types you actually want to visit.
            </p>
          </div>
          <div class="benefit-card">
            <div class="text-4xl mb-4">🌲</div>
            <h3 class="text-xl font-bold mb-3 text-white">Local Focus</h3>
            <p class="text-gray-300">
              Supporting Pacific Northwest restaurants and local food culture.
            </p>
          </div>
          <div class="benefit-card">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-bold mb-3 text-white">Great Value</h3>
            <p class="text-gray-300">
              Just $1/month for unlimited access to restaurant deals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Restaurant Owner CTA -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-red-400 mb-6">Own a Restaurant?</h2>
        <p class="text-xl text-white/90 mb-8">
          Join our directory for just $5/month and get your deals in front of
          thousands of local food lovers!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/business-signup"
            class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          >
            List Your Restaurant
          </NuxtLink>
          <NuxtLink
            to="/business-portal"
            class="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Restaurant Login
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// SEO
useHead({
  title:
    "PNW Restaurant Deals - Best Local Restaurant Deals in the Pacific Northwest",
  meta: [
    {
      name: "description",
      content:
        "Discover the best restaurant deals across Washington, Oregon, Idaho, and Montana. Get personalized deals from local restaurants for just $1/month.",
    },
    {
      name: "keywords",
      content:
        "restaurant deals, PNW restaurants, Pacific Northwest dining, local food deals, Seattle restaurants, Portland restaurants",
    },
  ],
});

const { $supabase } = useNuxtApp();

// Form state
const email = ref("");
const selectedCategories = ref([]);
const loading = ref(false);
const error = ref("");

// Restaurant categories (filtered for restaurants only)
const restaurantCategories = ref([
  { id: 1, name: "Coffee Shops", icon: "☕" },
  { id: 2, name: "Fine Dining", icon: "🍽️" },
  { id: 3, name: "Casual Dining", icon: "🍕" },
  { id: 4, name: "Breweries", icon: "🍺" },
  { id: 5, name: "Food Trucks", icon: "🚚" },
  { id: 6, name: "Bakeries", icon: "🥖" },
  { id: 7, name: "Fast Casual", icon: "🥪" },
  { id: 8, name: "Bars & Pubs", icon: "🍻" },
  { id: 9, name: "Asian Cuisine", icon: "🥢" },
  { id: 10, name: "Mexican Food", icon: "🌮" },
  { id: 11, name: "Italian", icon: "🍝" },
  { id: 12, name: "Seafood", icon: "🦞" },
]);

const featuredRestaurants = ref([]);

onMounted(async () => {
  // Load actual restaurant categories from database
  try {
    const { data: categories } = await $supabase
      .from("categories")
      .select("id, name, slug")
      .in("slug", ["food-dining", "coffee-shops", "restaurants", "breweries"]);

    if (categories && categories.length > 0) {
      // Map database categories to our restaurant categories
      restaurantCategories.value = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: getRestaurantIcon(cat.slug),
      }));
    }

    // Load featured restaurants
    const { data: restaurants } = await $supabase
      .from("businesses")
      .select(
        `
        id, name, slug, description,
        categories(name)
      `
      )
      .not("category_id", "is", null)
      .limit(6);

    if (restaurants) {
      featuredRestaurants.value = restaurants.map((r) => ({
        ...r,
        category_name: r.categories?.name || "Restaurant",
      }));
    }
  } catch (err) {
    console.error("Error loading restaurant data:", err);
  }
});

const getRestaurantIcon = (slug) => {
  const icons = {
    "food-dining": "🍽️",
    "coffee-shops": "☕",
    restaurants: "🍕",
    breweries: "🍺",
    bakeries: "🥖",
    "bars-pubs": "🍻",
  };
  return icons[slug] || "🍴";
};

const handleRestaurantSignup = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Validate input
    if (!email.value) {
      throw new Error("Please enter your email address");
    }
    if (selectedCategories.value.length === 0) {
      throw new Error("Please select at least one restaurant type");
    }

    console.log("Starting restaurant signup for:", email.value);
    console.log("Selected restaurant types:", selectedCategories.value);

    // Create auth user
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email: email.value,
      password: "auto-generated-" + Math.random().toString(36).slice(2),
    });

    if (authError) {
      throw new Error(`Signup failed: ${authError.message}`);
    }

    // Insert user record
    const { error: userError } = await $supabase.from("users").insert({
      user_id: authData.user.id,
      email: email.value,
    });

    if (userError) {
      throw new Error(`Failed to save user data: ${userError.message}`);
    }

    // Insert restaurant category preferences
    const categoryInserts = selectedCategories.value.map((categoryId) => ({
      user_id: authData.user.id,
      category_id: categoryId,
    }));

    const { error: catError } = await $supabase
      .from("user_categories")
      .insert(categoryInserts);

    if (catError) {
      throw new Error(
        `Failed to save restaurant preferences: ${catError.message}`
      );
    }

    // Store category names for thank you page
    const selectedNames = restaurantCategories.value
      .filter((cat) => selectedCategories.value.includes(cat.id))
      .map((cat) => cat.name);

    localStorage.setItem(
      "selected_category_names",
      JSON.stringify(selectedNames)
    );

    // Redirect to success page
    await navigateTo("/signup-success");

    // Reset form
    email.value = "";
    selectedCategories.value = [];
  } catch (error) {
    console.error("Restaurant signup error:", error);
    error.value = error.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.restaurant-category-card {
  @apply p-6 rounded-xl backdrop-blur-md transition-all duration-300 text-center;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.1),
    rgba(249, 115, 22, 0.1)
  );
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.restaurant-category-card:hover {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.2),
    rgba(249, 115, 22, 0.2)
  );
  border-color: rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

.restaurant-checkbox-card {
  @apply p-4 rounded-lg backdrop-blur-md transition-all duration-300 text-center cursor-pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.restaurant-checkbox-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.restaurant-checkbox-card.selected {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.2),
    rgba(249, 115, 22, 0.2)
  );
  border-color: rgba(239, 68, 68, 0.6);
}

.restaurant-featured-card {
  @apply rounded-xl backdrop-blur-md transition-all duration-300;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.restaurant-featured-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-2px);
}

.benefit-card {
  @apply p-6 rounded-xl backdrop-blur-md transition-all duration-300;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}
</style>
