<template>
  <div class="restaurant-category-filter">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <label
        v-for="category in restaurantCategories"
        :key="category.id"
        class="category-option"
        :class="{ selected: isSelected(category.id) }"
      >
        <input
          type="checkbox"
          :value="category.id"
          @change="toggleCategory(category)"
          class="sr-only"
        />
        <div class="category-content">
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-name">{{ category.name }}</div>
          <div v-if="category.description" class="category-description">
            {{ category.description }}
          </div>
        </div>
      </label>
    </div>

    <div v-if="selectedCategories.length > 0" class="selected-summary">
      <p class="text-sm text-gray-400 mt-4">
        Selected: {{ selectedCategories.map((c) => c.name).join(", ") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const { $supabase } = useNuxtApp();

const restaurantCategories = ref([
  {
    id: "coffee",
    name: "Coffee Shops",
    icon: "☕",
    description: "Local roasters & cafes",
  },
  {
    id: "fine-dining",
    name: "Fine Dining",
    icon: "🍽️",
    description: "Upscale restaurants",
  },
  {
    id: "casual",
    name: "Casual Dining",
    icon: "🍕",
    description: "Family restaurants",
  },
  {
    id: "breweries",
    name: "Breweries",
    icon: "🍺",
    description: "Craft beer & taprooms",
  },
  {
    id: "food-trucks",
    name: "Food Trucks",
    icon: "🚚",
    description: "Mobile eats",
  },
  {
    id: "bakeries",
    name: "Bakeries",
    icon: "🥖",
    description: "Fresh baked goods",
  },
  {
    id: "fast-casual",
    name: "Fast Casual",
    icon: "🥪",
    description: "Quick service",
  },
  {
    id: "bars",
    name: "Bars & Pubs",
    icon: "🍻",
    description: "Drinks & pub food",
  },
  {
    id: "asian",
    name: "Asian Cuisine",
    icon: "🥢",
    description: "Asian restaurants",
  },
  {
    id: "mexican",
    name: "Mexican Food",
    icon: "🌮",
    description: "Mexican & Latin",
  },
  { id: "italian", name: "Italian", icon: "🍝", description: "Pizza & pasta" },
  { id: "seafood", name: "Seafood", icon: "🦞", description: "Fresh seafood" },
]);

const selectedCategories = ref([]);

onMounted(async () => {
  // Load actual categories from database if available
  try {
    const { data: dbCategories } = await $supabase
      .from("categories")
      .select("id, name, slug")
      .or(
        "slug.ilike.%food%,slug.ilike.%coffee%,slug.ilike.%restaurant%,slug.ilike.%brew%"
      );

    if (dbCategories && dbCategories.length > 0) {
      // Map database categories to our restaurant categories
      restaurantCategories.value = dbCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: getIconForCategory(cat.slug),
        description: getDescriptionForCategory(cat.slug),
      }));
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    // Keep default categories if database fails
  }

  // Initialize selected categories from props
  selectedCategories.value = props.modelValue || [];
});

const getIconForCategory = (slug) => {
  const iconMap = {
    coffee: "☕",
    "food-dining": "🍽️",
    restaurants: "🍕",
    breweries: "🍺",
    bakeries: "🥖",
    bars: "🍻",
    asian: "🥢",
    mexican: "🌮",
    italian: "🍝",
    seafood: "🦞",
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (slug.includes(key)) return icon;
  }

  return "🍴"; // Default restaurant icon
};

const getDescriptionForCategory = (slug) => {
  const descMap = {
    coffee: "Local roasters & cafes",
    "food-dining": "All dining options",
    restaurants: "Family restaurants",
    breweries: "Craft beer & taprooms",
    bakeries: "Fresh baked goods",
    bars: "Drinks & pub food",
  };

  for (const [key, desc] of Object.entries(descMap)) {
    if (slug.includes(key)) return desc;
  }

  return "Restaurant deals";
};

const isSelected = (categoryId) => {
  return selectedCategories.value.some((cat) => cat.id === categoryId);
};

const toggleCategory = (category) => {
  const index = selectedCategories.value.findIndex(
    (cat) => cat.id === category.id
  );

  if (index > -1) {
    // Remove category
    selectedCategories.value.splice(index, 1);
  } else {
    // Add category
    selectedCategories.value.push(category);
  }

  // Emit the updated selection
  emit("update:modelValue", selectedCategories.value);
};
</script>

<style scoped>
.category-option {
  @apply p-4 rounded-lg backdrop-blur-md transition-all duration-300 cursor-pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.category-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.category-option.selected {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.2),
    rgba(249, 115, 22, 0.2)
  );
  border-color: rgba(239, 68, 68, 0.6);
}

.category-content {
  @apply text-center;
}

.category-icon {
  @apply text-2xl mb-2;
}

.category-name {
  @apply font-semibold text-white text-sm mb-1;
}

.category-description {
  @apply text-xs text-gray-400;
}

.selected-summary {
  @apply mt-4 p-3 rounded-lg;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
