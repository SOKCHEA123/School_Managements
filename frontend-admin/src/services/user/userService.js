import API from '../api';

export const userService = {
  getUsers: async (params = {}) => {
    const res = await API.get('/admin/users', { params });
    return res.data;
  },
  createUser: async (data) => {
    const res = await API.post('/admin/users', data);
    return res.data;
  },
  getUser: async (id) => {
    const res = await API.get(`/admin/users/${id}`);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await API.put(`/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data;
  },
};

export default userService;
