import API from './api';

export const gradeService = {
  getGrades: async (params = {}) => {
    const res = await API.get('/admin/grades', { params });
    return res.data;
  },
  storeBatch: async (data) => {
    const res = await API.post('/admin/grades/batch', data);
    return res.data;
  },
  lockGrades: async (data) => {
    const res = await API.post('/admin/grades/lock', data);
    return res.data;
  },
  getRankings: async (params = {}) => {
    const res = await API.get('/admin/grades/rankings', { params });
    return res.data;
  },
  getGrade: async (id) => {
    const res = await API.get(`/admin/grades/${id}`);
    return res.data;
  },
  updateGrade: async (id, data) => {
    const res = await API.put(`/admin/grades/${id}`, data);
    return res.data;
  },
  deleteGrade: async (id) => {
    const res = await API.delete(`/admin/grades/${id}`);
    return res.data;
  },
};

export default gradeService;

