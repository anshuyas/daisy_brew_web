export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ADMIN: {
    USER: {
      CREATE: '/admin/users',
      GET_ALL: '/admin/users',
      GET_BY_ID: (id: string) => `/admin/users/${id}`,
      UPDATE: (id: string) => `/admin/users/${id}`,
      DELETE: (id: string) => `/admin/users/${id}`,
    },
  },
  USER: {
    UPDATE: (id: string) => `/user/${id}`, 
  },
}
