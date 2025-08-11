import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { format } from "date-fns";

export const handler = async (event, context) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Fetch active users with their categories and subcategories
    const { data: users, error: userError } = await supabase
      .from("users")
      .select(
        `
        user_id, email,
        user_categories (category_id),
        user_subcategories (subcategory_id)
      `
      )
      .eq("subscriptions.status", "active")
      .eq("subscriptions.plan_type", "newsletter");

    if (userError) throw new Error(`Supabase user error: ${userError.message}`);
    if (!users || users.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No active subscribers found" }),
      };
    }

    // Fetch recent deals
    const { data: deals, error: dealError } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, created_at, business_id,
        businesses (id, name, slug, category_id, subcategory_id)
      `
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (dealError) throw new Error(`Supabase deal error: ${dealError.message}`);

    // Send personalized emails
    for (const user of users) {
      const userCategories =
        user.user_categories?.map((c) => c.category_id) || [];
      const userSubcategories =
        user.user_subcategories?.map((s) => s.subcategory_id) || [];

      const personalizedDeals = deals.filter(
        (deal) =>
          deal.businesses &&
          (userCategories.includes(deal.businesses.category_id) ||
            (deal.businesses.subcategory_id &&
              userSubcategories.includes(deal.businesses.subcategory_id)))
      );

      if (personalizedDeals.length === 0) continue;

      const emailContent = `
        <h1 style="color: #F28C38;">Your Weekly PNW Deals!</h1>
        <p>Hi there,</p>
        <p>Here are the latest deals tailored to your interests:</p>
        <ul>
          ${personalizedDeals
            .map(
              (deal) => `
            <li>
              <strong>${deal.title}</strong> at 
              <a href="${process.env.APP_URL}/business/${deal.businesses?.slug || "missing-slug-" + deal.businesses.id}" 
                 style="color: #E8B923;">${deal.businesses?.name}</a>
              <p>${deal.description}</p>
            </li>
          `
            )
            .join("")}
        </ul>
        <p>Want to update your preferences? Visit <a href="${process.env.APP_URL}/preferences" style="color: #E8B923;">your dashboard</a>.</p>
        <p style="color: #4A5568;">&copy; ${format(new Date(), "yyyy")} PNW Deals</p>
      `;

      await resend.emails.send({
        from: "PNW Deals <deals@yourdomain.com>",
        to: user.email,
        subject: `Your PNW Deals Newsletter - ${format(new Date(), "MMMM d, yyyy")}`,
        html: emailContent,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Newsletter sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
