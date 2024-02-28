import type { Expense, ExpensesSummary, GroupedByMonth } from "@/types";
import { getDaysInMonth, getMonthAndYear } from "./date";

export const sortAscending = <T>(data: T[], field?: keyof T) => {
  if (!field) return [...data].sort((a, b) => (a < b ? -1 : 1));

  return [...data].sort((a, b) => (a[field] < b[field] ? -1 : 1));
};

export const groupExpensesByMonth = (expenses: Expense[]) => {
  const sortedByDate = sortAscending(expenses, "date");

  const groups = sortedByDate
    .reduce<GroupedByMonth[]>((result, expense) => {
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
    }, [])
    .map((group) => sortAscending(group, "category"));

  return groups;
};

export const prepareSummaryData = (expenses: GroupedByMonth) => {
  return expenses.reduce<ExpensesSummary>((result, item) => {
    const { monthYear, day, category, amount } = item;

    const [month, year] = monthYear.split("/");

    const daysInMonth = getDaysInMonth(new Date(+year, +month, -1));

    let itemIndex = result.findIndex((el) => el.date === monthYear);

    const categoryBaseContent = {
      total: 0,
      expenses: new Array(daysInMonth).fill("-"),
    };

    if (itemIndex === -1) {
      result.push({
        date: monthYear,
        total: 0,
        categories: { [category]: categoryBaseContent },
      });
    }

    itemIndex = result.findIndex((el) => el.date === monthYear);

    if (!result[itemIndex].categories[category]) {
      result[itemIndex].categories[category] = categoryBaseContent;
    }

    const amountValue =
      result[itemIndex].categories[category].expenses[day - 1];

    if (amountValue === "-") {
      result[itemIndex].categories[category].expenses[day - 1] =
        amount.toFixed(2);
    } else {
      console.log({ amount });
      result[itemIndex].categories[category].expenses[day - 1] = (
        +amountValue + amount
      ).toFixed(2);
    }

    result[itemIndex].total = +(result[itemIndex].total + amount).toFixed(2);
    result[itemIndex].categories[category].total = +(
      result[itemIndex].categories[category].total + amount
    ).toFixed(2);

    return result;
  }, []);
};
