#!/usr/bin/env node

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function debugSignupFlow() {
  console.log("🔍 Debugging Signup Flow Issues\n");

  try {
    // Test 1: Check if Supabase functions are accessible
    console.log("1️⃣ Testing Supabase function accessibility...");

    const testEmail = `debug.test.${Date.now()}@gmail.com`;

    const { data: sessionData, error: sessionError } =
      await supabase.functions.invoke("create-stripe-checkout", {
        body: {
          user_id: "debug-user-" + Date.now(),
          email: testEmail,
          plan_type: "newsletter",
          price_id: "price_1S06naFqXu3q4jXwqTbg1reO",
          success_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
        },
      });

    if (sessionError) {
      console.error("❌ Supabase function error:", sessionError);
      console.log(
        "   This means users will get an error before reaching Stripe"
      );
      return;
    }

    console.log(
      "✅ Supabase function working, session ID:",
      sessionData.session_id
    );

    // Test 2: Check database permissions for user creation
    console.log("\n2️⃣ Testing user creation permissions...");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: "test-password-123",
    });

    if (authError) {
      console.error("❌ Auth signup error:", authError);
      console.log(
        "   Users cannot create accounts - this blocks the entire flow"
      );
      return;
    }

    console.log("✅ Auth signup working, user ID:", authData.user?.id);

    // Test 3: Check if we can insert user record
    console.log("\n3️⃣ Testing user record insertion...");

    const { error: userError } = await supabase.from("users").insert({
      user_id: authData.user.id,
      email: testEmail,
    });

    if (userError) {
      console.error("❌ User insert error:", userError);
      console.log("   This will cause signup to fail before Stripe");
      return;
    }

    console.log("✅ User record insertion working");

    // Test 4: Check category insertion
    console.log("\n4️⃣ Testing category preferences insertion...");

    const { error: catError } = await supabase.from("user_categories").insert({
      user_id: authData.user.id,
      category_id: "7c596e49-3239-4c68-8b81-d1de0d11fa64", // Coffee Shops category UUID
    });

    if (catError) {
      console.error("❌ Category insert error:", catError);
      console.log("   This will cause signup to fail before Stripe");
      return;
    }

    console.log("✅ Category insertion working");

    // Test 5: Check if categories exist
    console.log("\n5️⃣ Checking available categories...");

    const { data: categories, error: catFetchError } = await supabase
      .from("categories")
      .select("id, name")
      .limit(5);

    if (catFetchError) {
      console.error("❌ Category fetch error:", catFetchError);
    } else {
      console.log(
        "✅ Available categories:",
        categories?.map((c) => `${c.id}: ${c.name}`)
      );
    }

    // Test 6: Check RLS policies
    console.log("\n6️⃣ Testing RLS policies...");

    // Try to read from tables that might have RLS issues
    const tables = [
      "users",
      "user_categories",
      "user_subcategories",
      "subscriptions",
    ];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        console.error(`❌ RLS issue with ${table}:`, error.message);
      } else {
        console.log(`✅ ${table} table accessible`);
      }
    }

    console.log("\n🎯 DIAGNOSIS:");
    console.log("==================================================");
    console.log("If all tests above passed, the issue is likely:");
    console.log("1. JavaScript errors in the browser (check console)");
    console.log("2. Stripe publishable key not configured");
    console.log("3. User not completing the full form");
    console.log("4. Network issues preventing Stripe redirect");
    console.log("\n🔧 NEXT STEPS:");
    console.log("1. Open browser dev tools and check for JavaScript errors");
    console.log("2. Verify STRIPE_PUBLISHABLE_KEY in .env");
    console.log("3. Test with a real email address");
    console.log("4. Check if popup blockers are preventing Stripe redirect");
  } catch (error) {
    console.error("❌ Debug script failed:", error);
  }
}

debugSignupFlow();
