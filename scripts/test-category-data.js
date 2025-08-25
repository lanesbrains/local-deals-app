#!/usr/bin/env node

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testCategoryData() {
  console.log("🧪 Testing Category Data Structure\n");

  try {
    // Simulate what the CategoryFilter component returns
    const mockSelectedCategories = [
      { id: "7c596e49-3239-4c68-8b81-d1de0d11fa64", subcategory_id: null }, // Coffee Shops
      {
        id: "998e0c33-8ca9-4edc-a5a7-fe71c798526a",
        subcategory_id: "7242f537-da62-4240-b9d9-586723d00a23",
      }, // Restaurants with Breakfast subcategory
    ];

    console.log("📋 Mock selected categories:", mockSelectedCategories);

    // Test the exact logic from pages/index.vue
    const categoriesToInsert = mockSelectedCategories
      .filter((c) => !c.subcategory_id)
      .map((c) => ({ user_id: "test-user-uuid", category_id: c.id }));

    const subcategoriesToInsert = mockSelectedCategories
      .filter((c) => c.subcategory_id)
      .map((c) => ({
        user_id: "test-user-uuid",
        subcategory_id: c.subcategory_id,
      }));

    console.log("\n📤 Categories to insert:", categoriesToInsert);
    console.log("📤 Subcategories to insert:", subcategoriesToInsert);

    // Create a test user first
    const testEmail = `test.category.${Date.now()}@gmail.com`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: "test-password-123",
    });

    if (authError) {
      console.error("❌ Auth error:", authError);
      return;
    }

    console.log("\n✅ Test user created:", authData.user.id);

    // Insert user record
    const { error: userError } = await supabase.from("users").insert({
      user_id: authData.user.id,
      email: testEmail,
    });

    if (userError) {
      console.error("❌ User insert error:", userError);
      return;
    }

    console.log("✅ User record inserted");

    // Test category insertion with real user ID
    const realCategoriesToInsert = mockSelectedCategories
      .filter((c) => !c.subcategory_id)
      .map((c) => ({ user_id: authData.user.id, category_id: c.id }));

    console.log(
      "\n🧪 Testing real category insertion:",
      realCategoriesToInsert
    );

    if (realCategoriesToInsert.length > 0) {
      const { error: catError } = await supabase
        .from("user_categories")
        .insert(realCategoriesToInsert);

      if (catError) {
        console.error("❌ Category insert error:", catError);
        console.log("   Error details:", JSON.stringify(catError, null, 2));
      } else {
        console.log("✅ Categories inserted successfully");
      }
    }

    // Test subcategory insertion
    const realSubcategoriesToInsert = mockSelectedCategories
      .filter((c) => c.subcategory_id)
      .map((c) => ({
        user_id: authData.user.id,
        subcategory_id: c.subcategory_id,
      }));

    console.log(
      "\n🧪 Testing real subcategory insertion:",
      realSubcategoriesToInsert
    );

    if (realSubcategoriesToInsert.length > 0) {
      const { error: subError } = await supabase
        .from("user_subcategories")
        .insert(realSubcategoriesToInsert);

      if (subError) {
        console.error("❌ Subcategory insert error:", subError);
        console.log("   Error details:", JSON.stringify(subError, null, 2));
      } else {
        console.log("✅ Subcategories inserted successfully");
      }
    }

    console.log(
      "\n🎯 RESULT: If both insertions worked, the signup flow should work!"
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testCategoryData();
