#!/usr/bin/env node

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkCategories() {
  console.log("📋 Checking Categories and Database Structure\n");

  try {
    // Check categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .limit(10);

    if (catError) {
      console.error("❌ Categories error:", catError);
    } else {
      console.log("✅ Categories found:");
      categories?.forEach((cat) => {
        console.log(`   ID: ${cat.id} (${typeof cat.id}) - Name: ${cat.name}`);
      });
    }

    // Check subcategories
    const { data: subcategories, error: subError } = await supabase
      .from("subcategories")
      .select("*")
      .limit(10);

    if (subError) {
      console.error("❌ Subcategories error:", subError);
    } else {
      console.log("\n✅ Subcategories found:");
      subcategories?.forEach((sub) => {
        console.log(
          `   ID: ${sub.id} (${typeof sub.id}) - Name: ${sub.name} - Category: ${sub.category_id}`
        );
      });
    }

    // Check users table structure
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (userError) {
      console.error("❌ Users error:", userError);
    } else {
      console.log("\n✅ Users table accessible");
      if (users?.length > 0) {
        console.log(
          `   Sample user_id: ${users[0].user_id} (${typeof users[0].user_id})`
        );
      }
    }
  } catch (error) {
    console.error("❌ Check failed:", error);
  }
}

checkCategories();
