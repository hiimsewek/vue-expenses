export const getStoredData = <T>(key: string, fallback: T): T => {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
};

export const storeData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};
