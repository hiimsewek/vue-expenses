<script setup lang="ts">
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useExpenses } from "@/stores/expenses";
import { getCurrentYear, getFormattedDate, getTodaysDate } from "@/utils/date";

const date: Ref<Date | null> = ref(null);
const category = ref("");
const amount: Ref<number | null> = ref(null);

const submitDisabled = computed(
  () => !date.value || !category.value || !amount.value
);

const { addExpense } = useExpenses();

const clearForm = () => {
  date.value = null;
  category.value = "";
  amount.value = null;
};

const addExpenseHandler = () => {
  if (!date.value || !category.value || !amount.value) return;

  const formattedCategory =
    category.value.charAt(0).toUpperCase() +
    category.value.slice(1).toLowerCase();

  const data = {
    id: uuidv4() as string,
    date: getFormattedDate(date.value),
    category: formattedCategory,
    amount: amount.value,
  };

  addExpense(data);
  clearForm();
};

const bigDeviceBreakpoint = 1280;
const isBigDevice = ref(window.innerWidth >= bigDeviceBreakpoint);

const formToggled = ref(false);
const toggleForm = () => {
  formToggled.value = !formToggled.value;
};

const toggleIcon = computed(() =>
  formToggled.value ? "pi pi-minus" : "pi pi-plus"
);

const formActive = computed(() => formToggled.value || isBigDevice.value);

onMounted(() => {
  window.addEventListener("resize", handleWindowSizeChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
});

const handleWindowSizeChange = () => {
  if (window.innerWidth >= bigDeviceBreakpoint) {
    isBigDevice.value = true;
  } else {
    isBigDevice.value = false;
  }
};
</script>

<template>
  <div class="outerContainer">
    <Button
      v-if="!isBigDevice"
      :icon="toggleIcon"
      rounded
      class="itemSpacing"
      @click="toggleForm"
    />
    <div v-if="formActive">
      <h2 class="formTitle">Add New Expense</h2>
      <div class="newExpenseFormContainer">
        <FloatLabel class="itemSpacing">
          <Calendar
            v-model="date"
            inputId="newExpenseDate"
            selectOtherMonths
            placeholder="mm/dd/yyyy"
            :min-date="getCurrentYear()"
            :max-date="getTodaysDate()"
          />
          <label for="newExpenseDate">Date</label>
        </FloatLabel>

        <FloatLabel class="itemSpacing">
          <InputText v-model="category" inputId="newExpenseCategory" />
          <label for="newExpenseCategory">Category</label>
        </FloatLabel>

        <FloatLabel class="itemSpacing">
          <InputNumber
            v-model="amount"
            inputId="newExpenseAmount"
            :max-fraction-digits="2"
          />
          <label for="newExpenseAmount">Amount</label>
        </FloatLabel>
        <Button
          label="Add Expense"
          class="itemSpacing"
          :disabled="submitDisabled"
          @click="addExpenseHandler"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.outerContainer {
  margin: 20px 0;
}

.formTitle {
  text-align: center;
  margin: 20px 0;
}

.itemSpacing {
  margin: 20px 0;
}

.newExpenseFormContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 1280px) {
  .newExpenseFormContainer {
    flex-direction: row;
  }
  .itemSpacing {
    margin: 10px;
  }
}
</style>
