import API from './api';

export const parentService = {
  getParents: async (params = {}) => {
    const res = await API.get('/admin/parents', { params });
    return res.data;
  },
  createParent: async (data) => {
    const res = await API.post('/admin/parents', data);
    return res.data;
  },
  getParent: async (id) => {
    const res = await API.get(`/admin/parents/${id}`);
    return res.data;
  },
  updateParent: async (id, data) => {
    const res = await API.put(`/admin/parents/${id}`, data);
    return res.data;
  },
  deleteParent: async (id) => {
    const res = await API.delete(`/admin/parents/${id}`);
    return res.data;
  },
};

export default parentService;

