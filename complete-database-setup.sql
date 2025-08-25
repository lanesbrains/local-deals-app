-- Complete Database Setup for PNW Deals
-- This script will create all missing tables and relationships safely
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE,
  is_free_tier BOOLEAN DEFAULT TRUE,
  free_tier_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days')
);

-- 2. Create categories table with slug column
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'slug') THEN
    ALTER TABLE categories ADD COLUMN slug TEXT;
    -- Generate slugs for existing categories
    UPDATE categories SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
    -- Make slug unique
    ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- 3. Create subcategories table with slug column
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add slug column to subcategories if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subcategories' AND column_name = 'slug') THEN
    ALTER TABLE subcategories ADD COLUMN slug TEXT;
    -- Generate slugs for existing subcategories
    UPDATE subcategories SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
    -- Make slug unique
    ALTER TABLE subcategories ADD CONSTRAINT subcategories_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- 4. Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
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
  social_media JSONB DEFAULT '{}',
  is_premium BOOLEAN DEFAULT FALSE,
  is_free_tier BOOLEAN DEFAULT TRUE,
  free_tier_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create user preferences tables
CREATE TABLE IF NOT EXISTS user_categories (
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, category_id)
);

CREATE TABLE IF NOT EXISTS user_subcategories (
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, subcategory_id)
);

-- 7. Create subscriptions table with proper foreign key
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'newsletter',
  status TEXT NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix foreign key relationship if it's missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscriptions_user_id_fkey' 
    AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE subscriptions 
    ADD CONSTRAINT subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
  END IF;
END $$;

-- 8. Create free tier usage tracking
CREATE TABLE IF NOT EXISTS free_tier_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create blog tables
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
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

-- 10. Insert sample categories if none exist
INSERT INTO categories (name, slug) VALUES
('Food & Dining', 'food-dining'),
('Shopping', 'shopping'),
('Entertainment', 'entertainment'),
('Health & Wellness', 'health-wellness'),
('Outdoor & Recreation', 'outdoor-recreation'),
('Services', 'services'),
('Travel & Lodging', 'travel-lodging'),
('Arts & Culture', 'arts-culture')
ON CONFLICT (slug) DO NOTHING;

-- 11. Insert sample subcategories if none exist
INSERT INTO subcategories (category_id, name, slug) VALUES
-- Food & Dining subcategories
((SELECT id FROM categories WHERE slug = 'food-dining'), 'Coffee Shops', 'coffee-shops'),
((SELECT id FROM categories WHERE slug = 'food-dining'), 'Restaurants', 'restaurants'),
((SELECT id FROM categories WHERE slug = 'food-dining'), 'Breweries', 'breweries'),
((SELECT id FROM categories WHERE slug = 'food-dining'), 'Food Trucks', 'food-trucks'),
((SELECT id FROM categories WHERE slug = 'food-dining'), 'Bakeries', 'bakeries'),

-- Shopping subcategories
((SELECT id FROM categories WHERE slug = 'shopping'), 'Clothing', 'clothing'),
((SELECT id FROM categories WHERE slug = 'shopping'), 'Outdoor Gear', 'outdoor-gear'),
((SELECT id FROM categories WHERE slug = 'shopping'), 'Books', 'books'),
((SELECT id FROM categories WHERE slug = 'shopping'), 'Home & Garden', 'home-garden'),
((SELECT id FROM categories WHERE slug = 'shopping'), 'Electronics', 'electronics'),

-- Entertainment subcategories
((SELECT id FROM categories WHERE slug = 'entertainment'), 'Movies', 'movies'),
((SELECT id FROM categories WHERE slug = 'entertainment'), 'Concerts', 'concerts'),
((SELECT id FROM categories WHERE slug = 'entertainment'), 'Sports', 'sports'),
((SELECT id FROM categories WHERE slug = 'entertainment'), 'Gaming', 'gaming'),
((SELECT id FROM categories WHERE slug = 'entertainment'), 'Nightlife', 'nightlife'),

-- Health & Wellness subcategories
((SELECT id FROM categories WHERE slug = 'health-wellness'), 'Fitness', 'fitness'),
((SELECT id FROM categories WHERE slug = 'health-wellness'), 'Spa & Beauty', 'spa-beauty'),
((SELECT id FROM categories WHERE slug = 'health-wellness'), 'Medical', 'medical'),
((SELECT id FROM categories WHERE slug = 'health-wellness'), 'Mental Health', 'mental-health'),

