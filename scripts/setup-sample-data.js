import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const sampleCategories = [
  { name: "Restaurants & Food", slug: "restaurants-food" },
  { name: "Retail & Shopping", slug: "retail-shopping" },
  { name: "Health & Wellness", slug: "health-wellness" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Services", slug: "services" },
  { name: "Automotive", slug: "automotive" },
  { name: "Home & Garden", slug: "home-garden" },
  { name: "Technology", slug: "technology" },
];

const sampleSubcategories = [
  // Restaurants & Food
  {
    category_slug: "restaurants-food",
    name: "Coffee Shops",
    slug: "coffee-shops",
  },
  { category_slug: "restaurants-food", name: "Pizza", slug: "pizza" },
  {
    category_slug: "restaurants-food",
    name: "Asian Cuisine",
    slug: "asian-cuisine",
  },
  { category_slug: "restaurants-food", name: "Bakeries", slug: "bakeries" },

  // Retail & Shopping
  { category_slug: "retail-shopping", name: "Clothing", slug: "clothing" },
  { category_slug: "retail-shopping", name: "Books", slug: "books" },
  {
    category_slug: "retail-shopping",
    name: "Sporting Goods",
    slug: "sporting-goods",
  },

  // Health & Wellness
  { category_slug: "health-wellness", name: "Gyms", slug: "gyms" },
  { category_slug: "health-wellness", name: "Spas", slug: "spas" },
  {
    category_slug: "health-wellness",
    name: "Yoga Studios",
    slug: "yoga-studios",
  },

  // Entertainment
  {
    category_slug: "entertainment",
    name: "Movie Theaters",
    slug: "movie-theaters",
  },
  { category_slug: "entertainment", name: "Bars & Pubs", slug: "bars-pubs" },
  { category_slug: "entertainment", name: "Live Music", slug: "live-music" },
];

const sampleBusinesses = [
  {
    name: "Pike Place Coffee Co.",
    slug: "pike-place-coffee-co",
    description:
      "Authentic Seattle coffee experience with locally roasted beans and fresh pastries.",
    category_slug: "restaurants-food",
    subcategory_slug: "coffee-shops",
    website: "https://example.com",
    phone: "(206) 555-0123",
    address: "1234 Pike Place, Seattle, WA 98101",
    social_media: {
      twitter: "https://twitter.com/pikeplacecoffee",
      instagram: "https://instagram.com/pikeplacecoffee",
    },
    is_premium: true,
  },
  {
    name: "Northwest Fitness",
    slug: "northwest-fitness",
    description:
      "Full-service gym with state-of-the-art equipment and personal training.",
    category_slug: "health-wellness",
    subcategory_slug: "gyms",
    website: "https://example.com",
    phone: "(206) 555-0124",
    address: "5678 Wellness Ave, Portland, OR 97201",
    social_media: {
      instagram: "https://instagram.com/nwfitness",
    },
    is_premium: false,
  },
  {
    name: "Emerald City Books",
    slug: "emerald-city-books",
    description:
      "Independent bookstore featuring local authors and rare finds.",
    category_slug: "retail-shopping",
    subcategory_slug: "books",
    website: "https://example.com",
    phone: "(206) 555-0125",
    address: "9012 Book Lane, Seattle, WA 98102",
    social_media: {
      twitter: "https://twitter.com/emeraldcitybooks",
    },
    is_premium: false,
  },
  {
    name: "Rainier Pizza Kitchen",
    slug: "rainier-pizza-kitchen",
    description:
      "Wood-fired pizza with locally sourced ingredients and craft beer.",
    category_slug: "restaurants-food",
    subcategory_slug: "pizza",
    website: "https://example.com",
    phone: "(206) 555-0126",
    address: "3456 Rainier Ave, Seattle, WA 98144",
    social_media: {
      instagram: "https://instagram.com/rainierpizza",
      twitter: "https://twitter.com/rainierpizza",
    },
    is_premium: true,
  },
];

const sampleDeals = [
  {
    business_slug: "pike-place-coffee-co",
    title: "20% Off All Coffee Beans",
    description:
      "Get 20% off any bag of our locally roasted coffee beans. Perfect for brewing at home!",
    discount: "20% off",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
  },
  {
    business_slug: "northwest-fitness",
    title: "Free First Month Membership",
    description:
      "New members get their first month absolutely free! Includes access to all equipment and group classes.",
    discount: "First month free",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 60 days from now
  },
  {
    business_slug: "emerald-city-books",
    title: "Buy 2 Get 1 Free Books",
    description:
      "Mix and match any books in the store. Buy any 2 books and get the lowest priced one free!",
    discount: "Buy 2 Get 1 Free",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 14 days from now
  },
  {
    business_slug: "rainier-pizza-kitchen",
    title: "Happy Hour: 50% Off Appetizers",
    description:
      "Every weekday from 3-6 PM, enjoy 50% off all appetizers with any drink purchase.",
    discount: "50% off appetizers",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 90 days from now
  },
];

const sampleBlogPosts = [
  {
    title: "Welcome to PNW Deals: Supporting Local Businesses",
    slug: "welcome-to-pnw-deals",
    excerpt:
      "Discover how PNW Deals is connecting Pacific Northwest communities with amazing local business offers.",
    content: `
      <p>Welcome to PNW Deals, your premier destination for discovering amazing deals from local Pacific Northwest businesses!</p>
      
      <p>Our mission is simple: to strengthen local communities by connecting residents with the incredible businesses that make the Pacific Northwest special. From Seattle's bustling coffee scene to Portland's vibrant food trucks, we're here to help you discover and save on the best local experiences.</p>
      
      <h2>Why Local Matters</h2>
      <p>When you shop local, you're not just getting great products and services – you're investing in your community. Local businesses create jobs, support local families, and contribute to the unique character that makes our region special.</p>
      
      <h2>How It Works</h2>
      <p>Getting started is easy:</p>
      <ul>
        <li>Browse our directory of local businesses</li>
        <li>Sign up for deal notifications in your favorite categories</li>
        <li>Discover new businesses and exclusive offers</li>
        <li>Support your community while saving money</li>
      </ul>
      
      <p>Ready to start exploring? Check out our <a href="/directory">business directory</a> and sign up for personalized deal notifications today!</p>
    `,
    category: "Community",
    featured_image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: "Spotlight: Pike Place Coffee Co.",
    slug: "spotlight-pike-place-coffee-co",
    excerpt:
      "Meet the local coffee roasters bringing authentic Seattle flavor to every cup.",
    content: `
      <p>This week, we're shining the spotlight on Pike Place Coffee Co., a beloved local coffee roaster that's been serving the Seattle community with passion and quality.</p>
      
      <h2>The Story</h2>
      <p>Founded by coffee enthusiasts who believe that great coffee brings people together, Pike Place Coffee Co. has been roasting beans locally for over a decade. Their commitment to quality and community has made them a favorite among locals and visitors alike.</p>
      
      <h2>What Makes Them Special</h2>
      <ul>
        <li>Locally roasted beans with unique Pacific Northwest blends</li>
        <li>Sustainable sourcing practices</li>
        <li>Cozy atmosphere perfect for meetings or quiet work</li>
        <li>Fresh pastries baked daily</li>
        <li>Knowledgeable baristas who are passionate about coffee</li>
      </ul>
      
      <h2>Current Deal</h2>
      <p>Right now, Pike Place Coffee Co. is offering 20% off all coffee beans for home brewing. It's the perfect opportunity to bring their amazing flavors home with you!</p>
      
      <p><a href="/business/pike-place-coffee-co">Visit their profile</a> to learn more and see their current deals.</p>
    `,
    category: "Business Spotlight",
    featured_image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop",
    published: true,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

async function setupSampleData() {
  console.log("🚀 Setting up sample data for PNW Deals\n");
  console.log("=".repeat(50));

  try {
    // 1. Setup Categories
    console.log("\n📋 1. Setting up categories...");
    for (const category of sampleCategories) {
      const { data, error } = await supabase
        .from("categories")
        .upsert(category, { onConflict: "slug" })
        .select();

      if (error) {
        console.log(
          `   ❌ Error creating category ${category.name}: ${error.message}`
        );
      } else {
        console.log(`   ✅ Category: ${category.name}`);
      }
    }

    // 2. Setup Subcategories
    console.log("\n📋 2. Setting up subcategories...");
    for (const subcategory of sampleSubcategories) {
      // Get category ID
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", subcategory.category_slug)
        .single();

      if (categoryData) {
        const { error } = await supabase.from("subcategories").upsert(
          {
            category_id: categoryData.id,
            name: subcategory.name,
            slug: subcategory.slug,
          },
          { onConflict: "slug" }
        );

        if (error) {
          console.log(
            `   ❌ Error creating subcategory ${subcategory.name}: ${error.message}`
          );
        } else {
          console.log(`   ✅ Subcategory: ${subcategory.name}`);
        }
      }
    }

    // 3. Setup Businesses
    console.log("\n📋 3. Setting up businesses...");
    for (const business of sampleBusinesses) {
      // Get category and subcategory IDs
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", business.category_slug)
        .single();

      const { data: subcategoryData } = await supabase
        .from("subcategories")
        .select("id")
        .eq("slug", business.subcategory_slug)
        .single();

      if (categoryData) {
        const businessData = {
          name: business.name,
          slug: business.slug,
          description: business.description,
          category_id: categoryData.id,
          subcategory_id: subcategoryData?.id || null,
          website: business.website,
          phone: business.phone,
          address: business.address,
          social_media: business.social_media,
          is_premium: business.is_premium,
          user_id: null, // Will need to be set manually or via business signup
        };

        const { error } = await supabase
          .from("businesses")
          .upsert(businessData, { onConflict: "slug" });

        if (error) {
          console.log(
            `   ❌ Error creating business ${business.name}: ${error.message}`
          );
        } else {
          console.log(`   ✅ Business: ${business.name}`);
        }
      }
    }

    // 4. Setup Deals
    console.log("\n📋 4. Setting up deals...");
    for (const deal of sampleDeals) {
      // Get business ID
      const { data: businessData } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", deal.business_slug)
        .single();

      if (businessData) {
        const dealData = {
          business_id: businessData.id,
          title: deal.title,
          description: deal.description,
          discount: deal.discount,
          start_date: deal.start_date,
          end_date: deal.end_date,
        };

        const { error } = await supabase.from("deals").insert(dealData);

        if (error) {
          console.log(
            `   ❌ Error creating deal ${deal.title}: ${error.message}`
          );
        } else {
          console.log(`   ✅ Deal: ${deal.title}`);
        }
      }
    }

    // 5. Setup Blog Posts
    console.log("\n📋 5. Setting up blog posts...");
    for (const post of sampleBlogPosts) {
      const { error } = await supabase
        .from("blog_posts")
        .upsert(post, { onConflict: "slug" });

      if (error) {
        console.log(
          `   ❌ Error creating blog post ${post.title}: ${error.message}`
        );
      } else {
        console.log(`   ✅ Blog post: ${post.title}`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Sample data setup complete!");
    console.log("\n📋 What was created:");
    console.log(`   • ${sampleCategories.length} categories`);
    console.log(`   • ${sampleSubcategories.length} subcategories`);
    console.log(`   • ${sampleBusinesses.length} businesses`);
    console.log(`   • ${sampleDeals.length} deals`);
    console.log(`   • ${sampleBlogPosts.length} blog posts`);

    console.log("\n🔧 Next steps:");
    console.log("1. Visit your app to see the sample data");
    console.log("2. Test the deals flow with the sample businesses");
    console.log("3. Create test user accounts and set preferences");
    console.log("4. Test email notifications");
    console.log("5. Customize the sample data for your specific needs");
  } catch (error) {
    console.error("❌ Error setting up sample data:", error);
  }
}

// Run the setup
setupSampleData().catch(console.error);
