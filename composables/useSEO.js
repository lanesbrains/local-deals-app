export const useSEO = (options = {}) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const defaults = {
    title: "PNW Deals - Local Deals in the Pacific Northwest",
    description:
      "Discover the best local deals in the Pacific Northwest. Join our newsletter for exclusive offers and save money on local businesses.",
    image: `${config.public.appUrl}/og-image.jpg`,
    url: `${config.public.appUrl}${route.path}`,
    siteName: "PNW Deals",
    type: "website",
  };

  const seo = { ...defaults, ...options };

  useHead({
    title: seo.title,
    meta: [
      { name: "description", content: seo.description },
      {
        name: "keywords",
        content:
          "deals, discounts, Pacific Northwest, local business, savings, coupons",
      },

      // Open Graph
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:image", content: seo.image },
      { property: "og:url", content: seo.url },
      { property: "og:site_name", content: seo.siteName },
      { property: "og:type", content: seo.type },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
      { name: "twitter:image", content: seo.image },

      // Additional SEO
      { name: "robots", content: "index, follow" },
      { name: "author", content: "PNW Deals" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [{ rel: "canonical", href: seo.url }],
  });

  return seo;
};
