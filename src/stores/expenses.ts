import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import type { Expense } from "@/types";
import { getStoredData, storeData } from "@/utils/storage";

const STORE_KEY = "expenses";

export const useExpenses = defineStore(STORE_KEY, () => {
  const initialState = getStoredData<Expense[]>(STORE_KEY, []);

  const expenses = reactive(initialState);
  const total = computed(() => {
    return expenses.reduce((result, expense) => (result += expense.amount), 0);
  });

  const addExpense = (item: Expense) => {
    expenses.push(item);
    storeData(STORE_KEY, expenses);
  };

  function deleteExpense(id: string) {
    const itemIdx = expenses.findIndex((el: Expense) => el.id === id);

    if (itemIdx === -1) return;
    expenses.splice(itemIdx, 1);
    storeData(STORE_KEY, expenses);
  }

  const editExpense = (id: string, data: Expense) => {
    const itemIdx = expenses.findIndex((el: Expense) => el.id === id);

    if (itemIdx === -1) return;
    expenses.splice(itemIdx, 1, data);
    storeData<Expense[]>(STORE_KEY, expenses);
  };

  return { expenses, addExpense, total, deleteExpense, editExpense };
});
