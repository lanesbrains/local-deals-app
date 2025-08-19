-- PNW Deals Database Setup - Run this in Supabase SQL Editor
-- This fixes the RLS error you're experiencing

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can only see own data" ON users;
DROP POLICY IF EXISTS "Authenticated users only" ON users;

-- Create policy to allow public user registration (fixes your signup error)
CREATE POLICY "Allow public user registration" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure other tables have proper policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subcategories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to businesses
CREATE POLICY "Public can view businesses" ON businesses
  FOR SELECT USING (true);

-- Allow business owners to manage their businesses
CREATE POLICY "Business owners can manage businesses" ON businesses
  FOR ALL USING (auth.uid() = user_id);

-- Allow users to manage their preferences
CREATE POLICY "Users can manage categories" ON user_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage subcategories" ON user_subcategories
  FOR ALL USING (auth.uid() = user_id);

-- Make categories and subcategories publicly readable
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;