<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1
          class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight"
        >
          PNW Deals Blog
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed"
        >
          Local business insights, deal spotlights, and Pacific Northwest
          community stories
        </p>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-6xl mx-auto">
        <div v-if="loading" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-pnw-orange mx-auto"
          ></div>
          <p class="text-gray-400 mt-4">Loading posts...</p>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-2xl font-bold text-gray-300 mb-4">No posts yet</h3>
          <p class="text-gray-400">
            Check back soon for local business stories and deal highlights!
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <article
            v-for="post in posts"
            :key="post.id"
            class="card-bg rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            <div
              v-if="post.featured_image"
              class="aspect-video overflow-hidden"
            >
              <img
                :src="post.featured_image"
                :alt="post.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="px-3 py-1 bg-pnw-orange/20 text-pnw-orange rounded-full text-sm font-medium"
                >
                  {{ post.category }}
                </span>
                <span class="text-gray-400 text-sm">
                  {{ formatDate(post.published_at) }}
                </span>
              </div>
              <h2 class="text-xl font-bold text-white mb-3 line-clamp-2">
                {{ post.title }}
              </h2>
              <p class="text-gray-300 mb-4 line-clamp-3">
                {{ post.excerpt }}
              </p>
              <NuxtLink
                :to="`/blog/${post.slug}`"
                class="inline-flex items-center text-pnw-orange hover:text-pnw-yellow transition-colors duration-200"
              >
                Read More
                <svg
                  class="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12 space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg transition-colors duration-200',
              currentPage === page
                ? 'bg-pnw-orange text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";

const { $supabase } = useNuxtApp();

const posts = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const postsPerPage = 9;
const totalPosts = ref(0);

const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage));

const formatDate = (date) => {
  return format(new Date(date), "MMM d, yyyy");
};

const fetchPosts = async () => {
  loading.value = true;
  try {
    const { data, error, count } = await $supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(
        (currentPage.value - 1) * postsPerPage,
        currentPage.value * postsPerPage - 1
      );

    if (error) throw error;

    posts.value = data || [];
    totalPosts.value = count || 0;
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});

watch(currentPage, () => {
  fetchPosts();
});

// SEO
useHead({
  title: "Blog - PNW Deals",
  meta: [
    {
      name: "description",
      content:
        "Local business insights, deal spotlights, and Pacific Northwest community stories from PNW Deals.",
    },
  ],
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
