import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/directory', '/sitemap.xml'],
    },
  },

  vite: {
    build: {
      minify: 'esbuild',
    },
  },

  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  
  sitemap: {
    hostname: process.env.APP_URL || 'https://your-domain.com',
    gzip: true,
    routes: async () => {
      // You can add dynamic routes here if needed
      // For example, if you have dynamic business pages
      return [
        '/',
        '/directory',
        '/blog',
        '/business-signup',
        '/business-portal',
        '/success',
        '/cancel'
      ]
    }
  },
  
  compatibilityDate: '2025-08-08',
});