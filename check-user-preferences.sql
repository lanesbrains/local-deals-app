-- Safe SQL queries to check user preferences (READ-ONLY)
-- Run these in Supabase SQL Editor to diagnose the issue
-- These are SELECT queries only - they won't change anything

-- 1. Check if we have users
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as users_last_7_days
FROM users;

-- 2. Check if we have categories
SELECT id, name, slug FROM categories ORDER BY id;

-- 3. Check if we have subcategories
SELECT sc.id, sc.name, sc.slug, c.name as category_name 
FROM subcategories sc
JOIN categories c ON sc.category_id = c.id
ORDER BY c.name, sc.name;

-- 4. Check user category preferences
SELECT 
  u.email,
  c.name as category_name,
  uc.category_id,
  u.created_at as user_created
FROM user_categories uc
JOIN users u ON uc.user_id = u.user_id
JOIN categories c ON uc.category_id = c.id
ORDER BY u.created_at DESC;

-- 5. Check user subcategory preferences
SELECT 
  u.email,
  sc.name as subcategory_name,
  c.name as category_name,
  usc.subcategory_id,
  u.created_at as user_created
FROM user_subcategories usc
JOIN users u ON usc.user_id = u.user_id
JOIN subcategories sc ON usc.subcategory_id = sc.id
JOIN categories c ON sc.category_id = c.id
ORDER BY u.created_at DESC;

-- 6. Check subscriptions
SELECT 
  u.email,
  s.plan_type,
  s.status,
  s.stripe_subscription_id,
  s.created_at as subscription_created
FROM subscriptions s
JOIN users u ON s.user_id = u.user_id
ORDER BY s.created_at DESC;

-- 7. Check users without category preferences (potential issue)
SELECT 
  u.user_id,
  u.email,
  u.created_at,
  CASE 
    WHEN uc.user_id IS NULL AND usc.user_id IS NULL THEN 'No preferences'
    WHEN uc.user_id IS NOT NULL AND usc.user_id IS NULL THEN 'Categories only'
    WHEN uc.user_id IS NULL AND usc.user_id IS NOT NULL THEN 'Subcategories only'
    ELSE 'Has preferences'
  END as preference_status
FROM users u
LEFT JOIN user_categories uc ON u.user_id = uc.user_id
LEFT JOIN user_subcategories usc ON u.user_id = usc.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
ORDER BY u.created_at DESC;

-- 8. Summary statistics
SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Users with Category Preferences' as metric,
  COUNT(DISTINCT user_id) as count
FROM user_categories
UNION ALL
SELECT 
  'Users with Subcategory Preferences' as metric,
  COUNT(DISTINCT user_id) as count
FROM user_subcategories
UNION ALL
SELECT 
  'Active Newsletter Subscriptions' as metric,
  COUNT(*) as count
FROM subscriptions 
WHERE status = 'active' AND plan_type = 'newsletter';