import API from './api';

export const authService = {
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },
  register: async (data) => {
    const res = await API.post('/auth/register', data);
    return res.data;
  },
  logout: async () => {
    const res = await API.post('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },
};

export default authService;

