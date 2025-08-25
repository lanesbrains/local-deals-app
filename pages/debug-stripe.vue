<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">🔍 Stripe Integration Debug</h1>

      <div class="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 class="text-xl font-bold mb-4">Configuration Check</h2>
        <div class="space-y-2 font-mono text-sm">
          <div>
            Stripe Publishable Key:
            {{ stripeKey ? "✅ Configured" : "❌ Missing" }}
          </div>
          <div>Key Preview: {{ stripeKey?.substring(0, 20) }}...</div>
          <div>
            Supabase URL: {{ supabaseUrl ? "✅ Configured" : "❌ Missing" }}
          </div>
          <div>App URL: {{ appUrl }}</div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 class="text-xl font-bold mb-4">Quick Tests</h2>
        <div class="space-y-4">
          <button
            @click="testStripeLoad"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Test Stripe Loading
          </button>

          <button
            @click="testSupabaseFunction"
            :disabled="loading"
            class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50 ml-4"
          >
            Test Supabase Function
          </button>

          <button
            @click="testFullFlow"
            :disabled="loading"
            class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50 ml-4"
          >
            Test Full Flow
          </button>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Debug Log</h2>
        <div
          class="bg-black p-4 rounded font-mono text-sm max-h-96 overflow-y-auto"
        >
          <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
            <span :class="getLogColor(log.type)"
              >[{{ log.timestamp }}] {{ log.type.toUpperCase() }}:</span
            >
            {{ log.message }}
          </div>
        </div>
        <button
          @click="clearLogs"
          class="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Clear Logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";

const { $supabase } = useNuxtApp();
const config = useRuntimeConfig();

const stripeKey = ref(config.public.stripePublishableKey);
const supabaseUrl = ref(config.public.supabaseUrl);
const appUrl = ref(config.public.appUrl);
const loading = ref(false);
const debugLogs = ref([]);

const addLog = (type, message) => {
  debugLogs.value.push({
    type,
    message,
    timestamp: new Date().toLocaleTimeString(),
  });
};

const getLogColor = (type) => {
  const colors = {
    info: "text-blue-400",
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
  };
  return colors[type] || "text-gray-400";
};

const clearLogs = () => {
  debugLogs.value = [];
};

const testStripeLoad = async () => {
  loading.value = true;
  addLog("info", "Testing Stripe loading...");

  try {
    if (!stripeKey.value) {
      throw new Error("Stripe publishable key not configured");
    }

    addLog(
      "info",
      `Loading Stripe with key: ${stripeKey.value.substring(0, 20)}...`
    );
    const stripe = await loadStripe(stripeKey.value);

    if (!stripe) {
      throw new Error("Failed to load Stripe");
    }

    addLog("success", "Stripe loaded successfully!");
    addLog("info", `Stripe object: ${typeof stripe}`);
  } catch (error) {
    addLog("error", `Stripe loading failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const testSupabaseFunction = async () => {
  loading.value = true;
  addLog("info", "Testing Supabase function...");

  try {
    const { data, error } = await $supabase.functions.invoke(
      "create-stripe-checkout",
      {
        body: {
          user_id: "debug-user-" + Date.now(),
          email: "debug@example.com",
          plan_type: "newsletter",
          price_id: "price_1S06naFqXu3q4jXwqTbg1reO",
          success_url: window.location.origin + "/success",
          cancel_url: window.location.origin + "/cancel",
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    addLog("success", `Checkout session created: ${data.session_id}`);
    addLog(
      "info",
      `Checkout URL: https://checkout.stripe.com/c/pay/${data.session_id}`
    );
  } catch (error) {
    addLog("error", `Supabase function failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const testFullFlow = async () => {
  loading.value = true;
  addLog("info", "Testing complete signup flow...");

  try {
    // Step 1: Test Stripe loading
    addLog("info", "Step 1: Loading Stripe...");
    const stripe = await loadStripe(stripeKey.value);
    if (!stripe) throw new Error("Stripe failed to load");
    addLog("success", "Stripe loaded");

    // Step 2: Create checkout session
    addLog("info", "Step 2: Creating checkout session...");
    const { data, error } = await $supabase.functions.invoke(
      "create-stripe-checkout",
      {
        body: {
          user_id: "debug-user-" + Date.now(),
          email: "debug@example.com",
          plan_type: "newsletter",
          price_id: "price_1S06naFqXu3q4jXwqTbg1reO",
          success_url: window.location.origin + "/success",
          cancel_url: window.location.origin + "/cancel",
        },
      }
    );

    if (error) throw new Error(error.message);
    addLog("success", `Session created: ${data.session_id}`);

    // Step 3: Test redirect (but don't actually redirect)
    addLog("info", "Step 3: Testing redirect preparation...");
    addLog(
      "warning",
      "Would redirect to: https://checkout.stripe.com/c/pay/" + data.session_id
    );
    addLog("success", "Full flow test completed successfully!");
    addLog(
      "info",
      "If you want to test the actual redirect, click the checkout URL above"
    );
  } catch (error) {
    addLog("error", `Full flow test failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  addLog("info", "Debug page loaded");
  addLog("info", `Environment: ${process.env.NODE_ENV || "development"}`);
});
</script>
