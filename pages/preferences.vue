<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          Your Preferences
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
          Customize your experience and get deals that match your interests
        </p>
      </div>
    </section>

    <!-- Preferences Form Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-2xl mx-auto">
        <div v-if="error" class="text-center text-red-500 mb-8 text-lg">{{ error }}</div>
        <div v-if="loading" class="text-center text-gray-300 mb-8">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-lg">Loading your preferences...</p>
        </div>
        <div v-else-if="user" class="card-bg p-8 rounded-2xl shadow-2xl">
          <h2 class="text-3xl font-bold text-pnw-orange mb-8 text-center">Update Your Preferences</h2>
          <form @submit.prevent="updatePreferences" class="space-y-8">
            <div>
              <label class="form-label">Your Email</label>
              <input
                :value="user.email"
                type="email"
                class="form-input opacity-75 cursor-not-allowed"
                disabled
              />
              <p class="text-sm text-gray-400 mt-2">This is your login email and cannot be changed</p>
            </div>
            
            <div>
              <label class="form-label text-xl font-semibold mb-4">Pick Your Interests</label>
              <p class="text-gray-300 mb-6">Select the categories and subcategories that interest you most. We'll use these to send you personalized deals!</p>
              <CategoryFilter v-model="selectedCategories" :includeSubcategories="true" />
            </div>

            <div class="text-center">
              <AnimatedButton type="submit" :loading="saving" class="w-full md:w-auto">
                Save Preferences
              </AnimatedButton>
            </div>
          </form>
        </div>
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">🔐</div>
          <h3 class="text-2xl font-bold text-gray-300 mb-4">Please log in</h3>
          <p class="text-gray-400 mb-8">You need to be logged in to update your preferences</p>
          <NuxtLink to="/login" class="animated-button inline-block">
            Log In
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg-alt text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-pnw-orange mb-12">Why Set Preferences?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="benefit-card">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold mb-3">Personalized Deals</h3>
            <p class="text-gray-300">Get deals that match your interests and lifestyle.</p>
          </div>
          <div class="benefit-card">
            <div class="text-4xl mb-4">📧</div>
            <h3 class="text-xl font-bold mb-3">Smart Notifications</h3>
            <p class="text-gray-300">Receive relevant updates without spam or irrelevant offers.</p>
          </div>
          <div class="benefit-card">
            <div class="text-4xl mb-4">💡</div>
            <h3 class="text-xl font-bold mb-3">Discover New Places</h3>
            <p class="text-gray-300">Find local businesses you might not have known about.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { $supabase } = useNuxtApp();
const user = ref(null);
const selectedCategories = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');

useHead({
  title: 'Preferences',
  meta: [
    { name: 'description', content: 'Update your newsletter preferences to get tailored deals from PNW Deals.' },
  ],
});

onMounted(async () => {
  try {
    const { data: { user: authUser } } = await $supabase.auth.getUser();
    if (authUser) {
      user.value = authUser;
      const { data: categories, error: catError } = await $supabase
        .from('user_categories')
        .select('category_id')
        .eq('user_id', authUser.id);
      const { data: subcategories, error: subError } = await $supabase
        .from('user_subcategories')
        .select('subcategory_id')
        .eq('user_id', authUser.id);
      if (catError || subError) throw new Error('Failed to load preferences');
      selectedCategories.value = [
        ...(categories?.map(c => ({ id: c.category_id, subcategory_id: null })) || []),
        ...(subcategories?.map(s => ({ id: null, subcategory_id: s.subcategory_id })) || []),
      ];
    }
  } catch (err) {
    error.value = `Error: ${err.message}`;
  } finally {
    loading.value = false;
  }
});

const updatePreferences = async () => {
  if (!user.value) return;
  saving.value = true;
  try {
    // Delete existing preferences
    await Promise.all([
      $supabase.from('user_categories').delete().eq('user_id', user.value.id),
      $supabase.from('user_subcategories').delete().eq('user_id', user.value.id),
    ]);

    // Insert new preferences
    const categoriesToInsert = selectedCategories.value
      .filter(c => c.id && !c.subcategory_id)
      .map(c => ({ user_id: user.value.id, category_id: c.id }));
    const subcategoriesToInsert = selectedCategories.value
      .filter(c => c.subcategory_id)
      .map(c => ({ user_id: user.value.id, subcategory_id: c.subcategory_id }));

    if (categoriesToInsert.length > 0) {
      const { error: catError } = await $supabase.from('user_categories').insert(categoriesToInsert);
      if (catError) throw catError;
    }
    if (subcategoriesToInsert.length > 0) {
      const { error: subError } = await $supabase.from('user_subcategories').insert(subcategoriesToInsert);
      if (subError) throw subError;
    }

    alert('Preferences updated successfully!');
  } catch (err) {
    error.value = `Error saving preferences: ${err.message}`;
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.benefit-card {
  @apply p-6 rounded-xl backdrop-blur-md transition-all duration-300;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>