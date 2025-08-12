import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

async function runProductionChecklist() {
  console.log("🚀 PNW Deals Production Readiness Checklist\n");
  console.log("=".repeat(60));

  const checks = [];

  // Environment Variables Check
  console.log("\n📋 1. Environment Variables");
  const requiredEnvVars = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "RESEND_API_KEY",
    "APP_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
  ];

  let envCheck = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar}`);
    } else {
      console.log(`   ❌ ${envVar} - MISSING`);
      envCheck = false;
    }
  }
  checks.push({ name: "Environment Variables", passed: envCheck });

  // Database Connection Check
  console.log("\n📋 2. Database Connection");
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    if (error) throw error;
    console.log("   ✅ Supabase connection successful");
    checks.push({ name: "Database Connection", passed: true });
  } catch (error) {
    console.log(`   ❌ Supabase connection failed: ${error.message}`);
    checks.push({ name: "Database Connection", passed: false });
  }

  // Email Service Check
  console.log("\n📋 3. Email Service");
  try {
    // Test email sending capability (without actually sending)
    if (process.env.RESEND_API_KEY) {
      console.log("   ✅ Resend API key configured");
      console.log("   ℹ️  Email service ready (test sending manually)");
      checks.push({ name: "Email Service", passed: true });
    } else {
      throw new Error("Resend API key not configured");
    }
  } catch (error) {
    console.log(`   ❌ Email service check failed: ${error.message}`);
    checks.push({ name: "Email Service", passed: false });
  }

  // Core Tables Check
  console.log("\n📋 4. Core Database Tables");
  const coreTables = [
    "users",
    "businesses",
    "deals",
    "categories",
    "subscriptions",
  ];
  let tablesCheck = true;

  for (const table of coreTables) {
    try {
      const { error } = await supabase.from(table).select("*").limit(1);
      if (error) throw error;
      console.log(`   ✅ Table '${table}' accessible`);
    } catch (error) {
      console.log(`   ❌ Table '${table}' error: ${error.message}`);
      tablesCheck = false;
    }
  }
  checks.push({ name: "Core Database Tables", passed: tablesCheck });

  // Sample Data Check
  console.log("\n📋 5. Sample Data");
  try {
    const { data: categories } = await supabase.from("categories").select("*");
    const { data: businesses } = await supabase.from("businesses").select("*");
    const { data: deals } = await supabase.from("deals").select("*");

    console.log(`   ✅ Categories: ${categories?.length || 0} records`);
    console.log(`   ✅ Businesses: ${businesses?.length || 0} records`);
    console.log(`   ✅ Deals: ${deals?.length || 0} records`);

    const hasData = categories?.length > 0 && businesses?.length > 0;
    checks.push({ name: "Sample Data", passed: hasData });

    if (!hasData) {
      console.log(
        "   ⚠️  Consider adding sample data for better user experience"
      );
    }
  } catch (error) {
    console.log(`   ❌ Sample data check failed: ${error.message}`);
    checks.push({ name: "Sample Data", passed: false });
  }

  // API Endpoints Check
  console.log("\n📋 6. API Endpoints");
  const apiEndpoints = ["/api/notify-deal-update"];

  let apiCheck = true;
  for (const endpoint of apiEndpoints) {
    try {
      // Check if the file exists
      const fs = await import("fs");
      const path = `server${endpoint}.post.js`;
      if (fs.existsSync(path)) {
        console.log(`   ✅ ${endpoint} - File exists`);
      } else {
        console.log(`   ❌ ${endpoint} - File missing`);
        apiCheck = false;
      }
    } catch (error) {
      console.log(`   ⚠️  ${endpoint} - Could not verify: ${error.message}`);
    }
  }
  checks.push({ name: "API Endpoints", passed: apiCheck });

  // Netlify Functions Check
  console.log("\n📋 7. Netlify Functions");
  try {
    const fs = await import("fs");
    const functionsPath = "netlify/functions";

    if (fs.existsSync(functionsPath)) {
      const functions = fs.readdirSync(functionsPath);
      console.log(`   ✅ Netlify functions directory exists`);
      console.log(`   ✅ Functions found: ${functions.join(", ")}`);
      checks.push({ name: "Netlify Functions", passed: true });
    } else {
      console.log(`   ❌ Netlify functions directory missing`);
      checks.push({ name: "Netlify Functions", passed: false });
    }
  } catch (error) {
    console.log(`   ⚠️  Netlify functions check failed: ${error.message}`);
    checks.push({ name: "Netlify Functions", passed: false });
  }

  // Security Check
  console.log("\n📋 8. Security Configuration");
  let securityCheck = true;

  // Check if we're using HTTPS in production
  const appUrl = process.env.APP_URL || "";
  if (appUrl.startsWith("https://")) {
    console.log("   ✅ HTTPS configured");
  } else {
    console.log("   ⚠️  HTTPS not configured (recommended for production)");
    securityCheck = false;
  }

  // Check for sensitive data in environment
  if (
    process.env.SUPABASE_ANON_KEY &&
    !process.env.SUPABASE_ANON_KEY.includes("your_")
  ) {
    console.log("   ✅ Supabase keys appear to be real (not placeholders)");
  } else {
    console.log("   ❌ Supabase keys appear to be placeholders");
    securityCheck = false;
  }

  checks.push({ name: "Security Configuration", passed: securityCheck });

  // Performance Check
  console.log("\n📋 9. Performance Optimization");
  try {
    const fs = await import("fs");

    // Check if static assets are optimized
    const hasOptimizedImages =
      fs.existsSync("public/images") || fs.existsSync("assets/images");
    console.log(
      `   ${hasOptimizedImages ? "✅" : "⚠️"} Image optimization ${hasOptimizedImages ? "configured" : "recommended"}`
    );

    // Check if caching is configured
    const hasNetlifyToml = fs.existsSync("netlify.toml");
    console.log(
      `   ${hasNetlifyToml ? "✅" : "⚠️"} Netlify configuration ${hasNetlifyToml ? "present" : "missing"}`
    );

    checks.push({
      name: "Performance Optimization",
      passed: hasOptimizedImages && hasNetlifyToml,
    });
  } catch (error) {
    console.log(`   ⚠️  Performance check failed: ${error.message}`);
    checks.push({ name: "Performance Optimization", passed: false });
  }

  // Final Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 PRODUCTION READINESS SUMMARY");
  console.log("=".repeat(60));

  const passedChecks = checks.filter((check) => check.passed).length;
  const totalChecks = checks.length;
  const readinessScore = Math.round((passedChecks / totalChecks) * 100);

  checks.forEach((check) => {
    console.log(`${check.passed ? "✅" : "❌"} ${check.name}`);
  });

  console.log(
    `\n🎯 Readiness Score: ${readinessScore}% (${passedChecks}/${totalChecks} checks passed)`
  );

  if (readinessScore >= 90) {
    console.log("🚀 READY FOR PRODUCTION! Your app looks good to go.");
  } else if (readinessScore >= 70) {
    console.log(
      "⚠️  MOSTLY READY - Address the failing checks before production deployment."
    );
  } else {
    console.log("❌ NOT READY - Several critical issues need to be resolved.");
  }

  console.log("\n📋 Recommended Next Steps:");
  console.log("1. Fix any failing checks above");
  console.log("2. Test the complete user flow manually");
  console.log("3. Set up monitoring and error tracking");
  console.log("4. Configure backup and disaster recovery");
  console.log("5. Set up staging environment for testing");
  console.log("6. Review and test all email templates");
  console.log("7. Verify payment processing (if applicable)");
  console.log("8. Test mobile responsiveness");
  console.log("9. Run performance tests under load");
  console.log("10. Set up analytics and user tracking");

  return { readinessScore, checks };
}

// Run the checklist
runProductionChecklist().catch(console.error);
