<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="max-w-2xl mx-auto text-center">
      <!-- Success Animation -->
      <div class="mb-8">
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <h1
        class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-6"
      >
        🎉 Welcome to PNW Deals!
      </h1>

      <p class="text-xl text-gray-300 mb-8 leading-relaxed">
        Your subscription is now active! You'll receive your first personalized
        newsletter every Monday with deals tailored to your interests.
      </p>

      <!-- What's Next -->
      <div
        class="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8"
      >
        <h2 class="text-2xl font-bold text-orange-400 mb-6">
          What happens next?
        </h2>

        <div class="space-y-4 text-left">
          <div class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1"
              >1</span
            >
            <div>
              <h3 class="text-white font-semibold mb-1">Check your email</h3>
              <p class="text-gray-300">
                We've sent you a confirmation email with your subscription
                details.
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
                Get your first newsletter
              </h3>
              <p class="text-gray-300">
                Every Monday at 9 AM, you'll receive deals from your selected
                categories.
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
                Discover amazing deals
              </h3>
              <p class="text-gray-300">
                Save money at your favorite PNW businesses and discover new
                ones!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/directory"
          class="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
        >
          Browse Businesses
        </NuxtLink>
        <NuxtLink
          to="/preferences"
          class="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          Update Preferences
        </NuxtLink>
        <NuxtLink
          to="/"
          class="text-gray-400 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          Back to Home
        </NuxtLink>
      </div>

      <!-- Support -->
      <div class="mt-12 pt-8 border-t border-gray-700">
        <p class="text-gray-400 text-sm">
          Questions? Email us at
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

<style scoped>
.success-checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4ade80;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #4ade80;
  animation:
    fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.success-checkmark .check-icon {
  width: 56px;
  height: 56px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #4ade80;
  margin: 8px;
}

.success-checkmark .check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.success-checkmark .check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}

.success-checkmark .check-icon::before,
.success-checkmark .check-icon::after {
  content: "";
  height: 100px;
  position: absolute;
  background: #1f2937;
  transform: rotate(-45deg);
}

.success-checkmark .icon-line {
  height: 5px;
  background-color: #4ade80;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.success-checkmark .icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.success-checkmark .icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.success-checkmark .icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(74, 222, 128, 0.2);
}

.success-checkmark .icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: #1f2937;
}

@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 60px #4ade80;
  }
}

@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
</style>
