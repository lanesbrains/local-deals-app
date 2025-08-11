export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const hostname = config.public.appUrl || 'https://your-domain.com'
  
  // Static routes
  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/directory', changefreq: 'daily', priority: 0.9 },
    { url: '/business-signup', changefreq: 'monthly', priority: 0.8 },
    { url: '/business-portal', changefreq: 'weekly', priority: 0.7 },
    { url: '/success', changefreq: 'never', priority: 0.3 },
    { url: '/cancel', changefreq: 'never', priority: 0.3 }
  ]
  
  // You can add dynamic routes here by fetching from your database
  // For example, business pages:
  // const { data: businesses } = await supabase.from('businesses').select('slug')
  // const businessRoutes = businesses?.map(business => ({
  //   url: `/business/${business.slug}`,
  //   changefreq: 'weekly',
  //   priority: 0.6
  // })) || []
  
  const allRoutes = [...staticRoutes] // Add ...businessRoutes when you have dynamic routes
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${hostname}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})