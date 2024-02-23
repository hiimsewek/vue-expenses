export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
};

export type ExpenseByMonth = {
  monthYear: string;
  day: number;
  category: string;
  amount: number;
};

export type GroupedByMonth = ExpenseByMonth[];

export type ExpensesSummary = {
  date: string;
  total: number;
  categories: {
    [category: string]: {
      total: number;
      expenses: (number | string)[];
    };
  }[];
};
