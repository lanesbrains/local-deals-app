<template>
  <section class="relative text-white py-20 md:py-32 overflow-hidden">
    <!-- Enhanced background wave animation -->
    <div class="absolute inset-0 opacity-10">
      <svg
        class="w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#F28C38"
          fill-opacity="0.3"
          d="M0,128L48,138.7C96,149,192,171,288,186.7C384,203,480,213,576,197.3C672,181,768,139,864,128C960,117,1056,139,1152,160C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>

    <div class="container mx-auto px-4 text-center relative z-10">
      <!-- Enhanced Headline and Subheadline -->
      <div class="max-w-4xl mx-auto mb-12">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          Discover Local Deals in the
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pnw-orange to-pnw-yellow">
            Pacific Northwest
          </span>
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
          Uncover the best local businesses, exclusive offers, and hidden gems in
          the PNW with our weekly curated deals.
        </p>
      </div>

      <!-- Enhanced Benefits Section -->
      <div class="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
        <div class="benefit-card">
          <div class="benefit-icon">🎯</div>
          <h3 class="benefit-title">Curated for You</h3>
          <p class="benefit-description">
            Personalized deals based on your interests and location
          </p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">💰</div>
          <h3 class="benefit-title">Save Money</h3>
          <p class="benefit-description">
            Exclusive discounts and offers from local businesses
          </p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">🏔️</div>
          <h3 class="benefit-title">Support Local</h3>
          <p class="benefit-description">
            Connect with authentic PNW businesses and communities
          </p>
        </div>
      </div>

      <!-- Enhanced CTA Section -->
      <div class="cta-section">
        <div class="cta-card">
          <div class="cta-content">
            <h2 class="cta-title">Join Our Newsletter</h2>
            <p class="cta-subtitle">
              Get weekly deals delivered to your inbox for just $1/month
            </p>
            <div class="cta-features">
              <div class="cta-feature">
                <span class="feature-icon">✓</span>
                <span>Weekly curated deals</span>
              </div>
              <div class="cta-feature">
                <span class="feature-icon">✓</span>
                <span>Local business spotlights</span>
              </div>
              <div class="cta-feature">
                <span class="feature-icon">✓</span>
                <span>Exclusive member discounts</span>
              </div>
            </div>
            <div class="cta-actions">
              <a href="#signup" class="cta-button-primary">
                Start Your Journey
                <span class="button-arrow">→</span>
              </a>
              <a href="/directory" class="cta-button-secondary">
                Browse Directory
              </a>
            </div>
          </div>
          <div class="cta-visual">
            <div class="visual-element">
              <div class="floating-card">
                <div class="card-content">
                  <div class="card-icon">🏪</div>
                  <div class="card-text">
                    <div class="card-title">Local Coffee Shop</div>
                    <div class="card-discount">50% off lattes</div>
                  </div>
                </div>
              </div>
              <div class="floating-card">
                <div class="card-content">
                  <div class="card-icon">🍕</div>
                  <div class="card-text">
                    <div class="card-title">Artisan Pizza</div>
                    <div class="card-discount">Free delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="trust-section mt-16">
        <p class="trust-text">Trusted by local businesses across the PNW</p>
        <div class="trust-stats">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">Local Businesses</div>
          </div>
          <div class="stat">
            <div class="stat-number">10k+</div>
            <div class="stat-label">Happy Members</div>
          </div>
          <div class="stat">
            <div class="stat-number">$50k+</div>
            <div class="stat-label">Saved by Members</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional script needed for this component
</script>

<style scoped>
/* Enhanced animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

/* Benefit Cards */
.benefit-card {
  @apply backdrop-blur-md rounded-2xl p-8 border transition-all duration-300 hover:transform hover:scale-105;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(242, 140, 56, 0.3);
}

.benefit-icon {
  @apply text-4xl mb-4;
  animation: float 3s ease-in-out infinite;
}

.benefit-title {
  @apply text-xl font-bold mb-3 text-pnw-orange;
}

.benefit-description {
  @apply text-gray-300 leading-relaxed;
}

/* CTA Section */
.cta-section {
  @apply max-w-6xl mx-auto;
}

.cta-card {
  @apply backdrop-blur-xl rounded-3xl p-8 md:p-12 border shadow-2xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
}

.cta-content {
  @apply text-left;
}

.cta-title {
  @apply text-3xl md:text-4xl font-bold mb-4 text-white;
}

.cta-subtitle {
  @apply text-lg text-gray-300 mb-6 leading-relaxed;
}

.cta-features {
  @apply space-y-3 mb-8;
}

.cta-feature {
  @apply flex items-center gap-3 text-gray-200;
}

.feature-icon {
  @apply text-pnw-orange font-bold text-lg;
}

.cta-actions {
  @apply flex flex-col sm:flex-row gap-4;
}

.cta-button-primary {
  @apply text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex items-center justify-center gap-2;
  background: linear-gradient(135deg, #F28C38, #E8B923);
}

.cta-button-primary:hover {
  box-shadow: 0 20px 40px rgba(242, 140, 56, 0.4);
}

.button-arrow {
  @apply transition-transform duration-300;
}

.cta-button-primary:hover .button-arrow {
  transform: translateX(4px);
}

.cta-button-secondary {
  @apply backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg border transition-all duration-300;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-button-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Visual Elements */
.cta-visual {
  @apply hidden lg:block;
}

.visual-element {
  @apply relative;
}

.floating-card {
  @apply backdrop-blur-md rounded-xl p-4 border shadow-lg;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 4s ease-in-out infinite;
  position: absolute;
}

.floating-card:nth-child(1) {
  top: -20px;
  left: -20px;
  animation-delay: 0s;
}

.floating-card:nth-child(2) {
  top: 40px;
  right: -20px;
  animation-delay: 2s;
}

.card-content {
  @apply flex items-center gap-3;
}

.card-icon {
  @apply text-2xl;
}

.card-text {
  @apply flex flex-col;
}

.card-title {
  @apply font-semibold text-white text-sm;
}

.card-discount {
  @apply text-pnw-orange text-xs font-medium;
}

/* Trust Section */
.trust-section {
  @apply text-center;
}

.trust-text {
  @apply text-gray-300 mb-8 text-lg;
}

.trust-stats {
  @apply flex justify-center gap-12 flex-wrap;
}

.stat {
  @apply text-center;
}

.stat-number {
  @apply text-3xl font-bold text-pnw-orange mb-2;
  animation: pulse 2s ease-in-out infinite;
}

.stat-label {
  @apply text-gray-300 text-sm;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cta-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .cta-content {
    @apply text-center;
  }
  
  .cta-actions {
    @apply justify-center;
  }
}

@media (max-width: 768px) {
  h1 {
    @apply text-4xl md:text-5xl;
  }
  
  .benefit-card {
    @apply p-6;
  }
  
  .cta-card {
    @apply p-6;
  }
  
  .trust-stats {
    @apply gap-8;
  }
  
  .stat-number {
    @apply text-2xl;
  }
}

@media (max-width: 480px) {
  .cta-actions {
    @apply flex-col;
  }
  
  .trust-stats {
    @apply flex-col gap-6;
  }
}
</style>
