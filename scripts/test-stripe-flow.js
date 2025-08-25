#!/usr/bin/env node

/**
 * Test script to verify Stripe integration is working correctly
 */

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripeIntegration() {
  try {
    console.log("💳 Testing Stripe Integration\n");

    // 1. Test Stripe connection
    console.log("🔗 Testing Stripe connection...");
    try {
      const account = await stripe.accounts.retrieve();
      console.log(
        `✅ Connected to Stripe account: ${account.display_name || account.id}`
      );
      console.log(`   Country: ${account.country}`);
      console.log(`   Currency: ${account.default_currency?.toUpperCase()}`);
    } catch (error) {
      console.error("❌ Stripe connection failed:", error.message);
      return;
    }
    console.log("");

    // 2. Check if products exist
    console.log("📦 Checking Stripe products...");
    try {
      const products = await stripe.products.list({ limit: 10 });
      console.log(`Found ${products.data.length} products:`);

      if (products.data.length === 0) {
        console.log(
          "⚠️  No products found! You need to create products in Stripe dashboard."
        );
        console.log("   Required products:");
        console.log("   - PNW Deals Newsletter ($1/month)");
        console.log("   - Business Directory Standard ($5/month)");
        console.log("   - Business Directory Premium ($10/month)");
      } else {
        products.data.forEach((product) => {
          console.log(`   - ${product.name} (${product.id})`);
        });
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error.message);
    }
    console.log("");

    // 3. Check prices
    console.log("💰 Checking Stripe prices...");
    try {
      const prices = await stripe.prices.list({ limit: 10 });
      console.log(`Found ${prices.data.length} prices:`);

      if (prices.data.length === 0) {
        console.log(
          "⚠️  No prices found! You need to create prices for your products."
        );
      } else {
        prices.data.forEach((price) => {
          const amount = price.unit_amount / 100;
          const currency = price.currency.toUpperCase();
          const interval = price.recurring?.interval || "one-time";
          console.log(`   - ${price.id}: ${currency} ${amount}/${interval}`);
        });
      }
    } catch (error) {
      console.error("❌ Error fetching prices:", error.message);
    }
    console.log("");

    // 4. Test webhook endpoint
    console.log("🔗 Checking webhook endpoints...");
    try {
      const webhooks = await stripe.webhookEndpoints.list();
      console.log(`Found ${webhooks.data.length} webhook endpoints:`);

      if (webhooks.data.length === 0) {
        console.log("⚠️  No webhook endpoints found!");
        console.log("   You need to add this endpoint in Stripe dashboard:");
        console.log(
          "   https://abynqzmdfxdyjsxekphd.supabase.co/functions/v1/stripe-webhook"
        );
      } else {
        webhooks.data.forEach((webhook) => {
          console.log(`   - ${webhook.url}`);
          console.log(`     Status: ${webhook.status}`);
          console.log(`     Events: ${webhook.enabled_events.join(", ")}`);
        });
      }
    } catch (error) {
      console.error("❌ Error fetching webhooks:", error.message);
    }
    console.log("");

    // 5. Test creating a checkout session (simulation)
    console.log("🛒 Testing checkout session creation...");
    try {
      // First, get a price ID to use
      const prices = await stripe.prices.list({ limit: 1 });

      if (prices.data.length === 0) {
        console.log("⚠️  Cannot test checkout - no prices available");
      } else {
        const testPrice = prices.data[0];
        console.log(
          `Using test price: ${testPrice.id} (${testPrice.unit_amount / 100} ${testPrice.currency.toUpperCase()})`
        );

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: testPrice.id,
              quantity: 1,
            },
          ],
          mode: testPrice.recurring ? "subscription" : "payment",
          success_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
          metadata: {
            user_id: "test_user_123",
            plan_type: "newsletter",
          },
        });

        console.log(`✅ Checkout session created: ${session.id}`);
        console.log(`   URL: ${session.url}`);
        console.log(
          "   (This is just a test - session will expire in 24 hours)"
        );
      }
    } catch (error) {
      console.error("❌ Error creating checkout session:", error.message);
    }
    console.log("");

    // 6. Check database subscriptions
    console.log("💾 Checking database subscriptions...");
    try {
      const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select(
          `
          id,
          user_id,
          plan_type,
          status,
          stripe_subscription_id,
          created_at,
          users(email)
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("❌ Database error:", error.message);
      } else {
        console.log(
          `Found ${subscriptions?.length || 0} subscriptions in database:`
        );
        if (subscriptions && subscriptions.length > 0) {
          subscriptions.forEach((sub) => {
            console.log(
              `   - ${sub.users?.email}: ${sub.plan_type} (${sub.status})`
            );
            console.log(
              `     Stripe ID: ${sub.stripe_subscription_id || "None"}`
            );
          });
        } else {
          console.log(
            "   No subscriptions found - users may not be completing payment"
          );
        }
      }
    } catch (error) {
      console.error("❌ Database connection error:", error.message);
    }
    console.log("");

    // 7. Summary and recommendations
    console.log("📊 INTEGRATION STATUS:");
    console.log("=".repeat(50));

    const products = await stripe.products.list({ limit: 1 });
    const prices = await stripe.prices.list({ limit: 1 });
    const webhooks = await stripe.webhookEndpoints.list();

    if (products.data.length === 0) {
      console.log("❌ Missing: Stripe products");
      console.log("   → Create products in Stripe dashboard");
    } else {
      console.log("✅ Stripe products configured");
    }

    if (prices.data.length === 0) {
      console.log("❌ Missing: Stripe prices");
      console.log("   → Create prices for your products");
    } else {
      console.log("✅ Stripe prices configured");
    }

    if (webhooks.data.length === 0) {
      console.log("❌ Missing: Webhook endpoint");
      console.log("   → Add webhook in Stripe dashboard");
    } else {
      console.log("✅ Webhook endpoint configured");
    }

    console.log("\n🚀 NEXT STEPS:");
    console.log("1. Create products and prices in Stripe dashboard");
    console.log("2. Add webhook endpoint in Stripe dashboard");
    console.log("3. Update price IDs in your code");
    console.log("4. Test complete signup flow");
    console.log("5. Implement free tier (optional)");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testStripeIntegration();
