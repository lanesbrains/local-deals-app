<template>
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <h1 class="text-4xl sm:text-5xl font-bold text-orange-500 mb-8 text-center fade-in">Business Portal</h1>
      <div v-if="!user" class="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-orange-500 mb-4">Log In</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Email</label>
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
          <AnimatedButton type="submit" :loading="loading">Log In</AnimatedButton>
        </form>
      </div>
      <div v-else class="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-orange-500 mb-4">Your Business: {{ business?.name }}</h2>
        <form @submit.prevent="updateBusiness" class="mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label class="block text-gray-300 font-semibold mb-2">Social Media (Twitter)</label>
              <input
                v-model="socialMedia.twitter"
                type="url"
                class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div class="mb-6">
              <label class="block text-gray-300 font-semibold mb-2">Social Media (Instagram)</label>
              <input
                v-model="socialMedia.instagram"
                type="url"
                class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Description</label>
            <textarea
              v-model="description"
              class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="4"
            ></textarea>
          </div>
          <AnimatedButton type="submit" :loading="loading">Update Profile</AnimatedButton>
        </form>
        <h2 class="text-2xl font-bold text-orange-500 mb-4">Manage Deals</h2>
        <div class="space-y-4 mb-8">
          <DealCard v-for="deal in deals" :key="deal.id" :deal="deal" @delete="deleteDeal(deal.id)" />
        </div>
        <h3 class="text-xl font-semibold text-orange-500 mb-4">Add New Deal</h3>
        <form @submit.prevent="addDeal">
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Deal Title</label>
            <input
              v-model="newDeal.title"
              type="text"
              class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Description</label>
            <textarea
              v-model="newDeal.description"
              class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="4"
            ></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 font-semibold mb-2">Expires At</label>
            <input
              v-model="newDeal.expires_at"
              type="date"
              class="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <AnimatedButton type="submit" :loading="loading">Add Deal</AnimatedButton>
        </form>
        <div class="mt-8">
          <AnimatedButton @click="logout">Log Out</AnimatedButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const { $supabase } = useNuxtApp();
  const router = useRouter();
  const user = ref(null);
  const email = ref('');
  const password = ref('');
  const business = ref(null);
  const deals = ref([]);
  const businessName = ref('');
  const description = ref('');
  const website = ref('');
  const phone = ref('');
  const address = ref('');
  const socialMedia = ref({ twitter: '', instagram: '' });
  const newDeal = ref({ title: '', description: '', expires_at: '' });
  const loading = ref(false);
  
  onMounted(async () => {
    const { data: { user: authUser } } = await $supabase.auth.getUser();
    if (authUser) {
      user.value = authUser;
      const { data, error } = await $supabase
        .from('businesses')
        .select(`
          id, name, description, website, phone, address, social_media,
          deals (id, title, description, expires_at)
        `)
        .eq('user_id', authUser.id)
        .single();
      if (error) console.error('Error fetching business:', error);
      else {
        business.value = data;
        businessName.value = data.name;
        description.value = data.description;
        website.value = data.website;
        phone.value = data.phone;
        address.value = data.address;
        socialMedia.value = data.social_media || { twitter: '', instagram: '' };
        deals.value = data.deals || [];
      }
    }
  });
  
  const handleLogin = async () => {
    loading.value = true;
    try {
      const { error } = await $supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert('Login failed. Check your credentials.');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const updateBusiness = async () => {
    loading.value = true;
    try {
      const { error } = await $supabase
        .from('businesses')
        .update({
          name: businessName.value,
          description: description.value,
          website: website.value,
          phone: phone.value,
          address: address.value,
          social_media: socialMedia.value,
        })
        .eq('id', business.value.id);
      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Oops! Something went wrong. Try again.');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const addDeal = async () => {
    loading.value = true;
    try {
      const { error } = await $supabase
        .from('deals')
        .insert({
          business_id: business.value.id,
          title: newDeal.value.title,
          description: newDeal.value.description,
          expires_at: newDeal.value.expires_at || null,
        });
      if (error) throw error;
      newDeal.value = { title: '', description: '', expires_at: '' };
      window.location.reload(); // Refresh to update deals
    } catch (error) {
      alert('Oops! Something went wrong. Try again.');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const deleteDeal = async (dealId) => {
    loading.value = true;
    try {
      const { error } = await $supabase
        .from('deals')
        .delete()
        .eq('id', dealId);
      if (error) throw error;
      deals.value = deals.value.filter(deal => deal.id !== dealId);
    } catch (error) {
      alert('Oops! Something went wrong. Try again.');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const logout = async () => {
    await $supabase.auth.signOut();
    router.push('/');
  };
  </script>