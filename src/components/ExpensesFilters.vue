<script setup lang="ts">
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import { computed, ref, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { useExpenses } from "@/stores/expenses";
import Sidebar from "primevue/sidebar";
import Button from "primevue/button";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

const expensesStore = useExpenses();
const { filters, maxExpense, minExpense, uniqueCategories, uniqueMonths } =
  storeToRefs(expensesStore);

const categories: Ref<string[]> = ref([]);
const updateCategoriesFilters = (selectedCategories: string[]) => {
  if (selectedCategories.length > 0) {
    filters.value.categories = selectedCategories;
  } else {
    filters.value.categories = uniqueCategories.value;
  }
};

const months: Ref<string[]> = ref([]);
const updateMonthsFilters = (selectedMonths: string[]) => {
  if (selectedMonths.length > 0) {
    filters.value.months = selectedMonths;
  } else {
    filters.value.months = uniqueMonths.value;
  }
};

const rangeValues = ref([minExpense.value, maxExpense.value]);
const amountRange = computed(() => {
  const min = Math.min(...rangeValues.value);
  const max = Math.max(...rangeValues.value);

  return [min, max];
});
const updateAmountFilters = () => {
  filters.value.amountRange = amountRange.value;
};

const resetFilters = () => {
  categories.value = [];
  months.value = [];
  rangeValues.value = [minExpense.value, maxExpense.value];

  filters.value = {
    categories: categories.value,
    months: months.value,
    amountRange: amountRange.value,
  };
};

const resetActive = computed(() => {
  const categoriesEmpty = categories.value.length === 0;
  const monthsEmpty = months.value.length === 0;
  const baseRange =
    amountRange.value[0] === minExpense.value &&
    amountRange.value[1] === maxExpense.value;

  return !categoriesEmpty || !monthsEmpty || !baseRange;
});
</script>

<template>
  <Sidebar
    header="Expense Filters"
    position="right"
    :visible="props.visible"
    @update:visible="props.onClose"
  >
    <div class="filtersContainer">
      <div class="maxWidth itemSpacing">
        <label for="ms-categories">Categories</label>
        <MultiSelect
          id="ms-categories"
          v-model="categories"
          @update:modelValue="updateCategoriesFilters"
          :options="uniqueCategories"
          placeholder="Select categories"
          display="chip"
          :maxSelectedLabels="3"
          class="maxWidth inputSpacing"
        />
      </div>

      <div class="maxWidth itemSpacing">
        <label for="ms-categories">Months</label>
        <MultiSelect
          placeholder="Select months"
          v-model="months"
          @update:modelValue="updateMonthsFilters"
          :options="uniqueMonths"
          display="chip"
          :maxSelectedLabels="3"
          class="maxWidth inputSpacing"
        />
      </div>

      <div class="maxWidth itemSpacing">
        <label for="slider-amount">Amount</label>
        <Slider
          id="slider-amount"
          v-model="rangeValues"
          @slideend="updateAmountFilters"
          range
          :min="minExpense"
          :max="maxExpense"
          :step="0.1"
          class="maxWidth inputSpacing"
        />
        <div class="rangeText">{{ amountRange[0] }} - {{ amountRange[1] }}</div>
      </div>
      <Button
        v-if="resetActive"
        label="Reset Filters"
        text
        severity="secondary"
        @click="resetFilters"
      />
    </div>
  </Sidebar>
</template>

<style scoped>
.filtersContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.maxWidth {
  width: 100%;
}

.itemSpacing {
  margin: 10px 0;
}

.itemSpacing {
  margin: 20px 0;
}

.inputSpacing {
  margin: 10px 0;
}
.rangeText {
  text-align: center;
}
</style>
