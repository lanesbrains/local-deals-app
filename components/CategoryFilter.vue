<template>
  <div class="space-y-4">
    <div v-for="category in categories" :key="category.id">
      <label class="flex items-center text-gray-300">
        <input
          type="checkbox"
          :value="{ id: category.id, subcategory_id: null }"
          v-model="selected"
          class="mr-2"
        />
        {{ category.name }}
      </label>
      <div class="ml-6 space-y-2" v-if="includeSubcategories">
        <label v-for="subcategory in subcategories.filter(s => s.category_id === category.id)" :key="subcategory.id" class="flex items-center text-gray-400">
          <input
            type="checkbox"
            :value="{ id: category.id, subcategory_id: subcategory.id }"
            v-model="selected"
            class="mr-2"
          />
          {{ subcategory.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  modelValue: Array,
  includeSubcategories: Boolean,
});
const emit = defineEmits(['update:modelValue']);
const categories = ref([]);
const subcategories = ref([]);

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

onMounted(async () => {
  const { $supabase } = useNuxtApp();
  const { data: catData, error: catError } = await $supabase.from('categories').select('id, name');
  if (catError) console.error('Error fetching categories:', catError);
  else categories.value = catData || [];

  if (props.includeSubcategories) {
    const { data: subData, error: subError } = await $supabase.from('subcategories').select('id, name, category_id');
    if (subError) console.error('Error fetching subcategories:', subError);
    else subcategories.value = subData || [];
  }
});
</script>