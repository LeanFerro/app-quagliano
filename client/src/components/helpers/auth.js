export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const isAuthenticated = () => {
    const token = getToken();
    return token != null;
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };