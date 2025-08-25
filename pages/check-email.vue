<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="max-w-2xl mx-auto text-center">
      <!-- Email Icon Animation -->
      <div class="mb-8">
        <div class="email-animation">
          <div class="email-icon">📧</div>
          <div class="email-pulse"></div>
        </div>
      </div>

      <!-- Main Message -->
      <h1
        class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-6"
      >
        Check Your Email! 📬
      </h1>

      <p class="text-xl text-gray-300 mb-8 leading-relaxed">
        We've sent you a confirmation email. Please check your inbox and click
        the confirmation link to complete your signup.
      </p>

      <!-- Email Steps -->
      <div
        class="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8"
      >
        <h2 class="text-2xl font-bold text-orange-400 mb-6">Next Steps:</h2>

        <div class="space-y-4 text-left">
          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >1</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">
                Check your email inbox
              </h3>
              <p class="text-gray-300">
                Look for an email from PNW Deals with the subject "Welcome to
                PNW Deals!"
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >2</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">
                Click the confirmation link
              </h3>
              <p class="text-gray-300">
                This verifies your email address and activates your account.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >3</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">
                Complete your payment
              </h3>
              <p class="text-gray-300">
                You'll be redirected to secure Stripe checkout to complete your
                $1/month subscription.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Troubleshooting -->
      <div
        class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8"
      >
        <h3 class="text-yellow-400 font-semibold mb-3 flex items-center">
          <span class="mr-2">⚠️</span>
          Don't see the email?
        </h3>
        <div class="text-gray-300 text-sm space-y-2">
          <p>• Check your spam/junk folder</p>
          <p>• Make sure you entered the correct email address</p>
          <p>• Wait a few minutes - emails can sometimes be delayed</p>
          <p>• Add deals@pnwdeals.com to your contacts</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="resendEmail"
          :disabled="resendCooldown > 0"
          class="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{
            resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"
          }}
        </button>
        <NuxtLink
          to="/"
          class="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          Back to Home
        </NuxtLink>
      </div>

      <!-- Support -->
      <div class="mt-12 pt-8 border-t border-gray-700">
        <p class="text-gray-400 text-sm">
          Still having trouble? Email us at
          <a
            href="mailto:support@pnwdeals.com"
            class="text-orange-400 hover:text-orange-300"
            >support@pnwdeals.com</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const { $supabase } = useNuxtApp();
const resendCooldown = ref(0);
let cooldownInterval = null;

const resendEmail = async () => {
  try {
    // Get email from URL params or localStorage
    const route = useRoute();
    const email = route.query.email || localStorage.getItem("signup_email");

    if (!email) {
      alert("Email address not found. Please try signing up again.");
      return;
    }

    const { error } = await $supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      alert("Failed to resend email. Please try again.");
      console.error("Resend error:", error);
      return;
    }

    // Start cooldown
    resendCooldown.value = 60;
    cooldownInterval = setInterval(() => {
      resendCooldown.value--;
      if (resendCooldown.value <= 0) {
        clearInterval(cooldownInterval);
      }
    }, 1000);

    alert("Confirmation email sent! Please check your inbox.");
  } catch (error) {
    console.error("Resend error:", error);
    alert("Failed to resend email. Please try again.");
  }
};

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
</script>

<style scoped>
.email-animation {
  position: relative;
  display: inline-block;
}

.email-icon {
  font-size: 4rem;
  animation: bounce 2s infinite;
}

.email-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(249, 115, 22, 0.3);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}
</style>
