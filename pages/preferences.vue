<template>
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <h1 class="text-4xl font-bold text-pnw-orange mb-8 text-center fade-in">Update Your Preferences</h1>
      <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
      <div v-if="loading" class="text-center text-gray-300">Loading...</div>
      <div v-else-if="user" class="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <form @submit.prevent="updatePreferences">
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Your Email</label>
            <input
              :value="user.email"
              type="email"
              class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
              disabled
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Pick Your Interests</label>
            <CategoryFilter v-model="selectedCategories" :includeSubcategories="true" />
          </div>
          <AnimatedButton type="submit" :loading="saving">Save Preferences</AnimatedButton>
        </form>
      </div>
      <div v-else class="text-center text-gray-300">
        <p>Please log in to update your preferences.</p>
        <NuxtLink to="/login" class="animated-button inline-block mt-4">Log In</NuxtLink>
      </div>
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