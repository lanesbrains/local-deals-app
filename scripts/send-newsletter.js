import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendNewsletter() {
  try {
    // Fetch active subscribers with their categories and subcategories
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
    if (subError) throw subError;

    // Fetch deals with business information
    const { data: deals, error: dealError } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, start_date, end_date,
        businesses(id, name, slug, description, category_id, subcategory_id)
      `
      )
      .order("created_at", { ascending: false });
    if (dealError) throw dealError;

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

      if (relevantDeals.length === 0) continue;

      const emailContent = `
        <h1>Your PNW Deals Newsletter</h1>
        <p>Here are the latest deals tailored for you:</p>
        <ul>
          ${relevantDeals
            .map(
              (deal) => `
                <li>
                  <h3>${deal.title}</h3>
                  <p><strong>Business:</strong> ${deal.businesses.name}</p>
                  <p><strong>Business Description:</strong> ${deal.businesses.description || 'No description available'}</p>
                  <p><strong>Deal:</strong> ${deal.description}</p>
                  ${deal.start_date ? `<p><strong>Starts:</strong> ${new Date(deal.start_date).toLocaleDateString()}</p>` : ''}
                  ${deal.end_date ? `<p><strong>Ends:</strong> ${new Date(deal.end_date).toLocaleDateString()}</p>` : ''}
                  <a href="${process.env.APP_URL}/business/${deal.businesses.slug}">View Deal</a>
                </li>
              `
            )
            .join("")}
        </ul>
        <p>Thanks for subscribing to PNW Deals!</p>
      `;

      await resend.emails.send({
        from: "deals@pnwdeals.local",
        to: user.email,
        subject: "Your Weekly PNW Deals",
        html: emailContent,
      });
      console.log(`Newsletter sent to ${user.email}`);
    }
    console.log("Newsletter sent successfully");
  } catch (error) {
    console.error("Error sending newsletter:", error);
  }
}

sendNewsletter();
