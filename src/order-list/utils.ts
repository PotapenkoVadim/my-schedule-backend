export const getExpiredYears = (deadline: Array<Date>) => {
  return deadline.map((item) => new Date(item).getFullYear());
};
