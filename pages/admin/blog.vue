<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1
          class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight"
        >
          Blog Admin
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed"
        >
          Manage blog posts and content
        </p>
      </div>
    </section>

    <!-- Login Section -->
    <section v-if="!user" class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
      <div class="max-w-md mx-auto">
        <div class="card-bg p-8 rounded-2xl shadow-2xl">
          <h2 class="text-3xl font-bold text-pnw-orange mb-6 text-center">
            Admin Login
          </h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-6">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-input" required />
            </div>
            <div class="mb-6">
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-input"
                required
              />
            </div>
            <AnimatedButton type="submit" :loading="loading" class="w-full">
              Log In
            </AnimatedButton>
          </form>
        </div>
      </div>
    </section>

    <!-- Admin Dashboard -->
    <div v-else>
      <!-- Posts Management -->
      <section class="py-16 px-4 sm:px-6 lg:px-8 section-bg">
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold text-pnw-orange">Blog Posts</h2>
            <AnimatedButton @click="showCreateForm = true">
              Create New Post
            </AnimatedButton>
          </div>

          <!-- Posts List -->
          <div class="space-y-4">
            <div
              v-for="post in posts"
              :key="post.id"
              class="card-bg p-6 rounded-2xl shadow-2xl flex justify-between items-center"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-bold text-white">{{ post.title }}</h3>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      post.published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400',
                    ]"
                  >
                    {{ post.published ? "Published" : "Draft" }}
                  </span>
                </div>
                <p class="text-gray-300 mb-2">{{ post.excerpt }}</p>
                <p class="text-gray-400 text-sm">
                  {{ post.category }} • {{ formatDate(post.created_at) }}
                </p>
              </div>
              <div class="flex space-x-2 ml-4">
                <button
                  @click="editPost(post)"
                  class="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="deletePost(post.id)"
                  class="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Create/Edit Post Modal -->
      <div
        v-if="showCreateForm || editingPost"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="card-bg p-8 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-pnw-orange">
              {{ editingPost ? "Edit Post" : "Create New Post" }}
            </h3>
            <button
              @click="closeForm"
              class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg
                class="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="savePost" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="form-label">Title</label>
                <input
                  v-model="postForm.title"
                  type="text"
                  class="form-input"
                  required
                />
              </div>
              <div>
                <label class="form-label">Slug</label>
                <input
                  v-model="postForm.slug"
                  type="text"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div>
              <label class="form-label">Excerpt</label>
              <textarea
                v-model="postForm.excerpt"
                class="form-input"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="form-label">Category</label>
                <select v-model="postForm.category" class="form-input" required>
                  <option value="">Select Category</option>
                  <option value="Business Spotlight">Business Spotlight</option>
                  <option value="Deal Alert">Deal Alert</option>
                  <option value="Local News">Local News</option>
                  <option value="Community">Community</option>
                  <option value="Tips & Guides">Tips & Guides</option>
                </select>
              </div>
              <div>
                <label class="form-label">Featured Image URL</label>
                <input
                  v-model="postForm.featured_image"
                  type="url"
                  class="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label class="form-label">Content</label>
              <textarea
                v-model="postForm.content"
                class="form-input"
                rows="12"
                placeholder="Write your blog post content here..."
                required
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="postForm.published"
                  type="checkbox"
                  class="mr-2"
                />
                <span class="text-gray-300">Publish immediately</span>
              </label>
            </div>

            <div class="flex justify-end space-x-4">
              <button type="button" @click="closeForm" class="btn-secondary">
                Cancel
              </button>
              <AnimatedButton type="submit" :loading="saving">
                {{ editingPost ? "Update Post" : "Create Post" }}
              </AnimatedButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";

const { $supabase } = useNuxtApp();

const user = ref(null);
const email = ref("");
const password = ref("");
const posts = ref([]);
const loading = ref(false);
const saving = ref(false);
const showCreateForm = ref(false);
const editingPost = ref(null);

const postForm = ref({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  featured_image: "",
  published: false,
});

const formatDate = (date) => {
  return format(new Date(date), "MMM d, yyyy");
};

const handleLogin = async () => {
  loading.value = true;
  try {
    const { error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;

    // Check if user is admin
    const {
      data: { user: authUser },
    } = await $supabase.auth.getUser();
    const { data: profile } = await $supabase
      .from("users")
      .select("is_admin")
      .eq("user_id", authUser.id)
      .single();

    if (!profile?.is_admin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    user.value = authUser;
    await fetchPosts();
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

const fetchPosts = async () => {
  try {
    const { data, error } = await $supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    posts.value = data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const editPost = (post) => {
  editingPost.value = post;
  postForm.value = { ...post };
  showCreateForm.value = false;
};

const closeForm = () => {
  showCreateForm.value = false;
  editingPost.value = null;
  postForm.value = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
    published: false,
  };
};

const savePost = async () => {
  saving.value = true;
  try {
    const postData = {
      ...postForm.value,
      published_at: postForm.value.published ? new Date().toISOString() : null,
    };

    if (editingPost.value) {
      const { error } = await $supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingPost.value.id);
      if (error) throw error;
    } else {
      const { error } = await $supabase.from("blog_posts").insert(postData);
      if (error) throw error;
    }

    await fetchPosts();
    closeForm();
    alert("Post saved successfully!");
  } catch (error) {
    alert("Error saving post: " + error.message);
  } finally {
    saving.value = false;
  }
};

const deletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const { error } = await $supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;
    await fetchPosts();
    alert("Post deleted successfully!");
  } catch (error) {
    alert("Error deleting post: " + error.message);
  }
};

onMounted(async () => {
  const {
    data: { user: authUser },
  } = await $supabase.auth.getUser();
  if (authUser) {
    // Check if user is admin
    const { data: profile } = await $supabase
      .from("users")
      .select("is_admin")
      .eq("user_id", authUser.id)
      .single();

    if (profile?.is_admin) {
      user.value = authUser;
      await fetchPosts();
    }
  }
});

// Auto-generate slug from title
watch(
  () => postForm.value.title,
  (newTitle) => {
    if (newTitle && !editingPost.value) {
      postForm.value.slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
  }
);
</script>
