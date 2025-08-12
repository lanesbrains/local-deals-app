# PNW Deals - Production Setup Guide

This guide will help you deploy PNW Deals to production with all features working correctly.

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone <your-repo>
   cd pnw-deals
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Database Setup**

   ```bash
   npm run setup-data
   ```

4. **Production Check**
   ```bash
   npm run production-check
   ```

## 📋 Environment Variables

Create a `.env` file with these required variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Email Service (Resend)
RESEND_API_KEY=re_your_api_key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
APP_URL=https://your-domain.com
```

## 🗄️ Database Setup

### Required Tables

The app requires these Supabase tables:

1. **users** - User accounts and preferences
2. **businesses** - Business listings
3. **deals** - Business deals and offers
4. **categories** - Business categories
5. **subcategories** - Business subcategories
6. **user_categories** - User category preferences
7. **user_subcategories** - User subcategory preferences
8. **subscriptions** - User subscription status
9. **blog_posts** - Blog content
10. **authors** - Blog authors

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategories table
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  subcategory_id INTEGER REFERENCES subcategories(id),
  website TEXT,
  phone TEXT,
  address TEXT,
  social_media JSONB,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences tables
CREATE TABLE user_categories (
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, category_id)
);

CREATE TABLE user_subcategories (
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, subcategory_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'newsletter',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog tables
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
-- ... enable for all tables

-- Example policies (customize as needed)
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published businesses" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "Business owners can update their businesses" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);
```

## 📧 Email Configuration

### Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add your domain and verify DNS records
4. Update the `from` address in email functions

### Email Templates

The app includes these email notifications:

- **Weekly Newsletter** - Weekly digest of new deals from the past 7 days, sent every Monday
- **Welcome** - New user onboarding (if implemented)

### Newsletter Schedule

The newsletter is automatically sent every Monday at 9 AM UTC via Netlify scheduled functions. It includes:

- Only deals created in the past 7 days
- Only deals from categories/subcategories the user originally selected
- Professional email template with deal details and business links

## 🔧 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link your GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.output/public`

2. **Environment Variables**
   - Add all environment variables in Netlify dashboard
   - Ensure `APP_URL` matches your domain

3. **Functions**
   - Netlify Functions are automatically deployed from `/netlify/functions/`
   - Set up scheduled functions for newsletter sending

### Domain Setup

1. **Custom Domain**
   - Add your domain in Netlify
   - Configure DNS records
   - Enable HTTPS (automatic with Netlify)

2. **Email Domain**
   - Configure your domain with Resend
   - Add DNS records for email sending

## 🧪 Testing

### Automated Tests

```bash
# Check database schema
npm run check-db

# Test deals flow
npm run test-deals

# Full production readiness check
npm run production-check
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Business signup and profile creation
- [ ] Deal creation and editing
- [ ] Email notifications
- [ ] Category preferences
- [ ] Blog functionality
- [ ] Mobile responsiveness
- [ ] Payment processing (if enabled)

## 📊 Monitoring

### Essential Monitoring

1. **Error Tracking**
   - Set up Sentry or similar
   - Monitor API endpoints
   - Track email delivery rates

2. **Performance**
   - Monitor page load times
   - Database query performance
   - Email sending limits

3. **Analytics**
   - Google Analytics or similar
   - User engagement metrics
   - Business signup conversion

## 🔒 Security

### Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database RLS policies configured
- [ ] API rate limiting
- [ ] Input validation
- [ ] XSS protection
- [ ] CSRF protection

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Monitor security advisories
- [ ] Backup database regularly
- [ ] Review and rotate API keys
- [ ] Monitor for suspicious activity

## 📈 Scaling

### Performance Optimization

1. **Database**
   - Add indexes for frequently queried columns
   - Optimize complex queries
   - Consider read replicas for high traffic

2. **Caching**
   - Enable Netlify edge caching
   - Cache static assets
   - Consider Redis for session data

3. **Email**
   - Monitor sending limits
   - Implement email queuing for high volume
   - Set up bounce handling

## 🆘 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check Resend API key
   - Verify domain configuration
   - Check rate limits

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check RLS policies
   - Monitor connection limits

3. **Build Failures**
   - Check environment variables
   - Verify all dependencies
   - Review build logs

### Support

- Check the [GitHub Issues](your-repo/issues)
- Review Supabase documentation
- Check Netlify build logs
- Monitor Resend dashboard

## 📚 Additional Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

## 🎯 Production Launch Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Database schema and sample data loaded
- [ ] Email sending tested and working
- [ ] Domain and SSL configured
- [ ] Monitoring and analytics set up
- [ ] Security measures implemented
- [ ] Performance optimized
- [ ] Backup strategy in place
- [ ] Support documentation ready

**Ready to launch? Run `npm run production-check` one final time!**
