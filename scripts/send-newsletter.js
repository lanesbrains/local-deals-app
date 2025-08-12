import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { format, subDays } from "date-fns";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWeeklyNewsletter() {
  try {
    console.log("🚀 Starting weekly newsletter send...");

    // Calculate date range for the past week
    const oneWeekAgo = subDays(new Date(), 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    console.log(
      `📅 Fetching deals created since: ${format(oneWeekAgo, "MMM d, yyyy")}`
    );

    // Fetch active subscribers with their ORIGINAL category preferences
    const { data: subscribers, error: subError } = await supabase
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

    if (subError) throw subError;

    console.log(
      `👥 Found ${subscribers?.length || 0} active newsletter subscribers`
    );

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found. Exiting.");
      return;
    }

    // Fetch deals from the past week with business information
    const { data: recentDeals, error: dealError } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, discount, start_date, end_date, created_at,
        businesses(id, name, slug, description, category_id, subcategory_id)
      `
      )
      .gte("created_at", oneWeekAgoISO)
      .order("created_at", { ascending: false });

    if (dealError) throw dealError;

    console.log(
      `🎯 Found ${recentDeals?.length || 0} deals from the past week`
    );

    if (!recentDeals || recentDeals.length === 0) {
      console.log("No new deals from the past week. Exiting.");
      return;
    }

    let emailsSent = 0;
    let emailsSkipped = 0;

    for (const subscriber of subscribers) {
      try {
        // Get user's ORIGINAL category and subcategory preferences
        const userCategories =
          subscriber.user_categories?.map((c) => c.category_id) || [];
        const userSubcategories =
          subscriber.user_subcategories?.map((s) => s.subcategory_id) || [];

        console.log(`📧 Processing subscriber: ${subscriber.email}`);
        console.log(`   Categories: ${userCategories.join(", ") || "none"}`);
        console.log(
          `   Subcategories: ${userSubcategories.join(", ") || "none"}`
        );

        // Filter deals to ONLY those matching user's original preferences
        const personalizedDeals = recentDeals.filter((deal) => {
          const business = deal.businesses;
          if (!business) return false;

          const matchesCategory = userCategories.includes(business.category_id);
          const matchesSubcategory =
            business.subcategory_id &&
            userSubcategories.includes(business.subcategory_id);

          return matchesCategory || matchesSubcategory;
        });

        console.log(`   Matching deals: ${personalizedDeals.length}`);

        // Skip if no relevant deals for this user
        if (personalizedDeals.length === 0) {
          console.log(`   ⏭️  Skipping - no relevant deals`);
          emailsSkipped++;
          continue;
        }

        // Create beautiful email content
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #F28C38, #E8B923); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">📬 Your Weekly PNW Deals</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                ${format(new Date(), "MMMM d, yyyy")}
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi there! 👋
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Here are <strong>${personalizedDeals.length} new deal${personalizedDeals.length === 1 ? "" : "s"}</strong> 
                from the past week, tailored to your interests:
              </p>
              
              <!-- Deals List -->
              <div style="space-y: 20px;">
                ${personalizedDeals
                  .map(
                    (deal) => `
                  <div style="background-color: #2a2a2a; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #F28C38;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                      <h3 style="color: #F28C38; margin: 0; font-size: 18px; font-weight: bold;">
                        ${deal.title}
                      </h3>
                      ${
                        deal.discount
                          ? `
                        <span style="background-color: rgba(242, 140, 56, 0.2); color: #F28C38; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; white-space: nowrap; margin-left: 10px;">
                          ${deal.discount}
                        </span>
                      `
                          : ""
                      }
                    </div>
                    
                    <p style="color: #E8B923; font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">
                      ${deal.businesses.name}
                    </p>
                    
                    <p style="color: #cccccc; line-height: 1.5; margin: 0 0 15px 0;">
                      ${deal.description}
                    </p>
                    
                    ${
                      deal.start_date || deal.end_date
                        ? `
                      <div style="margin-bottom: 15px;">
                        ${deal.start_date ? `<p style="color: #888; font-size: 14px; margin: 0;"><strong>Starts:</strong> ${format(new Date(deal.start_date), "MMM d, yyyy")}</p>` : ""}
                        ${deal.end_date ? `<p style="color: #888; font-size: 14px; margin: 0;"><strong>Ends:</strong> ${format(new Date(deal.end_date), "MMM d, yyyy")}</p>` : ""}
                      </div>
                    `
                        : ""
                    }
                    
                    <a href="${process.env.APP_URL}/business/${deal.businesses.slug}" 
                       style="background: linear-gradient(135deg, #F28C38, #E8B923); color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      View Deal & Business →
                    </a>
                  </div>
                `
                  )
                  .join("")}
              </div>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #333; padding-top: 20px; margin-top: 30px; text-align: center;">
                <p style="color: #888; font-size: 14px; margin-bottom: 15px;">
                  You're receiving this weekly newsletter because you subscribed to deals in your selected categories.
                </p>
                <p style="color: #888; font-size: 14px;">
                  <a href="${process.env.APP_URL}/preferences" style="color: #E8B923; text-decoration: none;">Update your preferences</a> | 
                  <a href="${process.env.APP_URL}/unsubscribe" style="color: #E8B923; text-decoration: none;">Unsubscribe</a>
                </p>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                  &copy; ${format(new Date(), "yyyy")} PNW Deals - Supporting Local Pacific Northwest Businesses
                </p>
              </div>
            </div>
          </div>
        `;

        // Send the email
        await resend.emails.send({
          from: "PNW Deals <deals@pnwdeals.local>",
          to: subscriber.email,
          subject: `📬 Your Weekly PNW Deals - ${personalizedDeals.length} New Deal${personalizedDeals.length === 1 ? "" : "s"} (${format(new Date(), "MMM d")})`,
          html: emailContent,
        });

        console.log(`   ✅ Email sent successfully`);
        emailsSent++;
      } catch (emailError) {
        console.error(
          `   ❌ Failed to send email to ${subscriber.email}:`,
          emailError
        );
      }
    }

    console.log("\n📊 Newsletter Summary:");
    console.log(`   ✅ Emails sent: ${emailsSent}`);
    console.log(`   ⏭️  Emails skipped (no relevant deals): ${emailsSkipped}`);
    console.log(
      `   📅 Date range: ${format(oneWeekAgo, "MMM d")} - ${format(new Date(), "MMM d, yyyy")}`
    );
    console.log(`   🎯 Total deals available: ${recentDeals.length}`);
    console.log("✨ Weekly newsletter completed successfully!");
  } catch (error) {
    console.error("❌ Error sending weekly newsletter:", error);
    throw error;
  }
}

// Run the weekly newsletter
sendWeeklyNewsletter();
