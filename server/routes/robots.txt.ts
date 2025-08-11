export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const hostname = config.public.appUrl || 'https://your-domain.com'
  
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${hostname}/sitemap.xml

# Disallow admin/private areas
Disallow: /business-portal
Disallow: /success
Disallow: /cancel
Disallow: /_nuxt/
Disallow: /api/

# Allow important pages
Allow: /
Allow: /directory
Allow: /business-signup`

  setHeader(event, 'Content-Type', 'text/plain')
  return robots
})