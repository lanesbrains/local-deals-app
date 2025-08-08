<template>
  <div>
    <ConfettiExplosion v-if="showConfetti" class="fixed inset-0" :force="0.4" :stageWidth="2000" :stageHeight="2000" />
    <section class="hero-section text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 fade-in">Discover Epic PNW Deals!</h1>
      <p class="text-lg text-gray-300 mb-8 fade-in">Join our newsletter for just $1/month and get the best local deals!</p>
      <NuxtLink to="#signup" class="animated-button inline-block">Join Now</NuxtLink>
    </section>
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <h2 class="text-3xl font-bold text-orange-500 mb-6 text-center fade-in">Newest Businesses</h2>
      <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
      <div v-if="loading" class="text-center text-gray-300">Loading businesses...</div>
      <div v-else-if="recentBusinesses.length" class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="business in recentBusinesses" :key="business.id" :to="`/business/${business.slug || 'missing-slug-' + business.id}`" class="block">
          <BusinessCard :business="business" />
        </NuxtLink>
      </div>
      <div v-else class="text-center text-gray-300">No businesses yet.</div>
    </section>
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800" id="signup">
      <h2 class="text-3xl font-bold text-orange-500 mb-6 text-center fade-in">Join Our Newsletter</h2>
      <p class="text-lg text-gray-300 mb-8 text-center">Pick your favorite categories and get tailored deals!</p>
      <form @submit.prevent="handleSignup" class="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <div class="mb-6">
          <label class="block text-gray-300 font-semibold mb-2">Your Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-300 font-semibold mb-2">Pick Your Interests</label>
          <CategoryFilter v-model="selectedCategories" :includeSubcategories="true" />
        </div>
        <AnimatedButton type="submit" :loading="loading">Join for $1/month</AnimatedButton>
      </form>
    </section>
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <h2 class="text-3xl font-bold text-orange-500 mb-6 text-center fade-in">What People Are Saying</h2>
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="deal-card text-center">
          <p class="text-gray-300 italic">"Found an awesome coffee deal in Seattle!"</p>
          <p class="text-gray-500 mt-2">- Alex, Tacoma</p>
        </div>
        <div class="deal-card text-center">
          <p class="text-gray-300 italic">"The newsletter keeps me updated on local craft beer specials."</p>
          <p class="text-gray-500 mt-2">- Jamie, Portland</p>
        </div>
      </div>
    </section>
    <section class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800 text-center">
      <h2 class="text-3xl font-bold text-orange-500 mb-6 fade-in">Own a Business?</h2>
      <p class="text-lg text-gray-300 mb-8">Join our directory for $5/month and get your deals in front of thousands!</p>
      <NuxtLink to="/business-signup" class="animated-button inline-block">List Your Business</NuxtLink>
    </section>
  </div>
</template>

<script setup>
import ConfettiExplosion from 'vue-confetti-explosion';
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Find the best local deals in the Pacific Northwest with PNW Deals. Join our newsletter for $1/month!' },
  ],
});

const { $supabase } = useNuxtApp();
const email = ref('');
const selectedCategories = ref([]);
const recentBusinesses = ref([]);
const loading = ref(true);
const error = ref('');
const showConfetti = ref(false);

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
      .order('created_at', { ascending: false })
      .limit(3);
    if (supabaseError) {
      console.error('Supabase error fetching businesses:', supabaseError);
      error.value = `Failed to load businesses: ${supabaseError.message}`;
    } else {
      recentBusinesses.value = data || [];
      console.log('Fetched recent businesses:', data);
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

const handleSignup = async () => {
  loading.value = true;
  try {
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email: email.value,
      password: 'auto-generated-' + Math.random().toString(36).slice(2),
    });
    if (authError) throw authError;

    // Insert user
    const { error: userError } = await $supabase.from('users').insert({
      user_id: authData.user.id,
      email: email.value,
    });
    if (userError) throw userError;

    // Insert categories and subcategories into junction tables
    const categoriesToInsert = selectedCategories.value
      .filter(c => !c.subcategory_id)
      .map(c => ({ user_id: authData.user.id, category_id: c.id }));
    const subcategoriesToInsert = selectedCategories.value
      .filter(c => c.subcategory_id)
      .map(c => ({ user_id: authData.user.id, subcategory_id: c.subcategory_id }));

    if (categoriesToInsert.length > 0) {
      const { error: catError } = await $supabase.from('user_categories').insert(categoriesToInsert);
      if (catError) throw catError;
    }
    if (subcategoriesToInsert.length > 0) {
      const { error: subError } = await $supabase.from('user_subcategories').insert(subcategoriesToInsert);
      if (subError) throw subError;
    }

    // Create Stripe checkout session
    const { data: sessionData, error: sessionError } = await $supabase.functions.invoke('create-stripe-checkout', {
      body: {
        user_id: authData.user.id,
        email: email.value,
        plan_type: 'newsletter',
        price_id: 'price_newsletter_1month',
        success_url: window.location.origin + '/success',
        cancel_url: window.location.origin + '/cancel',
      },
    });
    if (sessionError) throw sessionError;

    const stripe = await loadStripe(useRuntimeConfig().public.stripePublishableKey);
    await stripe.redirectToCheckout({ sessionId: sessionData.session_id });

    showConfetti.value = true;
    setTimeout(() => (showConfetti.value = false), 2000);
    email.value = '';
    selectedCategories.value = [];
  } catch (error) {
    alert('Oops! Something went wrong. Try again.');
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>