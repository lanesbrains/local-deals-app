<template>
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <h1 class="text-4xl font-bold text-orange-500 mb-8 text-center">{{ business?.name || 'Business' }}</h1>
      <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
      <div v-else-if="business" class="max-w-4xl mx-auto">
        <BusinessCard :business="business" detailed />
        <div v-if="business.deals?.length" class="mt-8">
          <h2 class="text-2xl font-bold text-orange-500 mb-4">Current Deals</h2>
          <div class="grid grid-cols-1 gap-6">
            <div v-for="deal in business.deals" :key="deal.id" class="deal-card">
              <h3 class="text-xl font-semibold text-white">{{ deal.title }}</h3>
              <p class="text-gray-300">{{ deal.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-300">Business not found.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const { $supabase } = useNuxtApp();
  const route = useRoute();
  const business = ref(null);
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
        .eq('slug', route.params.slug)
        .single();
      if (supabaseError) {
        console.error('Supabase error fetching business:', supabaseError);
        error.value = `Failed to load business: ${supabaseError.message}`;
      } else {
        business.value = data;
        useHead({
          title: data.name,
          meta: [
            { name: 'description', content: `${data.description || 'Discover deals from ' + data.name + ' in the Pacific Northwest.'}` },
          ],
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      error.value = 'Unexpected error loading business.';
    }
  });
  </script>