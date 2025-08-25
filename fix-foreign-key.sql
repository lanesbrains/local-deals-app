-- Fix foreign key relationship for subscriptions table
-- Run this in Supabase SQL Editor

-- First, let's check if the foreign key constraint actually exists
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='subscriptions';

-- Drop and recreate the foreign key constraint to refresh the schema cache
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

-- Recreate the foreign key constraint
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Refresh the schema cache by running a simple query
SELECT 
    s.id,
    s.user_id,
    u.email
FROM subscriptions s
LEFT JOIN users u ON s.user_id = u.user_id
LIMIT 1;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Foreign key constraint recreated successfully!';
  RAISE NOTICE 'Schema cache should now recognize the relationship';
END $$;