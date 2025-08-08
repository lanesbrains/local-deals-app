const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");
const { format } = require("date-fns");

exports.handler = async (event, context) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Fetch new/updated deals (last 24 hours)
    const { data: deals, error: dealError } = await supabase
      .from("deals")
      .select(
        `
        id, title, description, expires_at,
        businesses (id, name, slug, category_id)
      `
      )
      .gte(
        "updated_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      );
    if (dealError) throw dealError;

    // Group deals by category
    const dealsByCategory = deals.reduce((acc, deal) => {
      const categoryId = deal.businesses.category_id;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(deal);
      return acc;
    }, {});

    // Fetch users by category
    for (const [categoryId, categoryDeals] of Object.entries(dealsByCategory)) {
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("email, categories")
        .contains("categories", [parseInt(categoryId)]);
      if (userError) throw userError;

      for (const user of users) {
        const emailContent = `
          <h1>New PNW Deals!</h1>
          <p>Here are the latest deals in your favorite categories:</p>
          <ul>
            ${categoryDeals
              .map(
                (deal) => `
              <li>
                <strong>${deal.title}</strong> from <a href="https://your-site.com/business/${deal.businesses.slug}">${deal.businesses.name}</a>
                <p>${deal.description}</p>
                ${deal.expires_at ? `<p>Expires: ${format(new Date(deal.expires_at), "MMM dd, yyyy")}</p>` : ""}
              </li>
            `
              )
              .join("")}
          </ul>
          <p><a href="https://your-site.com/directory">Explore more deals!</a></p>
        `;
        await resend.emails.send({
          from: "PNW Deals <deals@your-domain.com>",
          to: user.email,
          subject: "New Deals in Your Favorite Categories!",
          html: emailContent,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notifications sent" }),
    };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send notifications" }),
    };
  }
};
