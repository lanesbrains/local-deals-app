# 🍴 Niche Cloning Guide: From PNW Deals to Restaurant Deals

## Overview

This guide shows you the easiest way to clone your PNW Deals app for specific niches like restaurants, outdoor gear, or any other vertical.

## 🚀 Quick Clone Strategy

### Option 1: Single App, Multiple Niches (Recommended)

Keep one codebase but create niche-specific landing pages and categories.

**Pros:**

- One codebase to maintain
- Shared user base (cross-selling opportunities)
- Lower hosting costs
- Easier to scale

**Implementation:**

1. Create niche-specific landing pages (`/restaurants`, `/outdoor-gear`)
2. Filter categories by niche
3. Use different branding/colors per niche
4. Separate newsletter segments

### Option 2: Completely Separate Apps

Clone the entire codebase for each niche.

**Pros:**

- Complete customization per niche
- Separate branding and domains
- Independent scaling
- Focused user experience

**Implementation:**

1. Clone repository
2. Update branding and content
3. Separate databases and domains
4. Independent deployment

## 🎯 Recommended Approach: Option 1 (Multi-Niche)

### Step 1: Add Niche Categories

Update your database with niche-specific categories:

```sql
-- Add niche field to categories
ALTER TABLE categories ADD COLUMN niche TEXT DEFAULT 'general';

-- Update existing categories
UPDATE categories SET niche = 'food' WHERE slug IN ('food-dining');
UPDATE categories SET niche = 'outdoor' WHERE slug IN ('outdoor-recreation');
UPDATE categories SET niche = 'shopping' WHERE slug IN ('shopping');

-- Add restaurant-specific categories
INSERT INTO categories (name, slug, niche) VALUES
('Fine Dining', 'fine-dining', 'restaurants'),
('Fast Casual', 'fast-casual', 'restaurants'),
('Coffee & Cafes', 'coffee-cafes', 'restaurants'),
('Bars & Breweries', 'bars-breweries', 'restaurants'),
('Food Trucks', 'food-trucks', 'restaurants');
```

### Step 2: Create Niche Landing Pages

```vue
<!-- pages/restaurants.vue -->
<template>
  <div>
    <!-- Restaurant-specific hero -->
    <section
      class="hero-section bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700"
    >
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1
          class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight"
        >
          🍴 PNW Restaurant Deals
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed"
        >
          Discover the best restaurant deals across the Pacific Northwest
        </p>
      </div>
    </section>

    <!-- Restaurant-specific signup -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg" id="signup">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-orange-400 mb-6 text-center">
          Get Restaurant Deals
        </h2>
        <RestaurantSignupForm />
      </div>
    </section>

    <!-- Restaurant directory -->
    <RestaurantDirectory :niche="'restaurants'" />
  </div>
</template>
```

### Step 3: Create Niche Components

```vue
<!-- components/RestaurantSignupForm.vue -->
<template>
  <form
    @submit.prevent="handleSignup"
    class="bg-white/10 backdrop-blur-md p-8 rounded-2xl"
  >
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <label class="block text-gray-300 font-semibold mb-3">Your Email</label>
        <input v-model="email" type="email" class="form-input" required />
        <div class="mt-6">
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Get Restaurant Deals - $1/month
          </button>
        </div>
      </div>

      <div class="lg:col-span-2">
        <label class="block text-gray-300 font-semibold mb-3"
          >Restaurant Types</label
        >
        <CategoryFilter v-model="selectedCategories" :niche="'restaurants'" />
      </div>
    </div>
  </form>
</template>
```

### Step 4: Update Category Filter for Niches

```vue
<!-- components/CategoryFilter.vue - Add niche prop -->
<script setup>
const props = defineProps({
  modelValue: Array,
  niche: {
    type: String,
    default: "general",
  },
});

// Filter categories by niche
const filteredCategories = computed(() => {
  return categories.value.filter(
    (cat) => cat.niche === props.niche || cat.niche === "general"
  );
});
</script>
```

### Step 5: Niche-Specific Branding

```css
/* assets/css/niches.css */
.niche-restaurants {
  --primary-color: #dc2626; /* Red */
  --secondary-color: #ea580c; /* Orange */
  --accent-color: #f59e0b; /* Amber */
}

.niche-outdoor {
  --primary-color: #059669; /* Emerald */
  --secondary-color: #0d9488; /* Teal */
  --accent-color: #10b981; /* Green */
}

.niche-shopping {
  --primary-color: #7c3aed; /* Purple */
  --secondary-color: #8b5cf6; /* Violet */
  --accent-color: #a855f7; /* Purple */
}
```

## 🔧 Complete Separate App Clone (Option 2)

If you prefer completely separate apps, here's the step-by-step:

### Step 1: Clone Repository

```bash
# Clone your existing app
git clone https://github.com/yourusername/pnw-deals.git restaurant-deals
cd restaurant-deals

# Update remote origin
git remote set-url origin https://github.com/yourusername/restaurant-deals.git
```

### Step 2: Update Branding Files

Create a configuration file for easy customization:

