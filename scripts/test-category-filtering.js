#!/usr/bin/env node

/**
 * Test script to verify category filtering is working correctly
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testCategoryFiltering() {
  console.log("🧪 Testing Category Filtering Logic\n");

  try {
    // 1. Get sample categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, name, slug")
      .limit(3);

    if (catError) {
      console.error("❌ Error fetching categories:", catError);
      return;
    }

    console.log("📂 Available categories:");
    categories.forEach((cat) => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`);
    });
    console.log("");

    // 2. Create a test user with specific category preferences
    console.log("👤 Creating test user with category preferences...");

    const testEmail = `test-${Date.now()}@example.com`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: "test-password-123",
    });

    if (authError) {
      console.error("❌ Auth error:", authError);
      return;
    }

    // Insert user record
    const { error: userError } = await supabase.from("users").insert({
      user_id: authData.user.id,
      email: testEmail,
    });

    if (userError) {
      console.error("❌ User insert error:", userError);
      return;
    }

    // Insert category preferences (first 2 categories)
    const selectedCategories = categories.slice(0, 2);
    const categoryInserts = selectedCategories.map((cat) => ({
      user_id: authData.user.id,
      category_id: cat.id,
    }));

    const { error: catInsertError } = await supabase
      .from("user_categories")
      .insert(categoryInserts);

    if (catInsertError) {
      console.error("❌ Category insert error:", catInsertError);
      return;
    }

    console.log(
      `✅ Test user created with preferences for: ${selectedCategories.map((c) => c.name).join(", ")}`
    );
    console.log("");

    // 3. Create test businesses in different categories
    console.log("🏢 Creating test businesses...");

    const testBusinesses = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const businessName = `Test Business ${i + 1} (${category.name})`;

      const { data: businessData, error: businessError } = await supabase
        .from("businesses")
        .insert({
          name: businessName,
          slug: `test-business-${i + 1}-${Date.now()}`,
          description: `A test business in ${category.name}`,
          category_id: category.id,
          user_id: authData.user.id, // Use same user for simplicity
        })
        .select()
        .single();

      if (businessError) {
        console.error("❌ Business insert error:", businessError);
        continue;
      }

      testBusinesses.push(businessData);
      console.log(`   ✅ Created: ${businessName}`);
    }
    console.log("");

    // 4. Create test deals for each business
    console.log("🎯 Creating test deals...");

    const testDeals = [];
    for (let i = 0; i < testBusinesses.length; i++) {
      const business = testBusinesses[i];
      const dealTitle = `Test Deal ${i + 1} - ${business.name}`;

      const { data: dealData, error: dealError } = await supabase
        .from("deals")
        .insert({
          business_id: business.id,
          title: dealTitle,
          description: `A test deal from ${business.name}`,
          discount: "50% OFF",
          created_at: new Date().toISOString(), // Ensure it's recent
        })
        .select()
        .single();

      if (dealError) {
        console.error("❌ Deal insert error:", dealError);
        continue;
      }

      testDeals.push(dealData);
      console.log(`   ✅ Created: ${dealTitle}`);
    }
    console.log("");

    // 5. Test the filtering logic (simulate newsletter script)
    console.log("📧 Testing newsletter filtering logic...");

    // Get user with preferences (simulate newsletter query)
    const { data: testUser, error: userFetchError } = await supabase
      .from("users")
      .select(
        `
        user_id, 
        email,
        user_categories(category_id)
      `
      )
      .eq("user_id", authData.user.id)
      .single();

    if (userFetchError) {
      console.error("❌ User fetch error:", userFetchError);
      return;
    }

    // Get recent deals with business info (simulate newsletter query)
    const { data: recentDeals, error: dealFetchError } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, discount, created_at,
        businesses(id, name, slug, category_id, subcategory_id)
      `
      )
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      ) // Last 24 hours
      .order("created_at", { ascending: false });

    if (dealFetchError) {
      console.error("❌ Deal fetch error:", dealFetchError);
      return;
    }

    console.log(`📦 Found ${recentDeals.length} recent deals total`);

    // Apply filtering logic (same as newsletter script)
    const userCategories =
      testUser.user_categories?.map((c) => c.category_id) || [];
    console.log(
      `👤 User's category preferences: [${userCategories.join(", ")}]`
    );

    const personalizedDeals = recentDeals.filter((deal) => {
      const business = deal.businesses;
      if (!business) return false;

      const matchesCategory = userCategories.includes(business.category_id);
      return matchesCategory; // Simplified for test
    });

    console.log(
      `🎯 Filtered to ${personalizedDeals.length} personalized deals:`
    );
    personalizedDeals.forEach((deal) => {
      console.log(
        `   ✅ ${deal.title} (Category: ${deal.businesses.category_id})`
      );
    });

    // 6. Verify filtering worked correctly
    console.log("\n📊 FILTERING TEST RESULTS:");
    console.log("=".repeat(50));

    const expectedDeals = selectedCategories.length; // Should match deals from selected categories
    const actualDeals = personalizedDeals.length;

    if (actualDeals === expectedDeals) {
      console.log("✅ Category filtering is working correctly!");
      console.log(`✅ User selected ${selectedCategories.length} categories`);
      console.log(`✅ Newsletter would show ${actualDeals} deals`);
      console.log("✅ User will ONLY see deals from their selected categories");
    } else {
      console.log("❌ Category filtering may have issues");
      console.log(`❌ Expected ${expectedDeals} deals, got ${actualDeals}`);
    }

    // 7. Cleanup test data
    console.log("\n🧹 Cleaning up test data...");

    // Delete test deals
    await supabase
      .from("deals")
      .delete()
      .in(
        "id",
        testDeals.map((d) => d.id)
      );

    // Delete test businesses
    await supabase
      .from("businesses")
      .delete()
      .in(
        "id",
        testBusinesses.map((b) => b.id)
      );

    // Delete test user preferences
    await supabase
      .from("user_categories")
      .delete()
      .eq("user_id", authData.user.id);

    // Delete test user
    await supabase.from("users").delete().eq("user_id", authData.user.id);

    console.log("✅ Test data cleaned up");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testCategoryFiltering();
