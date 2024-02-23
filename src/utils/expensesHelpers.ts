import type { Expense, ExpensesSummary, GroupedByMonth } from "@/types";
import { getDaysInMonth, getMonthAndYear } from "./date";

export const sortAscending = <T>(data: T[]) =>
  [...data].sort((a, b) => (a < b ? -1 : 1));

export const groupExpensesByMonth = (expenses: Expense[]) => {
  const sortedByDate = sortAscending(expenses);

  return sortedByDate.reduce<GroupedByMonth[]>((result, expense) => {
    const day = new Date(expense.date).getDate();
    const monthYear = getMonthAndYear(new Date(expense.date));

    const item = {
      monthYear,
      day,
      category: expense.category,
      amount: expense.amount,
    };

    const dateIndex = result.findIndex((el) => el[0].monthYear === monthYear);
    if (dateIndex !== -1) {
      result[dateIndex].push(item);
    } else {
      result.push([item]);
    }
    return result;
  }, []);
};

export const prepareSummaryData = (expenses: GroupedByMonth) => {
  return expenses.reduce<ExpensesSummary[]>((result, item) => {
    const { monthYear, day, category, amount } = item;

    const [month, year] = monthYear.split("/");

    const daysInMonth = getDaysInMonth(new Date(year, month, -1));

    let itemIndex = result.findIndex((el) => el.date === monthYear);

    if (itemIndex === -1) {
      result.push({ date: monthYear, total: 0, categories: {} });
    }

    itemIndex = result.findIndex((el) => el.date === monthYear);

    if (!result[itemIndex].categories[category]) {
      result[itemIndex].categories[category] = {
        total: 0,
        expenses: new Array(daysInMonth).fill("-"),
      };
    }

    const amountValue =
      result[itemIndex].categories[category].expenses[day - 1];

    if (amountValue === "-") {
      result[itemIndex].categories[category].expenses[day - 1] = amount;
    } else {
      result[itemIndex].categories[category].expenses[day - 1] += amount;
    }

    result[itemIndex].total += amount;
    result[itemIndex].categories[category].total += amount;

    return result;
  }, []);
};
