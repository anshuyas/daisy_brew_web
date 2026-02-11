export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ADMIN: {
    USER: {
      CREATE: '/api/admin/users',
      GET_ALL: '/api/admin/users',
      GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
      UPDATE: (id: string) => `/api/admin/users/${id}`,
      DELETE: (id: string) => `/api/admin/users/${id}`,
    },
  },
  USER: {
    UPDATE: (id: string) => `/api/user/${id}`, 
  },
}
