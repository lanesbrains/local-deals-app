import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env file
config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const requiredTables = [
  "users",
  "businesses",
  "deals",
  "categories",
  "subcategories",
  "user_categories",
  "user_subcategories",
  "subscriptions",
  "blog_posts",
  "authors",
];

const requiredColumns = {
  users: ["user_id", "email", "created_at", "is_admin"],
  businesses: [
    "id",
    "user_id",
    "name",
    "slug",
    "description",
    "category_id",
    "subcategory_id",
    "website",
    "phone",
    "address",
    "social_media",
    "is_premium",
    "created_at",
  ],
  deals: [
    "id",
    "business_id",
    "title",
    "description",
    "discount",
    "start_date",
    "end_date",
    "created_at",
  ],
  categories: ["id", "name", "slug"],
  subcategories: ["id", "category_id", "name", "slug"],
  user_categories: ["user_id", "category_id"],
  user_subcategories: ["user_id", "subcategory_id"],
  subscriptions: ["id", "user_id", "plan_type", "status", "created_at"],
  blog_posts: [
    "id",
    "title",
    "slug",
    "excerpt",
    "content",
    "category",
    "featured_image",
    "published",
    "published_at",
    "created_at",
  ],
  authors: ["id", "name", "bio", "avatar"],
};

async function checkDatabaseSchema() {
  console.log("🔍 Checking database schema...\n");

  let allGood = true;

  for (const tableName of requiredTables) {
    try {
      // Check if table exists by trying to select from it
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (error) {
        console.log(`❌ Table '${tableName}' - ERROR: ${error.message}`);
        allGood = false;
        continue;
      }

      console.log(`✅ Table '${tableName}' - EXISTS`);

      // Check required columns if we have them defined
      if (requiredColumns[tableName]) {
        const requiredCols = requiredColumns[tableName];

        // Try to select specific columns to check if they exist
        try {
          const { error: colError } = await supabase
            .from(tableName)
            .select(requiredCols.join(","))
            .limit(1);

          if (colError) {
            console.log(`   ⚠️  Column check failed: ${colError.message}`);
          } else {
            console.log(`   ✅ All required columns present`);
          }
        } catch (e) {
          console.log(`   ⚠️  Could not verify columns: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`❌ Table '${tableName}' - ERROR: ${e.message}`);
      allGood = false;
    }
  }

  console.log("\n" + "=".repeat(50));

  if (allGood) {
    console.log("🎉 Database schema check PASSED!");
    console.log("All required tables are accessible.");
  } else {
    console.log("⚠️  Database schema check FAILED!");
    console.log("Some required tables are missing or inaccessible.");
    console.log("Please check your Supabase setup and table permissions.");
  }

  console.log("\n📋 Next steps:");
  console.log(
    "1. Ensure all tables have proper RLS (Row Level Security) policies"
  );
  console.log("2. Verify foreign key relationships are set up correctly");
  console.log("3. Check that indexes are created for performance");
  console.log("4. Test user permissions and access controls");

  return allGood;
}

// Run the check
checkDatabaseSchema().catch(console.error);
