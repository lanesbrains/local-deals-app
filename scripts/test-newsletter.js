import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testNewsletterFlow() {
  try {
    console.log("🧪 Testing Newsletter Flow...\n");

    // 1. Test: Check if we have subscribers
    console.log("1. Checking subscribers...");
    const { data: subscribers, error: subError } = await supabase
      .from("subscriptions")
      .select(
        `
        user_id,
        users(email),
        user_categories(category_id),
        user_subcategories(subcategory_id)
      `
      )
      .eq("plan_type", "newsletter")
      .eq("status", "active");

    if (subError) {
      console.error("❌ Error fetching subscribers:", subError);
      return;
    }

    console.log(`✅ Found ${subscribers.length} active subscribers`);
    subscribers.forEach((sub) => {
      console.log(
        `   - ${sub.users.email} (Categories: ${sub.user_categories.length}, Subcategories: ${sub.user_subcategories.length})`
      );
    });

    // 2. Test: Check if we have deals
    console.log("\n2. Checking deals...");
    const { data: deals, error: dealError } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, start_date, end_date,
        businesses(id, name, slug, description, category_id, subcategory_id)
      `
      )
      .order("created_at", { ascending: false });

    if (dealError) {
      console.error("❌ Error fetching deals:", dealError);
      return;
    }

    console.log(`✅ Found ${deals.length} deals`);
    deals.forEach((deal) => {
      console.log(`   - ${deal.title} (${deal.businesses.name})`);
      console.log(
        `     Business Description: ${deal.businesses.description ? "Yes" : "No"}`
      );
      console.log(`     Deal Description: ${deal.description ? "Yes" : "No"}`);
      console.log(`     Start Date: ${deal.start_date || "None"}`);
      console.log(`     End Date: ${deal.end_date || "None"}`);
    });

    // 3. Test: Match deals to subscribers
    console.log("\n3. Testing deal matching...");
    for (const subscriber of subscribers) {
      const user = subscriber.users;
      const userCategories =
        subscriber.user_categories.map((c) => c.category_id) || [];
      const userSubcategories =
        subscriber.user_subcategories.map((s) => s.subcategory_id) || [];

      const relevantDeals = deals.filter((deal) => {
        const business = deal.businesses;
        return (
          userCategories.includes(business.category_id) ||
          userSubcategories.includes(business.subcategory_id)
        );
      });

      console.log(`\n   📧 ${user.email}:`);
      console.log(`      Categories: ${userCategories.join(", ") || "None"}`);
      console.log(
        `      Subcategories: ${userSubcategories.join(", ") || "None"}`
      );
      console.log(`      Relevant deals: ${relevantDeals.length}`);

      if (relevantDeals.length > 0) {
        relevantDeals.forEach((deal) => {
          console.log(`        - ${deal.title} (${deal.businesses.name})`);
        });
      }
    }

    // 4. Test: Check business descriptions
    console.log("\n4. Checking business descriptions...");
    const { data: businesses, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, description, category_id, subcategory_id");

    if (businessError) {
      console.error("❌ Error fetching businesses:", businessError);
      return;
    }

    console.log(`✅ Found ${businesses.length} businesses`);
    businesses.forEach((business) => {
      console.log(
        `   - ${business.name}: ${business.description ? "Has description" : "No description"}`
      );
    });

    console.log("\n🎉 Newsletter flow test completed!");
    console.log("\n📋 Summary:");
    console.log(`   - Subscribers: ${subscribers.length}`);
    console.log(`   - Deals: ${deals.length}`);
    console.log(`   - Businesses: ${businesses.length}`);
    console.log(
      `   - Businesses with descriptions: ${businesses.filter((b) => b.description).length}`
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testNewsletterFlow();
