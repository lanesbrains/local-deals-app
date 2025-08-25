#!/usr/bin/env node

/**
 * Test and setup Stripe products for PNW Deals
 */

import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  console.log("💳 Setting up Stripe Products for PNW Deals\n");

  try {
    // 1. Check existing products
    console.log("📦 Checking existing products...");
    const existingProducts = await stripe.products.list({ limit: 10 });

    console.log(`Found ${existingProducts.data.length} existing products:`);
    existingProducts.data.forEach((product) => {
      console.log(`   - ${product.name} (${product.id})`);
    });
    console.log("");

    // 2. Create Newsletter Product
    console.log("📧 Creating Newsletter product...");

    let newsletterProduct = existingProducts.data.find((p) =>
      p.name.includes("Newsletter")
    );

    if (!newsletterProduct) {
      newsletterProduct = await stripe.products.create({
        name: "PNW Deals Newsletter",
        description:
          "Weekly newsletter with personalized local deals from the Pacific Northwest",
        type: "service",
      });
      console.log(`✅ Created newsletter product: ${newsletterProduct.id}`);
    } else {
      console.log(
        `✅ Newsletter product already exists: ${newsletterProduct.id}`
      );
    }

    // Create newsletter price
    const newsletterPrices = await stripe.prices.list({
      product: newsletterProduct.id,
    });
    let newsletterPrice = newsletterPrices.data.find(
      (p) => p.unit_amount === 100
    ); // $1.00

    if (!newsletterPrice) {
      newsletterPrice = await stripe.prices.create({
        product: newsletterProduct.id,
        unit_amount: 100, // $1.00
        currency: "usd",
        recurring: {
          interval: "month",
        },
        nickname: "Newsletter Monthly",
      });
      console.log(
        `✅ Created newsletter price: ${newsletterPrice.id} ($1.00/month)`
      );
    } else {
      console.log(`✅ Newsletter price already exists: ${newsletterPrice.id}`);
    }

    // 3. Create Business Directory Products
    console.log("🏢 Creating Business Directory products...");

    // Standard Business Directory
    let standardProduct = existingProducts.data.find(
      (p) => p.name.includes("Business") && p.name.includes("Standard")
    );

    if (!standardProduct) {
      standardProduct = await stripe.products.create({
        name: "PNW Deals Business Directory - Standard",
        description: "Standard business listing in PNW Deals directory",
        type: "service",
      });
      console.log(
        `✅ Created standard business product: ${standardProduct.id}`
      );
    } else {
      console.log(
        `✅ Standard business product already exists: ${standardProduct.id}`
      );
    }

    const standardPrices = await stripe.prices.list({
      product: standardProduct.id,
    });
    let standardPrice = standardPrices.data.find((p) => p.unit_amount === 500); // $5.00

    if (!standardPrice) {
      standardPrice = await stripe.prices.create({
        product: standardProduct.id,
        unit_amount: 500, // $5.00
        currency: "usd",
        recurring: {
          interval: "month",
        },
        nickname: "Business Standard Monthly",
      });
      console.log(
        `✅ Created standard business price: ${standardPrice.id} ($5.00/month)`
      );
    } else {
      console.log(
        `✅ Standard business price already exists: ${standardPrice.id}`
      );
    }

    // Premium Business Directory
    let premiumProduct = existingProducts.data.find(
      (p) => p.name.includes("Business") && p.name.includes("Premium")
    );

    if (!premiumProduct) {
      premiumProduct = await stripe.products.create({
        name: "PNW Deals Business Directory - Premium",
        description:
          "Premium business listing with featured placement and enhanced visibility",
        type: "service",
      });
      console.log(`✅ Created premium business product: ${premiumProduct.id}`);
    } else {
      console.log(
        `✅ Premium business product already exists: ${premiumProduct.id}`
      );
    }

    const premiumPrices = await stripe.prices.list({
      product: premiumProduct.id,
    });
    let premiumPrice = premiumPrices.data.find((p) => p.unit_amount === 1000); // $10.00

    if (!premiumPrice) {
      premiumPrice = await stripe.prices.create({
        product: premiumProduct.id,
        unit_amount: 1000, // $10.00
        currency: "usd",
        recurring: {
          interval: "month",
        },
        nickname: "Business Premium Monthly",
      });
      console.log(
        `✅ Created premium business price: ${premiumPrice.id} ($10.00/month)`
      );
    } else {
      console.log(
        `✅ Premium business price already exists: ${premiumPrice.id}`
      );
    }

    // 4. Display price IDs for code update
    console.log("\n🔧 UPDATE YOUR CODE WITH THESE PRICE IDs:");
    console.log("=".repeat(60));
    console.log(`Newsletter Price ID: ${newsletterPrice.id}`);
    console.log(`Business Standard Price ID: ${standardPrice.id}`);
    console.log(`Business Premium Price ID: ${premiumPrice.id}`);
    console.log("");
    console.log("📝 Update these files:");
    console.log('1. pages/index.vue - replace "price_newsletter_1month"');
    console.log("2. pages/business-signup.vue - replace price IDs");
    console.log("");

    // 5. Test creating a checkout session
    console.log("🛒 Testing checkout session creation...");

    const testSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: newsletterPrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.com/cancel",
      metadata: {
        user_id: "test_user_123",
        plan_type: "newsletter",
      },
    });

    console.log(`✅ Test checkout session created: ${testSession.id}`);
    console.log(`   URL: ${testSession.url}`);
    console.log("   (This session will expire in 24 hours)");

    // 6. Check webhook endpoints
    console.log("\n🔗 Checking webhook endpoints...");
    const webhooks = await stripe.webhookEndpoints.list();

    if (webhooks.data.length === 0) {
      console.log("⚠️  No webhook endpoints found!");
      console.log("📝 Add this webhook endpoint in Stripe dashboard:");
      console.log(
        "   URL: https://abynqzmdfxdyjsxekphd.supabase.co/functions/v1/stripe-webhook"
      );
      console.log(
        "   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted"
      );
    } else {
      console.log(`✅ Found ${webhooks.data.length} webhook endpoints:`);
      webhooks.data.forEach((webhook) => {
        console.log(`   - ${webhook.url} (${webhook.status})`);
      });
    }

    console.log("\n🎉 Stripe setup complete!");
    console.log("✅ Products created");
    console.log("✅ Prices configured");
    console.log("✅ Checkout session tested");
    console.log("");
    console.log("🚀 Next steps:");
    console.log("1. Update price IDs in your code");
    console.log("2. Add webhook endpoint in Stripe dashboard");
    console.log("3. Test complete signup flow");
  } catch (error) {
    console.error("❌ Stripe setup failed:", error.message);
  }
}

setupStripeProducts();
