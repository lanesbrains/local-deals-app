#!/usr/bin/env node

/**
 * Simple script to verify database setup is complete
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function verifyDatabase() {
  console.log("🔍 Verifying Database Setup...\n");

  const checks = [
    {
      name: "Users table",
      query: () =>
        supabase.from("users").select("count", { count: "exact", head: true }),
    },
    {
      name: "Categories table with slug",
      query: () =>
        supabase.from("categories").select("id, name, slug").limit(1),
    },
    {
      name: "Subcategories table with slug",
      query: () =>
        supabase.from("subcategories").select("id, name, slug").limit(1),
    },
    {
      name: "Businesses table",
      query: () =>
        supabase
          .from("businesses")
          .select("count", { count: "exact", head: true }),
    },
    {
      name: "Deals table",
      query: () =>
        supabase.from("deals").select("count", { count: "exact", head: true }),
    },
    {
      name: "User categories table",
      query: () =>
        supabase
          .from("user_categories")
          .select("count", { count: "exact", head: true }),
    },
    {
      name: "User subcategories table",
      query: () =>
        supabase
          .from("user_subcategories")
          .select("count", { count: "exact", head: true }),
    },
    {
      name: "Subscriptions table",
      query: () =>
        supabase
          .from("subscriptions")
          .select("count", { count: "exact", head: true }),
    },
    {
      name: "Subscriptions-Users relationship",
      query: () =>
        supabase
          .from("subscriptions")
          .select(
            `
        id,
        user_id,
        users(email)
      `
          )
          .limit(1),
    },
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      const { data, error, count } = await check.query();

      if (error) {
        console.log(`❌ ${check.name}: ${error.message}`);
        allPassed = false;
      } else {
        if (check.name.includes("count")) {
          console.log(`✅ ${check.name}: ${count || 0} records`);
        } else if (data && data.length > 0) {
          console.log(`✅ ${check.name}: Structure OK`);
        } else {
          console.log(`✅ ${check.name}: Table exists (empty)`);
        }
      }
    } catch (err) {
      console.log(`❌ ${check.name}: ${err.message}`);
      allPassed = false;
    }
  }

  console.log("\n" + "=".repeat(50));

  if (allPassed) {
    console.log("🎉 Database setup is complete!");
    console.log("✅ All tables exist with proper structure");
    console.log("✅ Foreign key relationships are working");
    console.log("✅ Ready to test signup flow");
  } else {
    console.log("❌ Database setup incomplete");
    console.log("→ Run complete-database-setup.sql in Supabase");
  }

  // Show sample categories
  try {
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, slug")
      .limit(5);

    if (categories && categories.length > 0) {
      console.log("\n📂 Sample categories:");
      categories.forEach((cat) => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });
    }
  } catch (err) {
    // Ignore errors here
  }
}

verifyDatabase();
