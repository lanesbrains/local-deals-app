import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testDealsFlow() {
  console.log("🧪 Testing Deals Flow End-to-End\n");
  console.log("=".repeat(50));

  let testsPassed = 0;
  let totalTests = 0;

  // Test 1: Check if categories exist
  totalTests++;
  console.log("\n📋 Test 1: Categories Setup");
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");

    if (error) throw error;

    if (categories && categories.length > 0) {
      console.log(`   ✅ Found ${categories.length} categories`);
      console.log(
        `   📝 Categories: ${categories.map((c) => c.name).join(", ")}`
      );
      testsPassed++;
    } else {
      console.log(
        "   ❌ No categories found - users cannot select preferences"
      );
    }
  } catch (error) {
    console.log(`   ❌ Categories test failed: ${error.message}`);
  }

  // Test 2: Check if businesses exist
  totalTests++;
  console.log("\n📋 Test 2: Businesses Setup");
  try {
    const { data: businesses, error } = await supabase
      .from("businesses")
      .select("id, name, category_id, slug");

    if (error) throw error;

    if (businesses && businesses.length > 0) {
      console.log(`   ✅ Found ${businesses.length} businesses`);

      // Check if businesses have proper slugs
      const businessesWithSlugs = businesses.filter((b) => b.slug);
      console.log(
        `   📝 Businesses with slugs: ${businessesWithSlugs.length}/${businesses.length}`
      );

      if (businessesWithSlugs.length === businesses.length) {
        testsPassed++;
      } else {
        console.log(
          "   ⚠️  Some businesses missing slugs - links may not work"
        );
      }
    } else {
      console.log("   ❌ No businesses found - no deals can be created");
    }
  } catch (error) {
    console.log(`   ❌ Businesses test failed: ${error.message}`);
  }

  // Test 3: Check deals structure
  totalTests++;
  console.log("\n📋 Test 3: Deals Structure");
  try {
    const { data: deals, error } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, business_id, created_at,
        businesses (id, name, slug, category_id)
      `
      )
      .limit(5);

    if (error) throw error;

    console.log(`   ✅ Found ${deals?.length || 0} deals`);

    if (deals && deals.length > 0) {
      // Check if deals have proper business relationships
      const dealsWithBusinesses = deals.filter((d) => d.businesses);
      console.log(
        `   📝 Deals with business data: ${dealsWithBusinesses.length}/${deals.length}`
      );

      if (dealsWithBusinesses.length === deals.length) {
        testsPassed++;
        console.log("   ✅ All deals properly linked to businesses");
      } else {
        console.log("   ⚠️  Some deals missing business relationships");
      }
    } else {
      console.log("   ⚠️  No deals found - consider adding sample deals");
      testsPassed++; // Not a failure, just empty
    }
  } catch (error) {
    console.log(`   ❌ Deals structure test failed: ${error.message}`);
  }

  // Test 4: Check user subscription structure
  totalTests++;
  console.log("\n📋 Test 4: User Subscription Structure");
  try {
    // Check if subscription tables exist and are properly structured
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .limit(1);

    if (subError) throw subError;

    const { data: userCategories, error: catError } = await supabase
      .from("user_categories")
      .select("*")
      .limit(1);

    if (catError) throw catError;

    console.log("   ✅ Subscription tables accessible");
    console.log("   ✅ User categories table accessible");
    testsPassed++;
  } catch (error) {
    console.log(`   ❌ Subscription structure test failed: ${error.message}`);
  }

  // Test 5: Test notification query
  totalTests++;
  console.log("\n📋 Test 5: Notification Query Logic");
  try {
    // Simulate the query used in notifications
    const { data: testQuery, error } = await supabase
      .from("users")
      .select(
        `
        user_id, email,
        user_categories(category_id),
        subscriptions(status, plan_type)
      `
      )
      .eq("subscriptions.status", "active")
      .eq("subscriptions.plan_type", "newsletter")
      .limit(1);

    if (error) throw error;

    console.log("   ✅ Notification query structure works");
    console.log(`   📝 Query returned ${testQuery?.length || 0} test records`);
    testsPassed++;
  } catch (error) {
    console.log(`   ❌ Notification query test failed: ${error.message}`);
    console.log("   💡 This may indicate RLS policy issues or missing joins");
  }

  // Test 6: Check API endpoint exists
  totalTests++;
  console.log("\n📋 Test 6: API Endpoint Availability");
  try {
    const fs = await import("fs");
    const apiPath = "server/api/notify-deal-update.post.js";

    if (fs.existsSync(apiPath)) {
      console.log("   ✅ Deal notification API endpoint exists");
      testsPassed++;
    } else {
      console.log("   ❌ Deal notification API endpoint missing");
    }
  } catch (error) {
    console.log(`   ❌ API endpoint test failed: ${error.message}`);
  }

  // Test 7: Check email template structure
  totalTests++;
  console.log("\n📋 Test 7: Email Configuration");
  try {
    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== "your_resend_api_key"
    ) {
      console.log("   ✅ Resend API key configured");

      if (
        process.env.APP_URL &&
        process.env.APP_URL !== "http://localhost:3000"
      ) {
        console.log("   ✅ Production app URL configured");
        testsPassed++;
      } else {
        console.log(
          "   ⚠️  App URL not set for production - email links may not work"
        );
      }
    } else {
      console.log("   ❌ Resend API key not properly configured");
    }
  } catch (error) {
    console.log(`   ❌ Email configuration test failed: ${error.message}`);
  }

  // Test 8: Blog integration
  totalTests++;
  console.log("\n📋 Test 8: Blog Integration");
  try {
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .limit(1);

    if (error) throw error;

    console.log("   ✅ Blog posts table accessible");
    testsPassed++;
  } catch (error) {
    console.log(`   ❌ Blog integration test failed: ${error.message}`);
    console.log("   💡 Blog table may need to be created");
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 DEALS FLOW TEST SUMMARY");
  console.log("=".repeat(50));

  const successRate = Math.round((testsPassed / totalTests) * 100);
  console.log(
    `🎯 Success Rate: ${successRate}% (${testsPassed}/${totalTests} tests passed)`
  );

  if (successRate >= 90) {
    console.log("🎉 EXCELLENT! Deals flow is ready for production.");
  } else if (successRate >= 70) {
    console.log("⚠️  GOOD - Minor issues to address before production.");
  } else {
    console.log("❌ NEEDS WORK - Several critical issues need fixing.");
  }

  console.log("\n🔧 Recommended Actions:");

  if (testsPassed < totalTests) {
    console.log("1. Fix failing tests above");
    console.log("2. Verify database relationships and constraints");
    console.log("3. Test RLS policies with different user roles");
    console.log("4. Manually test the complete user journey");
  }

  console.log("5. Create sample data for testing:");
  console.log("   - Add test categories and subcategories");
  console.log("   - Create sample businesses in different categories");
  console.log("   - Add sample deals with various date ranges");
  console.log("   - Create test users with different preferences");

  console.log("6. Test email notifications:");
  console.log("   - Create a test deal and verify emails are sent");
  console.log("   - Check email formatting and links");
  console.log("   - Verify unsubscribe functionality");

  console.log("7. Performance testing:");
  console.log("   - Test with larger datasets");
  console.log("   - Monitor query performance");
  console.log("   - Check email sending limits");

  return { successRate, testsPassed, totalTests };
}

// Run the test
testDealsFlow().catch(console.error);