```javascript
// config/branding.js
export const brandingConfig = {
  appName: "PNW Restaurant Deals",
  tagline: "Discover the best restaurant deals in the Pacific Northwest",
  colors: {
    primary: "#dc2626",
    secondary: "#ea580c",
    accent: "#f59e0b",
  },
  categories: [
    "Fine Dining",
    "Fast Casual",
    "Coffee & Cafes",
    "Bars & Breweries",
    "Food Trucks",
  ],
  hero: {
    title: "🍴 PNW Restaurant Deals",
    subtitle:
      "Find amazing deals at the best restaurants across Washington, Oregon, Idaho, and Montana",
    cta: "Get Restaurant Deals - $1/month",
  },
};
```

### Step 3: Automated Rebranding Script

```javascript
// scripts/rebrand.js
import fs from "fs";
import path from "path";
import { brandingConfig } from "../config/branding.js";

const filesToUpdate = [
  "pages/index.vue",
  "components/HeroSection.vue",
  "components/AppHeader.vue",
  "package.json",
  "nuxt.config.ts",
];

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");

  Object.entries(replacements).forEach(([search, replace]) => {
    content = content.replace(new RegExp(search, "g"), replace);
  });

  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated ${filePath}`);
}

// Define replacements
const replacements = {
  "PNW Deals": brandingConfig.appName,
  "Pacific Northwest Deals": brandingConfig.tagline,
  "#F28C38": brandingConfig.colors.primary,
  "#E8B923": brandingConfig.colors.secondary,
  "Join Our Newsletter": `Get ${brandingConfig.appName.split(" ")[1]} Deals`,
};

// Update all files
filesToUpdate.forEach((file) => {
  if (fs.existsSync(file)) {
    updateFile(file, replacements);
  }
});

console.log("🎉 Rebranding complete!");
```

### Step 4: Update Database Schema

```sql
-- Create restaurant-specific database
-- Update categories for restaurant focus
DELETE FROM categories WHERE niche != 'restaurants';

INSERT INTO categories (name, slug, niche) VALUES
('Fine Dining', 'fine-dining', 'restaurants'),
('Fast Casual', 'fast-casual', 'restaurants'),
('Coffee & Cafes', 'coffee-cafes', 'restaurants'),
('Bars & Breweries', 'bars-breweries', 'restaurants'),
('Food Trucks', 'food-trucks', 'restaurants'),
('Pizza', 'pizza', 'restaurants'),
('Asian Cuisine', 'asian-cuisine', 'restaurants'),
('Mexican Food', 'mexican-food', 'restaurants');
```

### Step 5: Update Environment Variables

```env
# Restaurant Deals Environment
SUPABASE_URL=https://your-restaurant-project.supabase.co
SUPABASE_ANON_KEY=your_restaurant_anon_key
APP_URL=https://restaurant-deals.com
RESEND_API_KEY=re_your_restaurant_api_key
```

## 🎯 Niche-Specific Optimizations

### Restaurant Deals Specific:

- **Categories**: Fine dining, fast casual, coffee, bars, food trucks
- **Deal Types**: Happy hour, lunch specials, weekend brunch, delivery discounts
- **Timing**: Send newsletters on Fridays (weekend planning)
- **Partnerships**: Local food bloggers, restaurant associations

### Outdoor Gear Specific:

- **Categories**: Hiking, camping, skiing, climbing, water sports
- **Deal Types**: Seasonal gear, rental discounts, guided tour deals
- **Timing**: Send newsletters on Wednesdays (weekend trip planning)
- **Partnerships**: Outdoor influencers, gear review sites

### Shopping Deals Specific:

- **Categories**: Fashion, electronics, home goods, books
- **Deal Types**: Flash sales, clearance events, new arrival discounts
- **Timing**: Send newsletters on Sundays (week prep)
- **Partnerships**: Local boutiques, shopping centers

## 📊 Multi-Niche Analytics

Track performance by niche:

```javascript
// Track niche-specific metrics
const nicheMetrics = {
  restaurants: {
    subscribers: 1200,
    openRate: 0.28,
    clickRate: 0.05,
    revenue: 1800,
  },
  outdoor: {
    subscribers: 800,
    openRate: 0.32,
    clickRate: 0.07,
    revenue: 1200,
  },
};
```

## 🚀 Deployment Strategy

### Single App (Multi-Niche):

- One domain: `pnwdeals.com`
- Niche pages: `pnwdeals.com/restaurants`, `pnwdeals.com/outdoor`
- One database, filtered by niche
- Shared user base with cross-selling

### Multiple Apps:

- Separate domains: `pnw-restaurant-deals.com`, `pnw-outdoor-deals.com`
- Separate databases and deployments
- Independent branding and optimization
- Higher maintenance but more focused

## 💡 Recommended Next Steps

1. **Start with Option 1** (multi-niche in single app)
2. **Test restaurant niche** with dedicated landing page
3. **Measure engagement** and conversion rates
4. **If successful**, consider separate app for restaurants
5. **Scale to other niches** based on performance

This approach lets you test market demand with minimal effort while keeping your options open for full separation later!

## 🎉 Success Metrics by Niche

### Restaurant Deals:

- Target: 500 subscribers in 3 months
- Revenue goal: $2,000/month
- Business goal: 50 restaurant partners

### Outdoor Deals:

- Target: 300 subscribers in 3 months
- Revenue goal: $1,500/month
- Business goal: 30 outdoor gear partners

The beauty of this approach is you can test multiple niches quickly and double down on what works best! 🚀
