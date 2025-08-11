<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          Business Portal
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
          Manage your business profile and deals
        </p>
      </div>
    </section>

    <!-- Login Section -->
    <section v-if="!user" class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-md mx-auto">
        <div class="card-bg p-8 rounded-2xl shadow-2xl">
          <h2 class="text-3xl font-bold text-pnw-orange mb-6 text-center">Log In</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-6">
              <label class="form-label">Email</label>
              <input
                v-model="email"
                type="email"
                class="form-input"
                required
              />
            </div>
            <div class="mb-6">
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-input"
                required
              />
            </div>
            <AnimatedButton type="submit" :loading="loading" class="w-full">
              Log In
            </AnimatedButton>
          </form>
        </div>
      </div>
    </section>

    <!-- Business Dashboard -->
    <div v-else>
      <!-- Business Info Section -->
      <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
        <div class="max-w-4xl mx-auto">
          <div class="card-bg p-8 rounded-2xl shadow-2xl">
            <h2 class="text-3xl font-bold text-pnw-orange mb-6">
              Your Business: {{ business?.name }}
            </h2>
            <form @submit.prevent="updateBusiness" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="form-label">Business Name</label>
                  <input
                    v-model="businessName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label class="form-label">Website</label>
                  <input
                    v-model="website"
                    type="url"
                    class="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <label class="form-label">Phone</label>
                  <input
                    v-model="phone"
                    type="tel"
                    class="form-input"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label class="form-label">Address</label>
                  <input
                    v-model="address"
                    type="text"
                    class="form-input"
                    placeholder="123 Main St, Seattle, WA 98101"
                  />
                </div>
                <div>
                  <label class="form-label">Twitter URL</label>
                  <input
                    v-model="socialMedia.twitter"
                    type="url"
                    class="form-input"
                    placeholder="https://twitter.com/yourbusiness"
                  />
                </div>
                <div>
                  <label class="form-label">Instagram URL</label>
                  <input
                    v-model="socialMedia.instagram"
                    type="url"
                    class="form-input"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>
              </div>
              <div>
                <label class="form-label">Description</label>
                <textarea
                  v-model="description"
                  class="form-input"
                  rows="4"
                  placeholder="Tell customers about your business..."
                ></textarea>
              </div>
              <div class="text-center">
                <AnimatedButton type="submit" :loading="loading">
                  Update Profile
                </AnimatedButton>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Deals Management Section -->
      <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg-alt">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-pnw-orange mb-8 text-center">Manage Deals</h2>
          
          <!-- Existing Deals -->
          <div v-if="deals.length" class="space-y-6 mb-12">
            <DealCard v-for="deal in deals" :key="deal.id" :deal="deal" @delete="deleteDeal(deal.id)" />
          </div>
          
          <!-- No Deals Message -->
          <div v-else class="text-center py-12">
            <div class="text-6xl mb-4">🎯</div>
            <h3 class="text-2xl font-bold text-gray-300 mb-4">No deals yet</h3>
            <p class="text-gray-400 mb-8">Create your first deal to start attracting customers!</p>
          </div>

          <!-- Add New Deal Form -->
          <div class="card-bg p-8 rounded-2xl shadow-2xl">
            <h3 class="text-2xl font-bold text-pnw-orange mb-6">Add New Deal</h3>
            <form @submit.prevent="addDeal" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="form-label">Deal Title</label>
                  <input
                    v-model="newDeal.title"
                    type="text"
                    class="form-input"
                    placeholder="50% Off Coffee"
                    required
                  />
                </div>
                <div>
                  <label class="form-label">Discount Amount</label>
                  <input
                    v-model="newDeal.discount"
                    type="text"
                    class="form-input"
                    placeholder="50% or $10 off"
                    required
                  />
                </div>
              </div>
              <div>
                <label class="form-label">Description</label>
                <textarea
                  v-model="newDeal.description"
                  class="form-input"
                  rows="4"
                  placeholder="Describe your deal in detail..."
                  required
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="form-label">Start Date</label>
                  <input
                    v-model="newDeal.start_date"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label class="form-label">End Date</label>
                  <input
                    v-model="newDeal.end_date"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>
              </div>
              <div class="text-center">
                <AnimatedButton type="submit" :loading="loading">
                  Add Deal
                </AnimatedButton>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-pnw-orange mb-12">Your Business Stats</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="stat-card">
              <div class="text-4xl font-bold text-pnw-orange mb-2">{{ deals.length }}</div>
              <div class="text-gray-300">Active Deals</div>
            </div>
            <div class="stat-card">
              <div class="text-4xl font-bold text-pnw-orange mb-2">{{ business?.is_premium ? 'Premium' : 'Standard' }}</div>
              <div class="text-gray-300">Listing Type</div>
            </div>
            <div class="stat-card">
              <div class="text-4xl font-bold text-pnw-orange mb-2">PNW</div>
              <div class="text-gray-300">Market Reach</div>
            </div>
          </div>
        </div>
      </section>
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

<style scoped>
.stat-card {
  @apply p-6 rounded-xl backdrop-blur-md transition-all duration-300;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>