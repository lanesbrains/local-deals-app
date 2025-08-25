<template>
  <div>
    <ConfettiExplosion
      v-if="showConfetti"
      class="fixed inset-0"
      :force="0.4"
      :stageWidth="2000"
      :stageHeight="2000"
    />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1
          class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight"
        >
          Join Our PNW Directory!
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed"
        >
          List your business for $5/month (or $10/month for premium) and reach
          thousands of PNW locals!
        </p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-2xl mx-auto">
        <form
          @submit.prevent="handleBusinessSignup"
          class="card-bg p-8 rounded-2xl shadow-2xl"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Account Details -->
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold text-pnw-orange mb-6">
                Account Details
              </h2>
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Business Email (for login)</label>
              <input v-model="email" type="email" class="form-input" required />
            </div>
            <div>
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-input"
                required
              />
            </div>
            <div>
              <label class="form-label">Business Name</label>
              <input
                v-model="businessName"
                type="text"
                class="form-input"
                required
              />
            </div>

            <!-- Business Details -->
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold text-pnw-orange mb-6 mt-8">
                Business Details
              </h2>
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Description</label>
              <textarea
                v-model="description"
                class="form-input"
                rows="4"
                placeholder="Tell us about your business..."
              ></textarea>
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
            <div class="md:col-span-2">
              <label class="form-label">Address</label>
              <input
                v-model="address"
                type="text"
                class="form-input"
                placeholder="123 Main St, Seattle, WA 98101"
              />
            </div>

            <!-- Social Media -->
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold text-pnw-orange mb-6 mt-8">
                Social Media
              </h2>
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

            <!-- Categories -->
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold text-pnw-orange mb-6 mt-8">
                Categories
              </h2>
            </div>
            <div>
              <label class="form-label">Category</label>
              <select v-model="categoryId" class="form-input" required>
                <option value="" disabled>Select a category</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Subcategory</label>
              <select v-model="subcategoryId" class="form-input">
                <option value="" disabled>Select a subcategory</option>
                <option
                  v-for="subcategory in filteredSubcategories"
                  :key="subcategory.id"
                  :value="subcategory.id"
                >
                  {{ subcategory.name }}
                </option>
              </select>
            </div>

            <!-- Premium Option -->
            <div class="md:col-span-2">
              <div class="card-bg p-6 rounded-xl border border-pnw-orange/20">
                <div class="flex items-center mb-4">
                  <input
                    type="checkbox"
                    v-model="isPremium"
                    class="mr-3 w-5 h-5 text-pnw-orange bg-gray-700 border-gray-600 rounded focus:ring-pnw-orange"
                  />
                  <label class="text-xl font-bold text-pnw-orange"
                    >Premium Listing ($10/month)</label
                  >
                </div>
                <p class="text-gray-300 text-sm">
                  Premium listings get featured placement, priority in search
                  results, and enhanced visibility across the platform.
                </p>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="md:col-span-2 text-center mt-8">
              <AnimatedButton
                type="submit"
                :loading="loading"
                class="w-full md:w-auto"
              >
                Join Now - {{ isPremium ? "$10/month" : "$5/month" }}
              </AnimatedButton>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg-alt text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-pnw-orange mb-12">
          Why Join Our Directory?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="benefit-card">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold mb-3">Targeted Audience</h3>
            <p class="text-gray-300">
              Reach PNW locals who are actively looking for deals and local
              businesses.
            </p>
          </div>
          <div class="benefit-card">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-bold mb-3">Affordable Pricing</h3>
            <p class="text-gray-300">
              Just $5/month for standard listings, $10/month for premium
              placement.
            </p>
          </div>
          <div class="benefit-card">
            <div class="text-4xl mb-4">📈</div>
            <h3 class="text-xl font-bold mb-3">Grow Your Business</h3>
            <p class="text-gray-300">
              Increase foot traffic, online visibility, and customer engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
import { ref, computed, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";

const { $supabase } = useNuxtApp();
const email = ref("");
const password = ref("");
const businessName = ref("");
const description = ref("");
const website = ref("");
const phone = ref("");
const address = ref("");
const socialMedia = ref({ twitter: "", instagram: "" });
const categoryId = ref(null);
const subcategoryId = ref(null);
const isPremium = ref(false);
const categories = ref([]);
const subcategories = ref([]);
const loading = ref(false);
const showConfetti = ref(false);

onMounted(async () => {
  const { data: catData, error: catError } = await $supabase
    .from("categories")
    .select("id, name");
  if (catError) console.error("Error fetching categories:", catError);
  else categories.value = catData || [];

  const { data: subData, error: subError } = await $supabase
    .from("subcategories")
    .select("id, name, category_id");
  if (subError) console.error("Error fetching subcategories:", subError);
  else subcategories.value = subData || [];
});

const filteredSubcategories = computed(() => {
  return subcategories.value.filter(
    (sub) => sub.category_id === categoryId.value
  );
});

const handleBusinessSignup = async () => {
  loading.value = true;
  try {
    const { data: userData, error: authError } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (authError) throw authError;

    const slug = `${businessName.value.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const { data: businessData, error: businessError } = await $supabase
      .from("businesses")
      .insert({
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
      })
      .select("id")
      .single();
    if (businessError) throw businessError;

    const priceId = isPremium.value
      ? "price_1S085OFqXu3q4jXw3HBZeOG0" // $10/month premium
      : "price_1S085NFqXu3q4jXwXgYBWhuD"; // $5/month standard
    const { data: sessionData, error: sessionError } =
      await $supabase.functions.invoke("create-stripe-checkout", {
        body: {
          user_id: userData.user.id,
          email: email.value,
          plan_type: isPremium.value ? "business_premium" : "business_standard",
          price_id: priceId,
          business_id: businessData.id,
          success_url: window.location.origin + "/success",
          cancel_url: window.location.origin + "/cancel",
        },
      });
    if (sessionError) throw sessionError;

    console.log("🔄 Loading Stripe for business signup...");
    const stripe = await loadStripe(
      useRuntimeConfig().public.stripePublishableKey
    );

    if (!stripe) {
      throw new Error(
        "Payment system not available - please check your internet connection"
      );
    }

    console.log("✅ Stripe loaded, redirecting to checkout...");
    console.log("   Session ID:", sessionData.session_id);

    showConfetti.value = true;

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: sessionData.session_id,
    });

    // This code should never execute if redirect works
    console.error("❌ Business signup Stripe redirect failed:", stripeError);

    if (stripeError) {
      throw new Error(`Stripe redirect failed: ${stripeError.message}`);
    } else {
      throw new Error(
        "Stripe redirect was blocked - please disable popup blockers and try again"
      );
    }
  } catch (error) {
    alert("Oops! Something went wrong. Try again.");
    console.error(error);
  } finally {
    loading.value = false;
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
