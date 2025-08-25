<template>
  <div>
    <ConfettiExplosion
      v-if="showConfetti"
      class="fixed inset-0"
      :force="0.4"
      :stageWidth="2000"
      :stageHeight="2000"
    />
    <HeroSection />
    <section class="py-12 px-4 sm:px-6 lg:px-8 section-bg">
      <h2 class="text-3xl font-bold text-orange-400 mb-6 text-center fade-in">
        Newest Businesses
      </h2>
      <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
      <div v-if="loading" class="text-center text-gray-300">
        Loading businesses...
      </div>
      <div
        v-else-if="recentBusinesses.length"
        class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="business in recentBusinesses"
          :key="business.id"
          :to="`/business/${business.slug || 'missing-slug-' + business.id}`"
          class="block"
        >
          <BusinessCard :business="business" />
        </NuxtLink>
      </div>
      <div v-else class="text-center text-gray-300">No businesses yet.</div>
    </section>
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg-alt" id="signup">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-orange-400 mb-6 text-center fade-in">
          Join Our Newsletter
        </h2>
        <p class="text-xl text-white/90 mb-12 text-center max-w-2xl mx-auto">
          Pick your favorite categories and get tailored deals delivered to your
          inbox!
        </p>

        <!-- Error Message -->
        <div
          v-if="error"
          class="error-message bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-md"
        >
          <div class="flex items-center">
            <span class="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 class="text-red-400 font-semibold mb-1">Signup Error</h3>
              <p class="text-red-300">{{ error }}</p>
            </div>
          </div>
        </div>

        <form
          @submit.prevent="handleSignup"
          class="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Email Input -->
            <div class="lg:col-span-1">
              <label class="block text-gray-300 font-semibold mb-3 text-lg"
                >Your Email</label
              >
              <input
                v-model="email"
                type="email"
                placeholder="your@email.com"
                class="w-full p-4 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
              <div class="mt-6">
                <AnimatedButton type="submit" :loading="loading" class="w-full">
                  Join for $1/month
                </AnimatedButton>
              </div>
            </div>

            <!-- Interests Selection -->
            <div class="lg:col-span-2">
              <label class="block text-gray-300 font-semibold mb-3 text-lg"
                >Pick Your Interests</label
              >
              <CategoryFilter
                v-model="selectedCategories"
                :includeSubcategories="true"
              />
            </div>
          </div>
        </form>
      </div>
    </section>
    <section class="py-12 px-4 sm:px-6 lg:px-8 section-bg">
      <h2 class="text-3xl font-bold text-orange-400 mb-6 text-center fade-in">
        What People Are Saying
      </h2>
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="deal-card text-center">
          <p class="text-gray-300 italic">
            "Found an awesome coffee deal in Seattle!"
          </p>
          <p class="text-gray-500 mt-2">- Alex, Tacoma</p>
        </div>
        <div class="deal-card text-center">
          <p class="text-gray-300 italic">
            "The newsletter keeps me updated on local craft beer specials."
          </p>
          <p class="text-gray-500 mt-2">- Jamie, Portland</p>
        </div>
      </div>
    </section>
    <section class="py-12 px-4 sm:px-6 lg:px-8 section-bg-alt text-center">
      <h2 class="text-3xl font-bold text-orange-400 mb-6 fade-in">
        Own a Business?
      </h2>
      <p class="text-xl text-white/90 mb-8">
        Join our directory for $5/month and get your deals in front of
        thousands!
      </p>
      <NuxtLink to="/business-signup" class="animated-button inline-block"
        >List Your Business</NuxtLink
      >
    </section>
  </div>
</template>

<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";

useHead({
  title: "Home",
  meta: [
    {
      name: "description",
      content:
        "Find the best local deals in the Pacific Northwest with PNW Deals. Join our newsletter for $1/month!",
    },
  ],
});

const { $supabase } = useNuxtApp();
const email = ref("");
const selectedCategories = ref([]);
const recentBusinesses = ref([]);
const loading = ref(true);
const error = ref("");
const showConfetti = ref(false);

