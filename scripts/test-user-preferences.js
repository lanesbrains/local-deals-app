#!/usr/bin/env node

/**
 * Test script to verify user category preferences are working correctly
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testUserPreferences() {
  try {
    console.log("🧪 Testing User Category Preferences\n");

    // 1. Check if we have any users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("user_id, email")
      .limit(5);

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return;
    }

    console.log(`👥 Found ${users?.length || 0} users in database`);
    if (users && users.length > 0) {
      users.forEach((user) => {
        console.log(`   - ${user.email} (${user.user_id})`);
      });
    }
    console.log("");

    // 2. Check categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, name, slug");

    if (catError) {
      console.error("❌ Error fetching categories:", catError);
      return;
    }

    console.log(`📂 Found ${categories?.length || 0} categories:`);
    if (categories) {
      categories.forEach((cat) => {
        console.log(`   - ${cat.name} (ID: ${cat.id})`);
      });
    }
    console.log("");

    // 3. Check user category preferences
    const { data: userCategories, error: userCatError } = await supabase.from(
      "user_categories"
    ).select(`
        user_id,
        category_id,
        users(email),
        categories(name)
      `);

    if (userCatError) {
      console.error("❌ Error fetching user categories:", userCatError);
      return;
    }

    console.log(
      `🎯 Found ${userCategories?.length || 0} user category preferences:`
    );
    if (userCategories && userCategories.length > 0) {
      userCategories.forEach((pref) => {
        console.log(`   - ${pref.users?.email} → ${pref.categories?.name}`);
      });
    } else {
      console.log("   ⚠️  No user category preferences found!");
      console.log(
        "   This means users are signing up but their category selections aren't being saved."
      );
    }
    console.log("");

    // 4. Check user subcategory preferences
    const { data: userSubcategories, error: userSubError } =
      await supabase.from("user_subcategories").select(`
        user_id,
        subcategory_id,
        users(email),
        subcategories(name)
      `);

    if (userSubError) {
      console.error("❌ Error fetching user subcategories:", userSubError);
      return;
    }

    console.log(
      `🎯 Found ${userSubcategories?.length || 0} user subcategory preferences:`
    );
    if (userSubcategories && userSubcategories.length > 0) {
      userSubcategories.forEach((pref) => {
        console.log(`   - ${pref.users?.email} → ${pref.subcategories?.name}`);
      });
    } else {
      console.log("   ⚠️  No user subcategory preferences found!");
    }
    console.log("");

    // 5. Test newsletter query (simulate what the newsletter script does)
    console.log("📧 Testing newsletter query...");

    const { data: newsletterUsers, error: newsletterError } = await supabase
      .from("users")
      .select(
        `
        user_id, 
        email,
        user_categories(category_id),
        user_subcategories(subcategory_id),
        subscriptions!inner(status, plan_type)
      `
      )
      .eq("subscriptions.status", "active")
      .eq("subscriptions.plan_type", "newsletter");

    if (newsletterError) {
      console.error("❌ Newsletter query error:", newsletterError);
      return;
    }

    console.log(
      `📬 Found ${newsletterUsers?.length || 0} active newsletter subscribers:`
    );
    if (newsletterUsers && newsletterUsers.length > 0) {
      newsletterUsers.forEach((user) => {
        const categories =
          user.user_categories?.map((c) => c.category_id) || [];
        const subcategories =
          user.user_subcategories?.map((s) => s.subcategory_id) || [];
        console.log(`   - ${user.email}:`);
        console.log(`     Categories: [${categories.join(", ")}]`);
        console.log(`     Subcategories: [${subcategories.join(", ")}]`);
      });
    } else {
      console.log("   ⚠️  No active newsletter subscribers found!");
    }
    console.log("");

    // 6. Check subscriptions
    const { data: subscriptions, error: subError } = await supabase.from(
      "subscriptions"
    ).select(`
        user_id,
        plan_type,
        status,
        users(email)
      `);

    if (subError) {
      console.error("❌ Error fetching subscriptions:", subError);
      return;
    }

    console.log(`💳 Found ${subscriptions?.length || 0} subscriptions:`);
    if (subscriptions && subscriptions.length > 0) {
      subscriptions.forEach((sub) => {
        console.log(
          `   - ${sub.users?.email}: ${sub.plan_type} (${sub.status})`
        );
      });
    } else {
      console.log("   ⚠️  No subscriptions found!");
    }
    console.log("");

    // 7. Summary and recommendations
    console.log("📊 SUMMARY:");
    console.log("=".repeat(50));

    if (!users || users.length === 0) {
      console.log("❌ No users found - signup process may not be working");
    } else {
      console.log(`✅ ${users.length} users found`);
    }

    if (!userCategories || userCategories.length === 0) {
      console.log("❌ No user category preferences found");
      console.log("   → This means category selection during signup is broken");
      console.log("   → Users won't receive personalized newsletters");
    } else {
      console.log(`✅ ${userCategories.length} category preferences found`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("❌ No subscriptions found");
      console.log("   → Stripe integration may not be working");
    } else {
      console.log(`✅ ${subscriptions.length} subscriptions found`);
    }

    if (!newsletterUsers || newsletterUsers.length === 0) {
      console.log("❌ No active newsletter subscribers");
      console.log("   → Newsletter won't send to anyone");
    } else {
      console.log(`✅ ${newsletterUsers.length} active newsletter subscribers`);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testUserPreferences();
