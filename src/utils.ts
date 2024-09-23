import { $Enums } from "@prisma/client";

export const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};

export const getExpiredYears = (deadline: Array<Date>) => {
  return deadline.map((item) => new Date(item).getFullYear());
};

export const isAdmin = (role: $Enums.RoleVariant) => {
  return role === $Enums.RoleVariant.Admin;
}

export const isUser = (role: $Enums.RoleVariant) => {
  return role === $Enums.RoleVariant.User;
}