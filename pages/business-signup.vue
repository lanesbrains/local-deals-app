<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
    <ConfettiExplosion v-if="showConfetti" class="fixed inset-0" :force="0.4" :stageWidth="2000" :stageHeight="2000" />
    <h1 class="text-4xl sm:text-5xl font-bold text-orange-500 mb-8 text-center fade-in">Join Our PNW Directory!</h1>
    <p class="text-lg text-gray-300 mb-10 text-center">List your business for $5/month (or $10/month for premium)!</p>
    <form @submit.prevent="handleBusinessSignup" class="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Business Email (for login)</label>
        <input
          v-model="email"
          type="email"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Business Name</label>
        <input
          v-model="businessName"
          type="text"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Description</label>
        <textarea
          v-model="description"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows="4"
        ></textarea>
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Website</label>
        <input
          v-model="website"
          type="url"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Phone</label>
        <input
          v-model="phone"
          type="tel"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Address</label>
        <input
          v-model="address"
          type="text"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Social Media (e.g., Twitter, Instagram)</label>
        <input
          v-model="socialMedia.twitter"
          type="url"
          placeholder="Twitter URL"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
        />
        <input
          v-model="socialMedia.instagram"
          type="url"
          placeholder="Instagram URL"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Category</label>
        <select
          v-model="categoryId"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Subcategory</label>
        <select
          v-model="subcategoryId"
          class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="" disabled>Select a subcategory</option>
          <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.id">
            {{ subcategory.name }}
          </option>
        </select>
      </div>
      <div class="mb-6">
        <label class="block text-gray-300 font-semibold mb-2">Premium Listing ($10/month)</label>
        <input type="checkbox" v-model="isPremium" class="mr-2" />
        <span class="text-gray-300">Yes, make my listing stand out!</span>
      </div>
      <AnimatedButton type="submit" :loading="loading">Join Now</AnimatedButton>
    </form>
  </div>
</template>

<script setup>
import ConfettiExplosion from 'vue-confetti-explosion';
import { ref, computed, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

const { $supabase } = useNuxtApp();
const email = ref('');
const password = ref('');
const businessName = ref('');
const description = ref('');
const website = ref('');
const phone = ref('');
const address = ref('');
const socialMedia = ref({ twitter: '', instagram: '' });
const categoryId = ref(null);
const subcategoryId = ref(null);
const isPremium = ref(false);
const categories = ref([]);
const subcategories = ref([]);
const loading = ref(false);
const showConfetti = ref(false);

onMounted(async () => {
  const { data: catData, error: catError } = await $supabase.from('categories').select('id, name');
  if (catError) console.error('Error fetching categories:', catError);
  else categories.value = catData || [];

  const { data: subData, error: subError } = await $supabase.from('subcategories').select('id, name, category_id');
  if (subError) console.error('Error fetching subcategories:', subError);
  else subcategories.value = subData || [];
});

const filteredSubcategories = computed(() => {
  return subcategories.value.filter(sub => sub.category_id === categoryId.value);
});

const handleBusinessSignup = async () => {
  loading.value = true;
  try {
    const { data: userData, error: authError } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (authError) throw authError;

    const slug = `${businessName.value.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const { data: businessData, error: businessError } = await $supabase.from('businesses').insert({
      name: businessName.value,
      description: description.value,
      website: website.value,
      phone: phone.value,
      address: address.value,
      social_media: socialMedia.value,
      category_id: categoryId.value,
      subcategory_id: subcategoryId.value,
      is_premium: isPremium.value,
      slug,
      user_id: userData.user.id,
    }).select('id').single();
    if (businessError) throw businessError;

    const priceId = isPremium.value ? 'price_business_premium_1month' : 'price_business_standard_1month';
    const { data: sessionData, error: sessionError } = await $supabase.functions.invoke('create-stripe-checkout', {
      body: {
        user_id: userData.user.id,
        email: email.value,
        plan_type: isPremium.value ? 'business_premium' : 'business_standard',
        price_id: priceId,
        business_id: businessData.id,
        success_url: window.location.origin + '/success',
        cancel_url: window.location.origin + '/cancel',
      },
    });
    if (sessionError) throw sessionError;

    const stripe = await loadStripe(useRuntimeConfig().public.stripePublishableKey);
    await stripe.redirectToCheckout({ sessionId: sessionData.session_id });

    showConfetti.value = true;
    setTimeout(() => (showConfetti.value = false), 2000);
    alert('Awesome! Your business is in. You can now log in at /business-portal.');
    email.value = '';
    password.value = '';
    businessName.value = '';
    description.value = '';
    website.value = '';
    phone.value = '';
    socialMedia.value = { twitter: '', instagram: '' };
    categoryId.value = null;
    subcategoryId.value = null;
    isPremium.value = false;
  } catch (error) {
    alert('Oops! Something went wrong. Try again.');
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>