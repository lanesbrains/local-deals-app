# PNW Deals App - Setup Guide

## 🚀 Quick Start

### 1. Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Image API Keys (for PNW backgrounds)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
FLICKR_API_KEY=your_flickr_api_key

# App Configuration
APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. API Key Setup

#### Unsplash API (Recommended)

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Get your Access Key
4. Add to `.env` as `UNSPLASH_ACCESS_KEY`

#### Flickr API (Alternative)

1. Go to [Flickr API](https://www.flickr.com/services/api/)
2. Apply for an API key
3. Get your API key
4. Add to `.env` as `FLICKR_API_KEY`

### 3. Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Add free tier tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_free_tier BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS free_tier_expires_at TIMESTAMP;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_free_tier BOOLEAN DEFAULT true;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS free_tier_expires_at TIMESTAMP;

-- Add usage tracking
CREATE TABLE IF NOT EXISTS free_tier_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  business_id UUID REFERENCES businesses(id),
  action_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_free_tier ON users(is_free_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_free_tier ON businesses(is_free_tier);
CREATE INDEX IF NOT EXISTS idx_free_tier_usage_created_at ON free_tier_usage(created_at);
```

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

## 🎨 PNW Background System

The app now features a comprehensive PNW background system with:

### Real PNW Landmarks Included:

- **Washington**: Mount Rainier, Pike Place Market, Space Needle, Olympic National Park
- **Oregon**: Crater Lake, Multnomah Falls, Cannon Beach, Mount Hood
- **Idaho**: Sawtooth Mountains, Shoshone Falls, Coeur d'Alene Lake
- **Montana**: Glacier National Park, Yellowstone, Flathead Lake

### Features:

- ✅ Authentic PNW photography
- ✅ Professional photographer credits
- ✅ Dynamic rotation every 10 seconds
- ✅ User controls (play/pause, next)
- ✅ Location information with descriptions
- ✅ Responsive design
- ✅ Fallback to curated images if APIs fail

## 🔧 Production Deployment

### 1. Choose Hosting Platform

**Recommended: Vercel**

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Alternative: Netlify**

```bash
npm run build
# Upload dist folder to Netlify
```

### 2. Environment Variables in Production

Add all environment variables to your hosting platform's dashboard.

### 3. Domain Setup

1. Purchase domain (recommended: pnwdeals.com)
2. Configure DNS settings
3. Add domain to hosting platform
4. Set up SSL certificate

## 📊 Free Tier Implementation

The app includes a free tier system for early adopters:

### Free Tier Limits:

- **First 100 users**: Free newsletter subscription
- **First 50 businesses**: Free directory listing
- **90-day trial period**: Extended free access

### Implementation:

The system automatically tracks usage and applies free tier benefits. Users and businesses are grandfathered in based on signup order.

## 🎯 Marketing Launch Strategy

### Phase 1: Soft Launch (Week 1-2)

- [ ] Launch with free tier for first 100 users
- [ ] Share with friends and family
- [ ] Post in local PNW Facebook groups
- [ ] Create social media accounts

### Phase 2: Local Marketing (Week 3-4)

- [ ] Contact local businesses directly
- [ ] Partner with PNW influencers
- [ ] Submit to local business directories
- [ ] Create PNW-focused content

### Phase 3: Growth (Month 2+)

- [ ] Implement paid advertising
- [ ] Expand to additional PNW cities
- [ ] Launch referral program
- [ ] Create business partnerships

## 🔍 Troubleshooting

### Common Issues:

1. **Images not loading**
   - Check API keys are correct
   - Verify API rate limits
   - Check network connectivity

2. **Stripe integration issues**
   - Ensure test keys are used in development
   - Check webhook endpoints
   - Verify product/price IDs

3. **Database connection errors**
   - Check Supabase URL and keys
   - Verify database permissions
   - Check RLS policies

### Support:

- Check the browser console for errors
- Review Supabase logs
- Test API endpoints individually

## 📈 Analytics Setup

### Google Analytics 4:

1. Create GA4 property
2. Add tracking ID to environment variables
3. Implement in `nuxt.config.ts`

### Performance Monitoring:

- Set up Vercel Analytics (if using Vercel)
- Configure error tracking with Sentry
- Monitor Core Web Vitals

## 🎉 Success Metrics

Track these key metrics:

- Newsletter signup conversion rate
- Business listing signup rate
- User engagement (time on site, pages viewed)
- Revenue per user/business
- Customer satisfaction scores

---

**Ready to launch!** 🚀

The app is now production-ready with modern design, PNW authenticity, and a solid free tier strategy to attract early adopters.