onMounted(async () => {
  try {
    const { data, error: supabaseError } = await $supabase
      .from("businesses")
      .select(
        `
        id, name, description, website, phone, address, social_media, slug, is_premium, created_at, category_id, subcategory_id,
        categories (id, name),
        subcategories (id, name),
        deals (id, title, description)
      `
      )
      .order("created_at", { ascending: false })
      .limit(3);
    if (supabaseError) {
      console.error("Supabase error fetching businesses:", supabaseError);
      error.value = `Failed to load businesses: ${supabaseError.message}`;
    } else {
      recentBusinesses.value = data || [];
      console.log("Fetched recent businesses:", data);
      if (!data.some((b) => b.name === "Lanes Brains")) {
        console.warn("Lanes Brains not found in fetched data");
      }
    }
  } catch (err) {
    console.error("Unexpected error fetching businesses:", err);
    error.value = "Unexpected error loading businesses. Please try again.";
  } finally {
    loading.value = false;
  }
});

const handleSignup = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Validate input
    if (!email.value) {
      throw new Error("Please enter your email address");
    }
    if (selectedCategories.value.length === 0) {
      throw new Error("Please select at least one category");
    }

    console.log("Starting signup process for:", email.value);
    console.log("Selected categories:", selectedCategories.value);

    // Step 1: Create auth user
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email: email.value,
      password: "auto-generated-" + Math.random().toString(36).slice(2),
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw new Error(`Signup failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("Failed to create user account");
    }

    console.log("User created successfully:", authData.user.id);

    // Step 2: Insert user record
    const { error: userError } = await $supabase.from("users").insert({
      user_id: authData.user.id,
      email: email.value,
    });

    if (userError) {
      console.error("User insert error:", userError);
      throw new Error(`Failed to save user data: ${userError.message}`);
    }

    console.log("User record inserted successfully");

    // Step 3: Insert category preferences
    const categoriesToInsert = selectedCategories.value
      .filter((c) => !c.subcategory_id)
      .map((c) => ({ user_id: authData.user.id, category_id: c.id }));

    const subcategoriesToInsert = selectedCategories.value
      .filter((c) => c.subcategory_id)
      .map((c) => ({
        user_id: authData.user.id,
        subcategory_id: c.subcategory_id,
      }));

    console.log("Categories to insert:", categoriesToInsert);
    console.log("Subcategories to insert:", subcategoriesToInsert);

    if (categoriesToInsert.length > 0) {
      const { error: catError } = await $supabase
        .from("user_categories")
        .insert(categoriesToInsert);

      if (catError) {
        console.error("Category insert error:", catError);
        throw new Error(
          `Failed to save category preferences: ${catError.message}`
        );
      }
      console.log("Categories inserted successfully");
    }

    if (subcategoriesToInsert.length > 0) {
      const { error: subError } = await $supabase
        .from("user_subcategories")
        .insert(subcategoriesToInsert);

      if (subError) {
        console.error("Subcategory insert error:", subError);
        throw new Error(
          `Failed to save subcategory preferences: ${subError.message}`
        );
      }
      console.log("Subcategories inserted successfully");
    }

    // Step 4: Create Stripe checkout session
    console.log("Creating Stripe checkout session...");

    const { data: sessionData, error: sessionError } =
      await $supabase.functions.invoke("create-stripe-checkout", {
        body: {
          user_id: authData.user.id,
          email: email.value,
          plan_type: "newsletter",
          price_id: "prod_SvylU8VEQFV83C",
          success_url: window.location.origin + "/success",
          cancel_url: window.location.origin + "/cancel",
        },
      });

    if (sessionError) {
      console.error("Stripe session error:", sessionError);
      throw new Error(`Payment setup failed: ${sessionError.message}`);
    }

    if (!sessionData?.session_id) {
      throw new Error("Failed to create payment session");
    }

    console.log("Signup successful! Redirecting to check email page...");

    // Store email and session for later use
    localStorage.setItem("signup_email", email.value);
    localStorage.setItem("stripe_session_id", sessionData.session_id);

    // Redirect to check email page
    await navigateTo(`/check-email?email=${encodeURIComponent(email.value)}`);

    // Reset form
    email.value = "";
    selectedCategories.value = [];
  } catch (error) {
    console.error("Signup error:", error);

    // Show user-friendly error message
    if (error.message.includes("RLS") || error.message.includes("policy")) {
      error.value =
        "There's a temporary issue with our signup system. Please try again in a few minutes or contact support.";
    } else if (error.message.includes("already registered")) {
      error.value = "This email is already registered. Try logging in instead.";
    } else if (error.message.includes("invalid email")) {
      error.value = "Please enter a valid email address.";
    } else {
      error.value = error.message || "Something went wrong. Please try again.";
    }

    // Scroll to error message
    setTimeout(() => {
      const errorElement = document.querySelector(".error-message");
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  } finally {
    loading.value = false;
  }
};
</script>
