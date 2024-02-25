import { computed, reactive, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Expense, ExpensesSummary } from "@/types";
import { getStoredData, storeData } from "@/utils/storage";
import { getMonthAndYear } from "@/utils/date";
import {
  groupExpensesByMonth,
  prepareSummaryData,
  sortAscending,
} from "@/utils/expensesHelpers";

const STORE_KEY = "expenses";

export const useExpenses = defineStore(STORE_KEY, () => {
  const initialState = getStoredData<Expense[]>(STORE_KEY, []);

  const expenses = reactive(initialState);

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

  const uniqueCategories = computed(() => {
    const data = expenses.reduce<Set<string>>((result, expense) => {
      result.add(expense.category);
      return result;
    }, new Set());

    return sortAscending([...data]);
  });

  const uniqueMonths = computed(() => {
    const data = expenses.reduce<Set<string>>((result, expense) => {
      const formattedDate = getMonthAndYear(new Date(expense.date));

      result.add(formattedDate);
      return result;
    }, new Set());

    return sortAscending([...data]);
  });

  const minExpense = computed(() => {
    if (expenses.length === 0) return 0.1;

    const amounts = expenses.reduce<number[]>((result, expense) => {
      result.push(expense.amount);
      return result;
    }, []);

    return Math.min(...amounts);
  });

  const maxExpense = computed(() => {
    if (expenses.length === 0) return Infinity;

    const amounts = expenses.reduce<number[]>((result, expense) => {
      result.push(expense.amount);
      return result;
    }, []);

    return Math.max(...amounts);
  });

  const filters = ref({
    categories: uniqueCategories.value,
    months: uniqueMonths.value,
    amountRange: [minExpense.value, maxExpense.value],
  });

  const filteredExpenses = computed(() => {
    return expenses.filter((expense) => {
      const categories =
        filters.value.categories.length > 0
          ? filters.value.categories
          : uniqueCategories.value;
      const months =
        filters.value.months.length > 0
          ? filters.value.months
          : uniqueMonths.value;

      const includesCategory = categories.includes(expense.category);
      const includesMonth = months.includes(
        getMonthAndYear(new Date(expense.date))
      );
      const isWithinRange =
        expense.amount >= filters.value.amountRange[0] &&
        expense.amount <= filters.value.amountRange[1];

      return includesCategory && includesMonth && isWithinRange;
    });
  });

  const total = computed(() => {
    return filteredExpenses.value.reduce(
      (result, expense) => (result += expense.amount),
      0
    );
  });

  const expensesSummary: Ref<ExpensesSummary | null> = ref(null);

  const generateSummary = () => {
    const data = groupExpensesByMonth(filteredExpenses.value).flat();
    const summary = prepareSummaryData(data);
    expensesSummary.value = summary;
  };

  const clearSummary = () => {
    expensesSummary.value = null;
  };

  return {
    expenses,
    filteredExpenses,
    total,
    addExpense,
    deleteExpense,
    editExpense,
    filters,
    uniqueCategories,
    uniqueMonths,
    minExpense,
    maxExpense,
    expensesSummary,
    generateSummary,
    clearSummary,
  };
});