-- Outdoor & Recreation subcategories
((SELECT id FROM categories WHERE slug = 'outdoor-recreation'), 'Hiking', 'hiking'),
((SELECT id FROM categories WHERE slug = 'outdoor-recreation'), 'Skiing', 'skiing'),
((SELECT id FROM categories WHERE slug = 'outdoor-recreation'), 'Water Sports', 'water-sports'),
((SELECT id FROM categories WHERE slug = 'outdoor-recreation'), 'Camping', 'camping'),
((SELECT id FROM categories WHERE slug = 'outdoor-recreation'), 'Biking', 'biking'),

-- Services subcategories
((SELECT id FROM categories WHERE slug = 'services'), 'Auto', 'auto'),
((SELECT id FROM categories WHERE slug = 'services'), 'Home Services', 'home-services'),
((SELECT id FROM categories WHERE slug = 'services'), 'Professional', 'professional'),
((SELECT id FROM categories WHERE slug = 'services'), 'Pet Services', 'pet-services'),

-- Travel & Lodging subcategories
((SELECT id FROM categories WHERE slug = 'travel-lodging'), 'Hotels', 'hotels'),
((SELECT id FROM categories WHERE slug = 'travel-lodging'), 'Vacation Rentals', 'vacation-rentals'),
((SELECT id FROM categories WHERE slug = 'travel-lodging'), 'Tours', 'tours'),
((SELECT id FROM categories WHERE slug = 'travel-lodging'), 'Transportation', 'transportation'),

-- Arts & Culture subcategories
((SELECT id FROM categories WHERE slug = 'arts-culture'), 'Museums', 'museums'),
((SELECT id FROM categories WHERE slug = 'arts-culture'), 'Galleries', 'galleries'),
((SELECT id FROM categories WHERE slug = 'arts-culture'), 'Theater', 'theater'),
((SELECT id FROM categories WHERE slug = 'arts-culture'), 'Music', 'music')
ON CONFLICT (slug) DO NOTHING;

-- 12. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_tier_usage ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS Policies (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = user_id);

-- Business policies
DROP POLICY IF EXISTS "Anyone can view published businesses" ON businesses;
DROP POLICY IF EXISTS "Business owners can insert their businesses" ON businesses;
DROP POLICY IF EXISTS "Business owners can update their businesses" ON businesses;

CREATE POLICY "Anyone can view published businesses" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "Business owners can insert their businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can update their businesses" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

-- Deal policies
DROP POLICY IF EXISTS "Anyone can view deals" ON deals;
DROP POLICY IF EXISTS "Business owners can manage their deals" ON deals;

CREATE POLICY "Anyone can view deals" ON deals
  FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their deals" ON deals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = deals.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- User preference policies
DROP POLICY IF EXISTS "Allow users to insert their categories" ON user_categories;
DROP POLICY IF EXISTS "Users can view their categories" ON user_categories;
DROP POLICY IF EXISTS "Users can update their categories" ON user_categories;
DROP POLICY IF EXISTS "Users can delete their categories" ON user_categories;

CREATE POLICY "Allow users to insert their categories" ON user_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their categories" ON user_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their categories" ON user_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their categories" ON user_categories
  FOR DELETE USING (auth.uid() = user_id);

-- Subcategory policies
DROP POLICY IF EXISTS "Allow users to insert their subcategories" ON user_subcategories;
DROP POLICY IF EXISTS "Users can view their subcategories" ON user_subcategories;
DROP POLICY IF EXISTS "Users can update their subcategories" ON user_subcategories;
DROP POLICY IF EXISTS "Users can delete their subcategories" ON user_subcategories;

CREATE POLICY "Allow users to insert their subcategories" ON user_subcategories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their subcategories" ON user_subcategories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their subcategories" ON user_subcategories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their subcategories" ON user_subcategories
  FOR DELETE USING (auth.uid() = user_id);

-- Subscription policies
DROP POLICY IF EXISTS "Allow subscription inserts" ON subscriptions;
DROP POLICY IF EXISTS "Users can view their subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their subscriptions" ON subscriptions;

CREATE POLICY "Allow subscription inserts" ON subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Free tier usage policies
DROP POLICY IF EXISTS "Users can view their usage" ON free_tier_usage;
DROP POLICY IF EXISTS "System can insert usage records" ON free_tier_usage;

CREATE POLICY "Users can view their usage" ON free_tier_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage records" ON free_tier_usage
  FOR INSERT WITH CHECK (true);

-- 14. Disable RLS for public tables
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- 15. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_subcategory_id ON businesses(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_business_id ON deals(business_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_user_categories_user_id ON user_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subcategories_user_id ON user_subcategories(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, categories, subcategories, businesses, deals, user_categories, user_subcategories, subscriptions, free_tier_usage, authors, blog_posts';
  RAISE NOTICE 'Sample categories and subcategories inserted';
  RAISE NOTICE 'RLS policies configured';
  RAISE NOTICE 'Indexes created for performance';
END $$;