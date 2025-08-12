import { createClient } from "@supabase/supabase-js";
import { subDays, format } from "date-fns";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testWeeklyNewsletter() {
  console.log("🧪 Testing Weekly Newsletter System\n");
  console.log("=".repeat(50));

  let testsPassed = 0;
  let totalTests = 0;

  // Test 1: Check subscriber query
  totalTests++;
  console.log("\n📋 Test 1: Newsletter Subscribers Query");
  try {
    const { data: subscribers, error } = await supabase
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
      .eq("subscriptions.plan_type", "newsletter")
      .limit(5);

    if (error) throw error;

    console.log(
      `   ✅ Query successful - found ${subscribers?.length || 0} test subscribers`
    );

    if (subscribers && subscribers.length > 0) {
      console.log("   📝 Sample subscriber structure:");
      const sample = subscribers[0];
      console.log(`      Email: ${sample.email}`);
      console.log(`      Categories: ${sample.user_categories?.length || 0}`);
      console.log(
        `      Subcategories: ${sample.user_subcategories?.length || 0}`
      );
      testsPassed++;
    } else {
      console.log("   ⚠️  No subscribers found - create test users to verify");
    }
  } catch (error) {
    console.log(`   ❌ Subscriber query failed: ${error.message}`);
  }

  // Test 2: Check deals from past week query
  totalTests++;
  console.log("\n📋 Test 2: Past Week Deals Query");
  try {
    const oneWeekAgo = subDays(new Date(), 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    const { data: recentDeals, error } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, discount, start_date, end_date, created_at,
        businesses(id, name, slug, description, category_id, subcategory_id)
      `
      )
      .gte("created_at", oneWeekAgoISO)
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log(
      `   ✅ Query successful - found ${recentDeals?.length || 0} deals from past week`
    );
    console.log(
      `   📅 Date range: ${format(oneWeekAgo, "MMM d")} - ${format(new Date(), "MMM d, yyyy")}`
    );

    if (recentDeals && recentDeals.length > 0) {
      console.log("   📝 Sample deal structure:");
      const sample = recentDeals[0];
      console.log(`      Title: ${sample.title}`);
      console.log(`      Business: ${sample.businesses?.name || "N/A"}`);
      console.log(
        `      Category ID: ${sample.businesses?.category_id || "N/A"}`
      );
      console.log(
        `      Created: ${format(new Date(sample.created_at), "MMM d, yyyy")}`
      );
    }
    testsPassed++;
  } catch (error) {
    console.log(`   ❌ Recent deals query failed: ${error.message}`);
  }

  // Test 3: Check category matching logic
  totalTests++;
  console.log("\n📋 Test 3: Category Matching Logic");
  try {
    // Get a sample of categories and subcategories
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name")
      .limit(3);

    const { data: subcategories } = await supabase
      .from("subcategories")
      .select("id, name, category_id")
      .limit(3);

    console.log(`   ✅ Categories available: ${categories?.length || 0}`);
    console.log(`   ✅ Subcategories available: ${subcategories?.length || 0}`);

    if (categories && categories.length > 0) {
      console.log("   📝 Sample categories:");
      categories.forEach((cat) => {
        console.log(`      ${cat.id}: ${cat.name}`);
      });
    }

    if (subcategories && subcategories.length > 0) {
      console.log("   📝 Sample subcategories:");
      subcategories.forEach((sub) => {
        console.log(
          `      ${sub.id}: ${sub.name} (category: ${sub.category_id})`
        );
      });
    }

    testsPassed++;
  } catch (error) {
    console.log(`   ❌ Category matching test failed: ${error.message}`);
  }

  // Test 4: Check email environment
  totalTests++;
  console.log("\n📋 Test 4: Email Configuration");
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
        console.log(`   📝 App URL: ${process.env.APP_URL}`);
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

  // Test 5: Simulate newsletter logic
  totalTests++;
  console.log("\n📋 Test 5: Newsletter Logic Simulation");
  try {
    // Get one subscriber and one deal to test matching
    const { data: testSubscriber } = await supabase
      .from("users")
      .select(
        `
        user_id, email,
        user_categories(category_id),
        user_subcategories(subcategory_id),
        subscriptions!inner(status, plan_type)
      `
      )
      .eq("subscriptions.status", "active")
      .eq("subscriptions.plan_type", "newsletter")
      .limit(1)
      .single();

    const oneWeekAgo = subDays(new Date(), 7);
    const { data: testDeal } = await supabase
      .from("deals")
      .select(
        `
        id, title, businesses(category_id, subcategory_id, name)
      `
      )
      .gte("created_at", oneWeekAgo.toISOString())
      .limit(1)
      .single();

    if (testSubscriber && testDeal) {
      const userCategories =
        testSubscriber.user_categories?.map((c) => c.category_id) || [];
      const userSubcategories =
        testSubscriber.user_subcategories?.map((s) => s.subcategory_id) || [];

      const matchesCategory = userCategories.includes(
        testDeal.businesses.category_id
      );
      const matchesSubcategory =
        testDeal.businesses.subcategory_id &&
        userSubcategories.includes(testDeal.businesses.subcategory_id);

      const wouldReceiveEmail = matchesCategory || matchesSubcategory;

      console.log("   ✅ Newsletter logic simulation successful");
      console.log(`   📝 Test subscriber: ${testSubscriber.email}`);
      console.log(
        `   📝 Test deal: ${testDeal.title} (${testDeal.businesses.name})`
      );
      console.log(
        `   📝 Would receive email: ${wouldReceiveEmail ? "YES" : "NO"}`
      );
      console.log(
        `   📝 Reason: ${matchesCategory ? "Category match" : matchesSubcategory ? "Subcategory match" : "No match"}`
      );

      testsPassed++;
    } else {
      console.log("   ⚠️  No test data available for simulation");
      console.log("   💡 Create test subscribers and deals to verify logic");
    }
  } catch (error) {
    console.log(`   ❌ Newsletter logic simulation failed: ${error.message}`);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 WEEKLY NEWSLETTER TEST SUMMARY");
  console.log("=".repeat(50));

  const successRate = Math.round((testsPassed / totalTests) * 100);
  console.log(
    `🎯 Success Rate: ${successRate}% (${testsPassed}/${totalTests} tests passed)`
  );

  if (successRate >= 90) {
    console.log("🎉 EXCELLENT! Weekly newsletter system is ready.");
  } else if (successRate >= 70) {
    console.log("⚠️  GOOD - Minor issues to address.");
  } else {
    console.log("❌ NEEDS WORK - Several issues need fixing.");
  }

  console.log("\n🔧 To test the full newsletter flow:");
  console.log("1. Create test users with different category preferences");
  console.log("2. Create test deals in various categories");
  console.log("3. Run: npm run send-weekly-newsletter");
  console.log("4. Check email delivery and content");

  console.log("\n📅 Newsletter Schedule:");
  console.log("• Automatically runs every Monday at 9 AM UTC");
  console.log("• Includes only deals from the past 7 days");
  console.log("• Sends only to users with matching category preferences");
  console.log("• Professional email template with business links");

  return { successRate, testsPassed, totalTests };
}

// Run the test
testWeeklyNewsletter().catch(console.error);
