<template>
  <div class="interests-container">
    <!-- Main Categories Grid -->
    <div class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-section"
      >
        <!-- Main Category Card -->
        <label class="category-label">
          <input
            type="checkbox"
            :value="{ id: category.id, subcategory_id: null }"
            v-model="selected"
            class="category-checkbox"
            @change="toggleCategory(category.id)"
          />
          <div class="category-content">
            <span class="category-icon">{{
              getCategoryIcon(category.name)
            }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span
              class="checkmark"
              :class="{ visible: isSelected(category.id, null) }"
              >✓</span
            >
            <span
              v-if="
                includeSubcategories &&
                getSubcategoriesForCategory(category.id).length > 0
              "
              class="toggle-subcategories"
              :class="{ 'rotate-180': expandedCategories[category.id] }"
              @click="toggleSubcategories(category.id)"
              role="button"
              tabindex="0"
              @keydown.enter="toggleSubcategories(category.id)"
              @keydown.space.prevent="toggleSubcategories(category.id)"
              aria-label="Toggle subcategories"
            >
              ▼
            </span>
          </div>
        </label>

        <!-- Subcategories -->
        <div
          v-if="
            includeSubcategories &&
            getSubcategoriesForCategory(category.id).length > 0 &&
            expandedCategories[category.id]
          "
          class="subcategories-container"
        >
          <div class="subcategories-grid">
            <label
              v-for="subcategory in getSubcategoriesForCategory(category.id)"
              :key="subcategory.id"
              class="subcategory-tag"
            >
              <input
                type="checkbox"
                :value="{ id: category.id, subcategory_id: subcategory.id }"
                v-model="selected"
                class="subcategory-checkbox"
              />
              <span
                class="subcategory-text"
                :class="{ selected: isSelected(category.id, subcategory.id) }"
              >
                {{ subcategory.name }}
                <span
                  class="subcategory-checkmark"
                  :class="{ visible: isSelected(category.id, subcategory.id) }"
                  >✓</span
                >
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Count -->
    <div v-if="selected.length > 0" class="selected-count">
      <span class="count-badge"
        >{{ selected.length }} interest{{
          selected.length !== 1 ? "s" : ""
        }}
        selected</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useNuxtApp } from "#app";

