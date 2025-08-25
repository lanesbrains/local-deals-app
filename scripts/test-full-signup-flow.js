#!/usr/bin/env node

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testFullSignupFlow() {
  console.log("🚀 Testing Complete Newsletter Signup Flow\n");

  const testEmail = `fulltest.${Date.now()}@gmail.com`;
  const selectedCategories = [
    { id: "7c596e49-3239-4c68-8b81-d1de0d11fa64", subcategory_id: null }, // Coffee Shops
    {
      id: "998e0c33-8ca9-4edc-a5a7-fe71c798526a",
      subcategory_id: "7242f537-da62-4240-b9d9-586723d00a23",
    }, // Restaurants with Breakfast
  ];

  try {
    console.log("📧 Testing with email:", testEmail);
    console.log("📋 Selected categories:", selectedCategories);

    // Step 1: Validate input (like the frontend does)
    if (!testEmail) {
      throw new Error("Please enter your email address");
    }
    if (selectedCategories.length === 0) {
      throw new Error("Please select at least one category");
    }

    console.log("\n✅ Input validation passed");

    // Step 2: Create auth user
    console.log("\n👤 Creating auth user...");
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: "auto-generated-" + Math.random().toString(36).slice(2),
    });

    if (authError) {
      console.error("❌ Auth error:", authError);
      throw new Error(`Signup failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("Failed to create user account");
    }

    console.log("✅ User created successfully:", authData.user.id);

    // Step 3: Insert user record
    console.log("\n💾 Inserting user record...");
    const { error: userError } = await supabase.from("users").insert({
      user_id: authData.user.id,
      email: testEmail,
    });

    if (userError) {
      console.error("❌ User insert error:", userError);
      throw new Error(`Failed to save user data: ${userError.message}`);
    }

    console.log("✅ User record inserted successfully");

    // Step 4: Insert category preferences
    console.log("\n📂 Processing category preferences...");
    const categoriesToInsert = selectedCategories
      .filter((c) => !c.subcategory_id)
      .map((c) => ({ user_id: authData.user.id, category_id: c.id }));

    const subcategoriesToInsert = selectedCategories
      .filter((c) => c.subcategory_id)
      .map((c) => ({
        user_id: authData.user.id,
        subcategory_id: c.subcategory_id,
      }));

    console.log("   Categories to insert:", categoriesToInsert);
    console.log("   Subcategories to insert:", subcategoriesToInsert);

    if (categoriesToInsert.length > 0) {
      const { error: catError } = await supabase
        .from("user_categories")
        .insert(categoriesToInsert);

      if (catError) {
        console.error("❌ Category insert error:", catError);
        throw new Error(
          `Failed to save category preferences: ${catError.message}`
        );
      }
      console.log("✅ Categories inserted successfully");
    }

    if (subcategoriesToInsert.length > 0) {
      const { error: subError } = await supabase
        .from("user_subcategories")
        .insert(subcategoriesToInsert);

      if (subError) {
        console.error("❌ Subcategory insert error:", subError);
        throw new Error(
          `Failed to save subcategory preferences: ${subError.message}`
        );
      }
      console.log("✅ Subcategories inserted successfully");
    }

    // Step 5: Create Stripe checkout session
    console.log("\n💳 Creating Stripe checkout session...");

    const { data: sessionData, error: sessionError } =
      await supabase.functions.invoke("create-stripe-checkout", {
        body: {
          user_id: authData.user.id,
          email: testEmail,
          plan_type: "newsletter",
          price_id: "price_1S06naFqXu3q4jXwqTbg1reO",
          success_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
        },
      });

    if (sessionError) {
      console.error("❌ Stripe session error:", sessionError);
      throw new Error(`Payment setup failed: ${sessionError.message}`);
    }

    if (!sessionData?.session_id) {
      throw new Error("Failed to create payment session");
    }

    console.log("✅ Stripe checkout session created:", sessionData.session_id);
    console.log(
      "   Checkout URL: https://checkout.stripe.com/c/pay/" +
        sessionData.session_id
    );

    console.log("\n🎉 COMPLETE SUCCESS!");
    console.log("==================================================");
    console.log("✅ User account created");
    console.log("✅ User record saved");
    console.log("✅ Category preferences saved");
    console.log("✅ Stripe checkout session created");
    console.log("\n🔗 Next step: User would be redirected to Stripe checkout");
    console.log("💡 The signup flow is working perfectly!");
    console.log(
      "\n🤔 If users are not seeing Stripe checkout, the issue is likely:"
    );
    console.log("   1. JavaScript errors in the browser");
    console.log("   2. Popup blockers preventing redirect");
    console.log("   3. Network connectivity issues");
    console.log("   4. Users not completing the form properly");
  } catch (error) {
    console.error("\n❌ SIGNUP FLOW FAILED:", error.message);
    console.log("\n🔍 This is exactly what users are experiencing!");
    console.log("   Error type:", error.constructor.name);
    console.log("   Full error:", error);
  }
}

testFullSignupFlow();
