<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import FloatLabel from "primevue/floatlabel";
import InputNumber, { type InputNumberInputEvent } from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import { computed, ref, type Ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { storeToRefs } from "pinia";
import { getCurrentYear, getTodaysDate } from "@/utils/date";
import { useExpenses } from "@/stores/expenses";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
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
const { expenses } = storeToRefs(expensesStore);

const itemToEdit = expenses.value.find((expense) => expense.id === props.id);

const date: Ref<string | null> = ref(itemToEdit?.date || null);
const category = ref(itemToEdit?.category);
const amount: Ref<number | null> = ref(itemToEdit?.amount || null);

const onAmountChange = (e: InputNumberInputEvent) => {
  amount.value = e.value as number;
};

const submitDisabled = computed(() => {
  const dateDisabled = !date.value || date.value === itemToEdit?.date;

  const categoryDisabled =
    !category.value || category.value === itemToEdit?.category;
  const amountDisabled = !amount.value || amount.value === itemToEdit?.amount;

  return dateDisabled && categoryDisabled && amountDisabled;
});

const submitEditHandler = () => {
  if (!date.value || !category.value || !amount.value) return;

  const id = uuidv4() as string;

  const data = {
    id,
    date: date.value,
    category: category.value,
    amount: amount.value,
  };

  expensesStore.editExpense(props.id, data);

  props.onClose();
};
</script>

<template>
  <Dialog
    :visible="props.visible"
    @update:visible="props.onClose"
    modal
    header="Edit Expense"
    :draggable="false"
    dismissableMask
    data-test="editExpenseForm"
  >
    <div class="editExpenseFormContainer">
      <FloatLabel class="itemSpacing">
        <Calendar
          v-model="date"
          inputId="editExpenseDate"
          selectOtherMonths
          placeholder="mm/dd/yyyy"
          :min-date="getCurrentYear()"
          :max-date="getTodaysDate()"
          aria-label="Date"
          data-test="editExpenseDate"
        />
        <label for="newExpenseDate">Date</label>
      </FloatLabel>

      <FloatLabel class="itemSpacing">
        <InputText
          v-model="category"
          id="editExpenseCategory"
          aria-label="Category"
          data-test="editExpenseCategory"
        />
        <label for="newExpenseCategory">Category</label>
      </FloatLabel>

      <FloatLabel class="itemSpacing">
        <InputNumber
          v-model="amount"
          inputId="editExpenseAmount"
          :max-fraction-digits="2"
          aria-label="Amount"
          @input="onAmountChange"
          data-test="editExpenseAmount"
        />
        <label for="newExpenseAmount">Amount</label>
      </FloatLabel>
      <Button
        label="Edit Expense"
        class="itemSpacing"
        :disabled="submitDisabled"
        @click="submitEditHandler()"
        aria-label="Edit expense"
        data-test="editExpenseBtn"
      />
    </div>
  </Dialog>
</template>

<style scoped>
.itemSpacing {
  margin: 20px 0;
}

.itemSpacing:last-of-type {
  margin: 20px 0 0 0;
}

.editExpenseFormContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
