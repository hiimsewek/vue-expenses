export const separateDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return { year, month, day };
};

export const getCurrentYear = () => {
  const currentYear = new Date().getFullYear().toString();
  return new Date(currentYear);
};

export const getTodaysDate = () => {
  return new Date();
};

export const getFormattedDate = (date: Date) => {
  const { day, month, year } = separateDate(date);

  return `${month}/${day}/${year}`;
};

export const getMonthAndYear = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  return `${month}/${year}`;
};
