<template>
  <div>
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-pnw-orange"
      ></div>
    </div>

    <div
      v-else-if="!post"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Post Not Found</h1>
        <p class="text-gray-400 mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <NuxtLink to="/blog" class="btn-primary"> Back to Blog </NuxtLink>
      </div>
    </div>

    <article v-else>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <div class="flex items-center justify-center gap-4 mb-6">
              <span
                class="px-4 py-2 bg-pnw-orange/20 text-pnw-orange rounded-full text-sm font-medium"
              >
                {{ post.category }}
              </span>
              <span class="text-gray-300">
                {{ formatDate(post.published_at) }}
              </span>
            </div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {{ post.title }}
            </h1>
            <p class="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              {{ post.excerpt }}
            </p>
          </div>
        </div>
      </section>

      <!-- Featured Image -->
      <section v-if="post.featured_image" class="py-8">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <img
              :src="post.featured_image"
              :alt="post.title"
              class="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg prose-invert max-w-none">
            <div v-html="post.content" class="blog-content"></div>
          </div>

          <!-- Author Info -->
          <div v-if="post.author" class="mt-12 p-6 card-bg rounded-2xl">
            <div class="flex items-center space-x-4">
              <div
                v-if="post.author.avatar"
                class="w-16 h-16 rounded-full overflow-hidden"
              >
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-full bg-pnw-orange flex items-center justify-center"
              >
                <span class="text-white font-bold text-xl">{{
                  post.author.name.charAt(0)
                }}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">
                  {{ post.author.name }}
                </h3>
                <p class="text-gray-400">{{ post.author.bio }}</p>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="mt-12 flex justify-between items-center">
            <NuxtLink to="/blog" class="btn-secondary">
              ← Back to Blog
            </NuxtLink>
            <div class="flex space-x-4">
              <button
                @click="sharePost('twitter')"
                class="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-200"
                title="Share on Twitter"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
              </button>
              <button
                @click="sharePost('facebook')"
                class="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
                title="Share on Facebook"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";

const route = useRoute();
const { $supabase } = useNuxtApp();

const post = ref(null);
const loading = ref(true);

const formatDate = (date) => {
  return format(new Date(date), "MMMM d, yyyy");
};

const sharePost = (platform) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(post.value.title);

  let shareUrl = "";

  if (platform === "twitter") {
    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  } else if (platform === "facebook") {
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  window.open(shareUrl, "_blank", "width=600,height=400");
};

onMounted(async () => {
  try {
    const { data, error } = await $supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:authors(name, bio, avatar)
      `
      )
      .eq("slug", route.params.slug)
      .eq("published", true)
      .single();

    if (error) throw error;
    post.value = data;
  } catch (error) {
    console.error("Error fetching post:", error);
  } finally {
    loading.value = false;
  }
});

// SEO
watchEffect(() => {
  if (post.value) {
    useHead({
      title: `${post.value.title} - PNW Deals Blog`,
      meta: [
        { name: "description", content: post.value.excerpt },
        { property: "og:title", content: post.value.title },
        { property: "og:description", content: post.value.excerpt },
        { property: "og:image", content: post.value.featured_image },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.value.title },
        { name: "twitter:description", content: post.value.excerpt },
        { name: "twitter:image", content: post.value.featured_image },
      ],
    });
  }
});
</script>

<style scoped>
.blog-content {
  @apply text-gray-200 leading-relaxed;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4),
.blog-content :deep(h5),
.blog-content :deep(h6) {
  @apply text-white font-bold mt-8 mb-4;
}

.blog-content :deep(h1) {
  @apply text-3xl;
}
.blog-content :deep(h2) {
  @apply text-2xl;
}
.blog-content :deep(h3) {
  @apply text-xl;
}

.blog-content :deep(p) {
  @apply mb-6;
}

.blog-content :deep(a) {
  @apply text-pnw-orange hover:text-pnw-yellow transition-colors duration-200;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  @apply mb-6 pl-6;
}

.blog-content :deep(li) {
  @apply mb-2;
}

.blog-content :deep(blockquote) {
  @apply border-l-4 border-pnw-orange pl-6 italic text-gray-300 my-6;
}

.blog-content :deep(code) {
  @apply bg-gray-800 px-2 py-1 rounded text-sm;
}

.blog-content :deep(pre) {
  @apply bg-gray-800 p-4 rounded-lg overflow-x-auto my-6;
}

.blog-content :deep(img) {
  @apply rounded-lg shadow-lg my-6;
}
</style>
