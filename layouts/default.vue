<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (title) => `${title ? `${title} | ` : ''}PNW Deals - Local Offers & Directory`,
  meta: [
    { name: 'description', content: 'Discover the best local deals in the Pacific Northwest. Join our $1/month newsletter or list your business for $5/month!' },
    { name: 'keywords', content: 'PNW deals, Pacific Northwest, local businesses, newsletter, discounts' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
    { name: 'robots', content: 'index, follow' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
});

// Dynamically set canonical URL based on current route
const route = useRoute();
const canonicalUrl = computed(() => `${useRuntimeConfig().public.appUrl}${route.fullPath}`);

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
});
</script>