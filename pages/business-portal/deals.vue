<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
  >
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-orange-400 mb-2">
            Manage Your Deals
          </h1>
          <p class="text-gray-300">
            Create and manage deals that will be sent to newsletter subscribers
          </p>
        </div>

        <!-- Create New Deal Form -->
        <div
          class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-8"
        >
          <h2 class="text-xl font-bold text-orange-400 mb-4">
            Create New Deal
          </h2>

          <form @submit.prevent="createDeal" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 font-semibold mb-2"
                  >Deal Title *</label
                >
                <input
                  v-model="newDeal.title"
                  type="text"
                  placeholder="e.g., 20% Off All Entrees"
                  class="w-full p-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label class="block text-gray-300 font-semibold mb-2"
                  >Discount Badge</label
                >
                <input
                  v-model="newDeal.discount"
                  type="text"
                  placeholder="e.g., 20% OFF, $5 OFF, BOGO"
                  class="w-full p-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 font-semibold mb-2"
                >Deal Description *</label
              >
              <textarea
                v-model="newDeal.description"
                rows="3"
                placeholder="Describe your deal in detail. This will be sent to newsletter subscribers."
                class="w-full p-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 font-semibold mb-2"
                  >Start Date</label
                >
                <input
                  v-model="newDeal.start_date"
                  type="date"
                  class="w-full p-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label class="block text-gray-300 font-semibold mb-2"
                  >End Date</label
                >
                <input
                  v-model="newDeal.end_date"
                  type="date"
                  class="w-full p-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50"
              >
                {{ loading ? "Creating..." : "Create Deal" }}
              </button>
            </div>
          </form>
        </div>

        <!-- Existing Deals -->
        <div
          class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20"
        >
          <h2 class="text-xl font-bold text-orange-400 mb-4">
            Your Active Deals
          </h2>

          <div v-if="deals.length === 0" class="text-center text-gray-400 py-8">
            <p>No deals created yet. Create your first deal above!</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="deal in deals"
              :key="deal.id"
              class="bg-gray-800/50 p-4 rounded-xl border border-gray-600"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-white">
                  {{ deal.title }}
                </h3>
                <div class="flex space-x-2">
                  <span
                    v-if="deal.discount"
                    class="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-sm font-semibold"
                  >
                    {{ deal.discount }}
                  </span>
                  <button
                    @click="deleteDeal(deal.id)"
                    class="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p class="text-gray-300 mb-3">{{ deal.description }}</p>

              <div
                class="flex justify-between items-center text-sm text-gray-400"
              >
                <div>
                  <span v-if="deal.start_date"
                    >Starts: {{ formatDate(deal.start_date) }}</span
                  >
                  <span v-if="deal.start_date && deal.end_date"> • </span>
                  <span v-if="deal.end_date"
                    >Ends: {{ formatDate(deal.end_date) }}</span
                  >
                </div>
                <span>Created: {{ formatDate(deal.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter Preview -->
        <div
          class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mt-8"
        >
          <h2 class="text-xl font-bold text-orange-400 mb-4">
            Newsletter Preview
          </h2>
          <p class="text-gray-300 mb-4">
            This is how your deals will appear in the weekly newsletter:
          </p>

          <div
            class="bg-gray-900 p-4 rounded-xl border border-gray-600 max-h-96 overflow-y-auto"
          >
            <div
              v-if="deals.length === 0"
              class="text-gray-400 text-center py-4"
            >
              Create a deal to see the newsletter preview
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="deal in deals.slice(0, 3)"
                :key="deal.id"
                class="bg-gray-800 p-4 rounded-lg border-l-4 border-orange-500"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-orange-400 font-bold">{{ deal.title }}</h3>
                  <span
                    v-if="deal.discount"
                    class="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs font-bold"
                  >
                    {{ deal.discount }}
                  </span>
                </div>

                <p class="text-yellow-400 font-bold mb-2">
                  {{ business?.name }}
                </p>
                <p class="text-gray-300 text-sm mb-3">{{ deal.description }}</p>

                <div
                  v-if="deal.start_date || deal.end_date"
                  class="mb-3 text-xs text-gray-400"
                >
                  <div v-if="deal.start_date">
                    Starts: {{ formatDate(deal.start_date) }}
                  </div>
                  <div v-if="deal.end_date">
                    Ends: {{ formatDate(deal.end_date) }}
                  </div>
                </div>

                <button
                  class="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded text-sm font-bold"
                >
                  View Deal & Business →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";

const { $supabase } = useNuxtApp();

const deals = ref([]);
const business = ref(null);
const loading = ref(false);

const newDeal = ref({
  title: "",
  description: "",
  discount: "",
  start_date: "",
  end_date: "",
});

onMounted(async () => {
  await loadBusinessAndDeals();
});

const loadBusinessAndDeals = async () => {
  try {
    const {
      data: { user },
    } = await $supabase.auth.getUser();
    if (!user) {
      await navigateTo("/business-portal");
      return;
    }

    // Get business
    const { data: businessData, error: businessError } = await $supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (businessError) {
      console.error("Error loading business:", businessError);
      return;
    }

    business.value = businessData;

    // Get deals
    const { data: dealsData, error: dealsError } = await $supabase
      .from("deals")
      .select("*")
      .eq("business_id", businessData.id)
      .order("created_at", { ascending: false });

    if (dealsError) {
      console.error("Error loading deals:", dealsError);
      return;
    }

    deals.value = dealsData || [];
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const createDeal = async () => {
  if (!business.value) return;

  loading.value = true;
  try {
    const { error } = await $supabase.from("deals").insert({
      business_id: business.value.id,
      title: newDeal.value.title,
      description: newDeal.value.description,
      discount: newDeal.value.discount || null,
      start_date: newDeal.value.start_date || null,
      end_date: newDeal.value.end_date || null,
    });

    if (error) throw error;

    // Reset form
    newDeal.value = {
      title: "",
      description: "",
      discount: "",
      start_date: "",
      end_date: "",
    };

    // Reload deals
    await loadBusinessAndDeals();

    alert(
      "Deal created successfully! It will be included in the next weekly newsletter."
    );
  } catch (error) {
    console.error("Error creating deal:", error);
    alert("Error creating deal. Please try again.");
  } finally {
    loading.value = false;
  }
};

const deleteDeal = async (dealId) => {
  if (!confirm("Are you sure you want to delete this deal?")) return;

  try {
    const { error } = await $supabase.from("deals").delete().eq("id", dealId);

    if (error) throw error;

    await loadBusinessAndDeals();
  } catch (error) {
    console.error("Error deleting deal:", error);
    alert("Error deleting deal. Please try again.");
  }
};

const formatDate = (dateString) => {
  return format(new Date(dateString), "MMM d, yyyy");
};
</script>
