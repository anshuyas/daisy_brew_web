import axios from "../axios";
import { API } from "../endpoint";

export const createUser = async (userData: FormData, token?: string | null) => {
  try {
    const response = await axios.post(API.ADMIN.USER.CREATE, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create user failed"
    );
  }
};

export const getUsers = async (token?: string | null) => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_ALL, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch users failed"
    );
  }
};
