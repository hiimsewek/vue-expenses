import { reactive } from "vue";
import { defineStore } from "pinia";
import type { Expense } from "@/types";
import { getStoredData, storeData } from "@/utils/storage";

const initialExpenses = getStoredData<Expense[]>("expenses", []);

export const useExpenses = defineStore("expenses", () => {
  const expenses = reactive(initialExpenses);

  const addExpense = (item: Expense) => {
    expenses.push(item);

    const storedExpenses = getStoredData<Expense[]>("expenses", []);
    storeData("expenses", [...storedExpenses, item]);
  };
  return { expenses, addExpense };
});
