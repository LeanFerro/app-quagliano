import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  return token != null;
};

export const logout = () => {
  Cookies.remove("token");
};
