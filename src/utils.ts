export const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};

export const getExpiredYears = (deadline: Array<Date>) => {
  return deadline.map((item) => new Date(item).getFullYear());
};
