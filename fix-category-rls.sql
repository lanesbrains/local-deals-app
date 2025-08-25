-- Fix RLS policies for user category preferences
-- Run this in your Supabase SQL Editor

-- Enable RLS on preference tables (if not already enabled)
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subcategories ENABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Users can only manage own categories" ON user_categories;
DROP POLICY IF EXISTS "Users can only manage own subcategories" ON user_subcategories;

-- Create policies to allow users to insert their own preferences during signup
CREATE POLICY "Allow users to insert their categories" ON user_categories
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow users to insert their subcategories" ON user_subcategories
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to read their own preferences
CREATE POLICY "Users can view their categories" ON user_categories
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their subcategories" ON user_subcategories
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to update/delete their preferences
CREATE POLICY "Users can update their categories" ON user_categories
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their categories" ON user_categories
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their subcategories" ON user_subcategories
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their subcategories" ON user_subcategories
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also ensure subscriptions table has proper policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage subscriptions" ON subscriptions;

CREATE POLICY "Allow subscription inserts" ON subscriptions
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their subscriptions" ON subscriptions
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their subscriptions" ON subscriptions
  FOR UPDATE 
  USING (auth.uid() = user_id);