import API from './api';

export const studentService = {
  getStudents: async (params = {}) => {
    const res = await API.get('/admin/students', { params });
    return res.data;
  },
  createStudent: async (data) => {
    const res = await API.post('/admin/students', data);
    return res.data;
  },
  getStudent: async (id) => {
    const res = await API.get(`/admin/students/${id}`);
    return res.data;
  },
  updateStudent: async (id, data) => {
    const res = await API.put(`/admin/students/${id}`, data);
    return res.data;
  },
  patchStudent: async (id, data) => {
    const res = await API.patch(`/admin/students/${id}`, data);
    return res.data;
  },
  deleteStudent: async (id) => {
    const res = await API.delete(`/admin/students/${id}`);
    return res.data;
  },
};

export default studentService;

