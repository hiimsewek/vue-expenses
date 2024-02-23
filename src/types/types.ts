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

export type SummaryItem = {
  date: string;
  total: number;
  categories: {
    [key: string]: {
      total: number;
      expenses: (number | string)[];
    };
  };
};

export type ExpensesSummary = SummaryItem[];