const props = defineProps({
  modelValue: Array,
  includeSubcategories: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);
const categories = ref([]);
const subcategories = ref([]);
const expandedCategories = ref({});

const selected = computed({
  get: () => props.modelValue || [],
  set: (value) => emit("update:modelValue", value),
});

// Helper function to get icon for category
const getCategoryIcon = (categoryName) => {
  const icons = {
    "Food & Dining": "🍽️",
    Shopping: "🛍️",
    Entertainment: "🎭",
    "Health & Wellness": "💪",
    Services: "🔧",
    "Travel & Tourism": "✈️",
    "Sports & Recreation": "⚽",
    Education: "📚",
    Technology: "💻",
    Automotive: "🚗",
    "Home & Garden": "🏡",
    "Beauty & Personal Care": "💄",
  };
  return icons[categoryName] || "📋";
};

// Helper function to get subcategories for a specific category
const getSubcategoriesForCategory = (categoryId) => {
  return subcategories.value.filter((s) => s.category_id === categoryId);
};

// Check if a category or subcategory is selected
const isSelected = (categoryId, subcategoryId) => {
  return selected.value.some(
    (item) => item.id === categoryId && item.subcategory_id === subcategoryId
  );
};

// Toggle subcategories visibility
const toggleSubcategories = (categoryId) => {
  expandedCategories.value[categoryId] = !expandedCategories.value[categoryId];
};

// Auto-select parent category if a subcategory is selected
const toggleCategory = (categoryId) => {
  if (
    selected.value.some((item) => item.id === categoryId && item.subcategory_id)
  ) {
    const hasSubcategorySelected = selected.value.some(
      (item) => item.id === categoryId && item.subcategory_id
    );
    if (!hasSubcategorySelected) {
      selected.value = selected.value.filter(
        (item) => item.id !== categoryId || item.subcategory_id
      );
    }
  }
};

onMounted(async () => {
  const { $supabase } = useNuxtApp();
  try {
    const { data: catData, error: catError } = await $supabase
      .from("categories")
      .select("id, name")
      .order("name");
    if (catError)
      throw new Error(`Error fetching categories: ${catError.message}`);
    categories.value = catData || [];

    if (props.includeSubcategories) {
      const { data: subData, error: subError } = await $supabase
        .from("subcategories")
        .select("id, name, category_id")
        .order("name");
      if (subError)
        throw new Error(`Error fetching subcategories: ${subError.message}`);
      subcategories.value = subData || [];
    }
  } catch (error) {
    console.error(error.message);
  }
});
</script>

<style scoped>
.interests-container {
  @apply w-full max-w-4xl mx-auto;
}

/* Categories Grid */
.categories-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.category-section {
  @apply relative;
}

/* Main Category Cards */
.category-label {
  @apply block cursor-pointer;
}

.category-checkbox {
  @apply sr-only;
}

.category-content {
  @apply relative bg-pnw-gray/10 hover:bg-pnw-gray/20 border-2 border-pnw-gray/30 hover:border-pnw-orange/50 rounded-lg p-4 flex items-center space-x-3 transition-all duration-300 shadow-sm;
}

.category-checkbox:checked + .category-content {
  @apply bg-pnw-orange/10 border-pnw-orange shadow-lg shadow-pnw-orange/10;
}

.category-icon {
  @apply text-2xl flex-shrink-0;
}

.category-name {
  @apply text-sm font-semibold text-white flex-grow truncate;
}

.checkmark {
  @apply absolute top-2 right-2 text-pnw-orange text-lg font-bold opacity-0 transition-opacity duration-300;
}

.checkmark.visible {
  @apply opacity-100;
}

.toggle-subcategories {
  @apply text-pnw-yellow text-sm transition-transform duration-300 cursor-pointer;
}

.toggle-subcategories:hover {
  @apply text-pnw-orange;
}

/* Subcategories */
.subcategories-container {
  @apply mt-2 p-3 bg-pnw-evergreen/10 rounded-lg border-l-4 border-pnw-orange/30 animate-slide-in;
}

.subcategories-grid {
  @apply flex flex-wrap gap-2;
}

.subcategory-tag {
  @apply cursor-pointer;
}

.subcategory-checkbox {
  @apply sr-only;
}

.subcategory-text {
  @apply inline-flex items-center bg-pnw-gray/20 hover:bg-pnw-gray/30 text-white text-xs px-3 py-1.5 rounded-full transition-all duration-200 border border-pnw-gray/50;
}

.subcategory-checkbox:checked + .subcategory-text {
  @apply bg-pnw-orange/20 text-pnw-orange border-pnw-orange/50;
}

.subcategory-checkmark {
  @apply ml-1 text-pnw-orange text-xs font-bold opacity-0 transition-opacity duration-300;
}

.subcategory-checkmark.visible {
  @apply opacity-100;
}

/* Selected Count */
.selected-count {
  @apply text-center mt-6;
}

.count-badge {
  @apply inline-flex bg-pnw-orange/20 text-pnw-orange px-4 py-2 rounded-full text-sm font-medium border border-pnw-orange/30;
}

/* Animations */
@keyframes slide-in {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out forwards;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .categories-grid {
    @apply grid-cols-1 gap-3;
  }

  .category-content {
    @apply p-3 space-x-2;
  }

  .category-icon {
    @apply text-xl;
  }

  .category-name {
    @apply text-xs;
  }

  .subcategories-container {
    @apply p-2;
  }

  .subcategory-text {
    @apply px-2 py-1 text-xs;
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .categories-grid {
    @apply grid-cols-2 gap-3;
  }
}
</style>
