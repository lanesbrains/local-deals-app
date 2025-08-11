<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          {{ business?.name || 'Business' }}
        </h1>
        <p v-if="business?.description" class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
          {{ business.description }}
        </p>
      </div>
    </section>

    <!-- Business Details Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-4xl mx-auto">
        <div v-if="error" class="text-center text-red-500 mb-8 text-lg">{{ error }}</div>
        <div v-else-if="business" class="space-y-12">
          <!-- Business Card -->
          <BusinessCard :business="business" detailed />
          
          <!-- Contact Information -->
          <div class="card-bg p-8 rounded-2xl shadow-2xl">
            <h2 class="text-3xl font-bold text-pnw-orange mb-6">Contact Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="business.website" class="contact-item">
                <div class="text-2xl mb-2">🌐</div>
                <h3 class="text-lg font-semibold mb-2">Website</h3>
                <a :href="business.website" target="_blank" class="text-pnw-orange hover:underline">
                  {{ business.website }}
                </a>
              </div>
              <div v-if="business.phone" class="contact-item">
                <div class="text-2xl mb-2">📞</div>
                <h3 class="text-lg font-semibold mb-2">Phone</h3>
                <a :href="`tel:${business.phone}`" class="text-pnw-orange hover:underline">
                  {{ business.phone }}
                </a>
              </div>
              <div v-if="business.address" class="contact-item">
                <div class="text-2xl mb-2">📍</div>
                <h3 class="text-lg font-semibold mb-2">Address</h3>
                <p class="text-gray-300">{{ business.address }}</p>
              </div>
              <div v-if="business.social_media?.twitter || business.social_media?.instagram" class="contact-item">
                <div class="text-2xl mb-2">📱</div>
                <h3 class="text-lg font-semibold mb-2">Social Media</h3>
                <div class="space-y-2">
                  <a v-if="business.social_media.twitter" :href="business.social_media.twitter" target="_blank" class="block text-pnw-orange hover:underline">
                    Twitter
                  </a>
                  <a v-if="business.social_media.instagram" :href="business.social_media.instagram" target="_blank" class="block text-pnw-orange hover:underline">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Deals -->
          <div v-if="business.deals?.length" class="card-bg p-8 rounded-2xl shadow-2xl">
            <h2 class="text-3xl font-bold text-pnw-orange mb-8">Current Deals</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="deal in business.deals" :key="deal.id" class="deal-card">
                <div class="text-3xl mb-4">🎯</div>
                <h3 class="text-xl font-bold mb-3">{{ deal.title }}</h3>
                <p class="text-gray-300">{{ deal.description }}</p>
              </div>
            </div>
          </div>

          <!-- No Deals Message -->
          <div v-else class="card-bg p-8 rounded-2xl shadow-2xl text-center">
            <div class="text-6xl mb-4">🎯</div>
            <h3 class="text-2xl font-bold text-gray-300 mb-4">No deals available</h3>
            <p class="text-gray-400 mb-8">Check back soon for new deals from this business!</p>
          </div>
        </div>
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">🏪</div>
          <h3 class="text-2xl font-bold text-gray-300 mb-4">Business not found</h3>
          <p class="text-gray-400 mb-8">The business you're looking for doesn't exist or has been removed.</p>
          <NuxtLink to="/directory" class="animated-button inline-block">
            Browse All Businesses
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg-alt text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-pnw-orange mb-6">Own a Business?</h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join our directory and get your deals in front of thousands of PNW locals!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/business-signup" class="animated-button">
            List Your Business
          </NuxtLink>
          <NuxtLink to="/directory" class="cta-button-secondary">
            Browse Directory
          </NuxtLink>
        </div>
      </div>
    </section>
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

<style scoped>
.contact-item {
  @apply p-6 rounded-xl backdrop-blur-md transition-all duration-300;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

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