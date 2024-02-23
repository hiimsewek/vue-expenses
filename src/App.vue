<script setup lang="ts">
import NewExpenseForm from "@/components/NewExpenseForm.vue";
import ExpensesTable from "./components/ExpensesTable.vue";
import ExpensesSummary from "./components/ExpensesSummary.vue";
import { useExpenses } from "./stores/expenses";
import { storeToRefs } from "pinia";

const expensesStore = useExpenses();
const { expensesSummary } = storeToRefs(expensesStore);
</script>

<template>
  <div>
    <h1>Expenses</h1>
    <NewExpenseForm />
    <ExpensesTable />
    <ExpensesSummary v-if="expensesSummary" />
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  color: var(--primary-color);
  font-size: 36px;
  padding: 20px 0;
}

@media (min-width: 1280px) {
  h1 {
    font-size: 42px;
  }
}
</style>
