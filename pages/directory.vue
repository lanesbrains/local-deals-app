<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl sm:text-5xl font-bold text-orange-500 mb-8 text-center fade-in">PNW Business Directory</h1>
    <div class="max-w-4xl mx-auto mb-10">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for businesses..."
        class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
    <div class="max-w-4xl mx-auto mb-10">
      <CategoryFilter v-model="selectedCategories" :includeSubcategories="true" />
    </div>
    <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
    <div v-if="loading" class="text-center text-gray-300">Loading businesses...</div>
    <div v-else-if="filteredBusinesses.length" class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink v-for="business in filteredBusinesses" :key="business.id" :to="`/business/${business.slug || 'missing-slug-' + business.id}`" class="block">
        <BusinessCard :business="business" />
      </NuxtLink>
    </div>
    <div v-else class="text-center text-gray-300">No businesses found.</div>
    <div class="text-center mt-8">
      <NuxtLink to="/business-signup" class="animated-button inline-block">Are you a business? Join us!</NuxtLink>
    </div>
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
      if (!data.some(b => b.name === 'Lanes Brains')) {
        console.warn('Lanes Brains not found in fetched data');
      }
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
  console.log('Filtered businesses:', filtered);
  return filtered;
});
</script>