import Cookies from "js-cookie";

export interface UserData {
  _id: string;
  email: string;
  username?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

//client side

export const setAuthToken = (token: string) => {
  Cookies.set("auth_token", token, {
    expires: 7,
    sameSite: "lax",
  });
};

export const getAuthToken = () => {
  return Cookies.get("auth_token") || null;
};

export const setUserData = (userData: UserData) => {
  Cookies.set("user_data", JSON.stringify(userData), {
    expires: 7,
    sameSite: "lax",
  });
};

export const getUserData = (): UserData | null => {
  const data = Cookies.get("user_data");
  return data ? JSON.parse(data) : null;
};

export const clearAuthCookies = () => {
  Cookies.remove("auth_token");
  Cookies.remove("user_data");
};
