# 🍴 Restaurant Niche Deployment Guide

## Overview

This guide shows you how to deploy your restaurant-focused landing page and create a separate restaurant deals site.

## 🎯 **Two Deployment Options**

### **Option 1: Add Restaurant Page to Existing Site (Recommended)**

- Keep your current PNW Deals site
- Add `/restaurants` as a specialized landing page
- Same database, same users, filtered content
- **Domain**: `pnwdeals.com/restaurants`

### **Option 2: Separate Restaurant Site**

- Clone entire codebase for restaurant focus
- Separate branding, database, domain
- Independent scaling and marketing
- **Domain**: `pnw-restaurant-deals.com`

## 🚀 **Option 1: Add Restaurant Page (Quick Setup)**

### **Step 1: Current Status**

✅ Restaurant landing page created (`pages/restaurants.vue`)
✅ Restaurant category filter created (`components/RestaurantCategoryFilter.vue`)
✅ Restaurant-focused design and copy

### **Step 2: Test Locally**

```bash
npm run dev
# Visit: http://localhost:3000/restaurants
```

### **Step 3: Deploy to Production**

Your restaurant page is ready! Just deploy your current site:

```bash
# If using Netlify
git add .
git commit -m "Add restaurant landing page"
git push origin main
```

**Your restaurant page will be live at**: `https://pnw-deals.netlify.app/restaurants`

### **Step 4: Marketing URLs**

- **Main site**: `pnwdeals.com`
- **Restaurant focus**: `pnwdeals.com/restaurants`
- **Business signup**: `pnwdeals.com/business-signup`
- **Restaurant directory**: `pnwdeals.com/directory` (filtered for restaurants)

## 🏢 **Option 2: Separate Restaurant Site**

### **Step 1: Clone Repository**

```bash
# Clone your current project
git clone https://github.com/yourusername/pnw-deals.git pnw-restaurant-deals
cd pnw-restaurant-deals

# Update remote origin
git remote set-url origin https://github.com/yourusername/pnw-restaurant-deals.git
```

### **Step 2: Rebrand for Restaurants**

Update these files:

#### **package.json**

```json
{
  "name": "pnw-restaurant-deals",
  "description": "Best restaurant deals in the Pacific Northwest"
}
```

#### **nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  // ... existing config
  app: {
    head: {
      title: "PNW Restaurant Deals",
      meta: [
        {
          name: "description",
          content:
            "Discover the best restaurant deals across Washington, Oregon, Idaho, and Montana",
        },
      ],
    },
  },
});
```

#### **Replace Homepage**

```bash
# Replace index.vue with restaurant-focused version
cp pages/restaurants.vue pages/index.vue
```

### **Step 3: Update Branding**

Create a restaurant-specific config:

```javascript
// config/restaurant-branding.js
export const restaurantConfig = {
  name: "PNW Restaurant Deals",
  tagline: "Best Restaurant Deals in the Pacific Northwest",
  colors: {
    primary: "#dc2626", // Red
    secondary: "#ea580c", // Orange
    accent: "#f59e0b", // Amber
  },
  categories: [
    "Coffee Shops",
    "Fine Dining",
    "Casual Dining",
    "Breweries",
    "Food Trucks",
    "Bakeries",
  ],
};
```

### **Step 4: Database Setup**

You have two options:

#### **Option A: Shared Database**

- Use same Supabase project
- Filter content by restaurant categories
- Shared user base (cross-selling opportunity)

#### **Option B: Separate Database**

- Create new Supabase project
- Restaurant-only categories and businesses
- Independent user base

### **Step 5: Domain Setup**

#### **Recommended Domains:**

- `pnw-restaurant-deals.com` (primary)
- `pnwrestaurantdeals.com` (alternative)
- `pacificnorthwestrestaurants.com` (premium)
- `eatpnw.com` (short and memorable)

#### **Domain Configuration:**

1. **Purchase domain** (Namecheap, GoDaddy, etc.)
2. **Point to Netlify**:
   - Add domain in Netlify dashboard
   - Update DNS records
   - Enable HTTPS (automatic)

## 📊 **Marketing Strategy by Option**

### **Option 1: Multi-Niche Approach**

- **Main site**: General PNW deals
- **Restaurant page**: Specialized landing for food lovers
- **Cross-selling**: Restaurant users see other deals
- **SEO**: Multiple landing pages for different keywords

**Marketing URLs:**

- Facebook ads → `pnwdeals.com/restaurants`
- Google ads → `pnwdeals.com/restaurants`
- Instagram bio → `pnwdeals.com/restaurants`

### **Option 2: Restaurant-Only Focus**

- **Entire site**: Restaurant-focused
- **Branding**: Food-specific design and copy
- **Audience**: Food lovers and restaurant owners
- **SEO**: All content optimized for restaurant keywords

**Marketing URLs:**

- Facebook ads → `pnw-restaurant-deals.com`
- Google ads → `pnw-restaurant-deals.com`
- Instagram bio → `pnw-restaurant-deals.com`

## 🎨 **Design Differences**

### **Restaurant Site Features:**

- ✅ Red/orange color scheme (food-focused)
- ✅ Restaurant-specific categories
- ✅ Food imagery and icons
- ✅ Restaurant owner CTAs
- ✅ Food-focused testimonials
- ✅ Cuisine-based filtering

### **Content Strategy:**

- **Blog topics**: "Best Seattle Coffee Shops", "Portland Food Truck Guide"
- **Social media**: Food photography, chef interviews
- **Partnerships**: Food bloggers, local chefs
- **Events**: Restaurant weeks, food festivals

## 💰 **Revenue Projections**

### **Option 1: Multi-Niche**

- **Newsletter subscribers**: 1,000 total (300 restaurant-focused)
- **Restaurant businesses**: 50 listings
- **Monthly revenue**: $1,500 ($300 newsletter + $1,200 businesses)

### **Option 2: Restaurant-Only**

- **Newsletter subscribers**: 500 (all restaurant-focused)
- **Restaurant businesses**: 100 listings
- **Monthly revenue**: $2,000 ($500 newsletter + $1,500 businesses)

## 🚀 **Recommended Approach**

### **Start with Option 1** (Multi-Niche)

**Pros:**

- Quick to deploy (already done!)
- Test market demand
- Lower maintenance
- Cross-selling opportunities

**Timeline:** Ready now!

### **Scale to Option 2** if successful

**When to switch:**

- Restaurant page gets 50%+ of traffic
- 100+ restaurant businesses signed up
- Clear demand for restaurant-only focus

## 📋 **Immediate Action Items**

### **For Option 1 (Recommended):**

1. ✅ Restaurant page is ready
2. **Deploy current site** (restaurant page included)
3. **Test restaurant signup flow**
4. **Create restaurant-focused social media content**
5. **Run Facebook ads targeting food lovers**

### **Marketing Copy for Ads:**

```
🍴 Discover the best restaurant deals in the Pacific Northwest!

Get personalized deals from:
☕ Local coffee shops
🍽️ Fine dining restaurants
🍺 Craft breweries
🌮 Food trucks & more

Just $1/month for unlimited access.
Join 1000+ PNW food lovers!

👆 Get Restaurant Deals
```

### **Social Media Strategy:**

- **Instagram**: Food photography + deal announcements
- **Facebook**: Join local foodie groups
- **TikTok**: "Hidden gem restaurants in Seattle"
- **Twitter**: Real-time deal alerts

## 🎯 **Success Metrics**

### **Month 1 Goals:**

- 50 restaurant newsletter signups
- 5 restaurant business listings
- 1,000 restaurant page visits

### **Month 3 Goals:**

- 200 restaurant newsletter signups
- 20 restaurant business listings
- $500/month revenue from restaurant focus

### **Month 6 Goals:**

- 500 restaurant newsletter signups
- 50 restaurant business listings
- $1,500/month revenue from restaurant focus

## 🔗 **Next Steps**

1. **Deploy restaurant page** (Option 1 - ready now!)
2. **Test signup flow** at `/restaurants`
3. **Create restaurant social media accounts**
4. **Run targeted ads to food lovers**
5. **Track metrics and optimize**

**Your restaurant landing page is ready to go live! 🚀**

The restaurant page will work with your existing database and user system - users who sign up via `/restaurants` will only get restaurant deals in their newsletter based on the categories they select.

**Want to go live with the restaurant page right now?** Just deploy your current code and start marketing `yoursite.com/restaurants`!
