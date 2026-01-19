import api from './axios';
import { API } from './endpoint';

interface RegisterData {
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  role: string;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const registerUser = (data: RegisterData) => {
  return api.post<UserResponse>(API.AUTH.REGISTER, data);
};

export const loginUser = (data: LoginData) => {
  return api.post<LoginResponse>(API.AUTH.LOGIN, data);
};
