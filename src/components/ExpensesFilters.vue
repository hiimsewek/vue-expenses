<script setup lang="ts">
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import { computed, ref, type Ref, type ComputedRef, watch } from "vue";
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
const { minExpense, maxExpense, uniqueCategories, uniqueMonths } =
  storeToRefs(expensesStore);

const categories: Ref<string[]> = ref([]);
const updateCategoriesFilters = (selectedCategories: string[]) => {
  if (selectedCategories.length > 0) {
    expensesStore.applyFilters({ categories: selectedCategories });
  } else {
    expensesStore.applyFilters({ categories: uniqueCategories.value });
  }
};

const months: Ref<string[]> = ref([]);
const updateMonthsFilters = (selectedMonths: string[]) => {
  if (selectedMonths.length > 0) {
    expensesStore.applyFilters({ months: selectedMonths });
  } else {
    expensesStore.applyFilters({ months: uniqueMonths.value });
  }
};

const rangeValues = ref([minExpense.value, maxExpense.value]);
const amountRange: ComputedRef<[number, number]> = computed(() => {
  const min = Math.min(...rangeValues.value);
  const max = Math.max(...rangeValues.value);

  return [min, max];
});
const updateAmountFilters = () => {
  expensesStore.applyFilters({ amountRange: amountRange.value });
};

watch([minExpense, maxExpense], ([newMin, newMax]) => {
  rangeValues.value = [newMin, newMax];
});

const resetFilters = () => {
  categories.value = [];
  months.value = [];
  rangeValues.value = [minExpense.value, maxExpense.value];

  expensesStore.resetFilters();
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
          aria-label="Categories"
        />
      </div>

      <div class="maxWidth itemSpacing">
        <label for="ms-months">Months</label>
        <MultiSelect
          id="ms-months"
          placeholder="Select months"
          v-model="months"
          @update:modelValue="updateMonthsFilters"
          :options="uniqueMonths"
          display="chip"
          :maxSelectedLabels="3"
          class="maxWidth inputSpacing"
          aria-label="Months"
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
          aria-label="Amount range"
        />
        <div class="rangeText">{{ amountRange[0] }} - {{ amountRange[1] }}</div>
      </div>
      <Button
        v-if="resetActive"
        label="Reset Filters"
        text
        severity="secondary"
        @click="resetFilters"
        aria-label="Reset filters"
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
