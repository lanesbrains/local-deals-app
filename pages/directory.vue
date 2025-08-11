<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          PNW Business Directory
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
          Discover amazing local businesses across the Pacific Northwest
        </p>
      </div>
    </section>

    <!-- Search Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for businesses..."
            class="form-input text-lg"
          />
        </div>
        <div class="mb-8">
          <CategoryFilter v-model="selectedCategories" :includeSubcategories="true" />
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8 section-bg-alt">
      <div class="max-w-7xl mx-auto">
        <div v-if="error" class="text-center text-red-500 mb-8 text-lg">{{ error }}</div>
        <div v-if="loading" class="text-center text-gray-300 mb-8">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-lg">Loading businesses...</p>
        </div>
        <div v-else-if="filteredBusinesses.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink 
            v-for="business in filteredBusinesses" 
            :key="business.id" 
            :to="`/business/${business.slug || 'missing-slug-' + business.id}`" 
            class="block"
          >
            <BusinessCard :business="business" />
          </NuxtLink>
        </div>
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">🏪</div>
          <h3 class="text-2xl font-bold text-gray-300 mb-4">No businesses found</h3>
          <p class="text-gray-400 mb-8">Try adjusting your search or browse all categories</p>
          <NuxtLink to="/business-signup" class="animated-button inline-block">
            List Your Business
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-pnw-orange mb-6 fade-in">
          Own a Business?
        </h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join our directory and get your deals in front of thousands of PNW locals!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/business-signup" class="animated-button">
            List Your Business
          </NuxtLink>
          <NuxtLink to="/" class="cta-button-secondary">
            Learn More
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

useHead({
  title: 'Business Directory',
  meta: [
    { name: 'description', content: 'Explore local businesses in the Pacific Northwest, from coffee shops to outdoor gear. Find deals and join our directory!' },
  ],
});

const { $supabase } = useNuxtApp();
const searchQuery = ref('');
const selectedCategories = ref([]);
const businesses = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data, error: supabaseError } = await $supabase
      .from('businesses')
      .select(`
        id, name, description, website, phone, address, social_media, slug, is_premium, created_at, category_id, subcategory_id,
        categories (id, name),
        subcategories (id, name),
        deals (id, title, description)
      `)
      .order('created_at', { ascending: false });
    if (supabaseError) {
      console.error('Supabase error fetching businesses:', supabaseError);
      error.value = `Failed to load businesses: ${supabaseError.message}`;
    } else {
      businesses.value = data || [];
      console.log('Fetched businesses:', data);
    }
  } catch (err) {
    console.error('Unexpected error fetching businesses:', err);
    error.value = 'Unexpected error loading businesses. Please try again.';
  } finally {
    loading.value = false;
  }
});

const filteredBusinesses = computed(() => {
  const filtered = businesses.value.filter(business => {
    const matchesSearch = (business.name || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategories.value.length
      ? selectedCategories.value.some(c => 
          c.id === business.category_id || 
          (c.subcategory_id && c.subcategory_id === business.subcategory_id)
        )
      : true;
    return matchesSearch && matchesCategory;
  });
  return filtered;
});
</script>

<style scoped>
.cta-button-secondary {
  @apply backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg border transition-all duration-300;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-button-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>