import API from './api';

export const teacherService = {
  getTeachers: async (params = {}) => {
    const res = await API.get('/admin/teachers', { params });
    return res.data;
  },
  createTeacher: async (data) => {
    const res = await API.post('/admin/teachers', data);
    return res.data;
  },
  getTeacher: async (id) => {
    const res = await API.get(`/admin/teachers/${id}`);
    return res.data;
  },
  updateTeacher: async (id, data) => {
    const res = await API.put(`/admin/teachers/${id}`, data);
    return res.data;
  },
  patchTeacher: async (id, data) => {
    const res = await API.patch(`/admin/teachers/${id}`, data);
    return res.data;
  },
  deleteTeacher: async (id) => {
    const res = await API.delete(`/admin/teachers/${id}`);
    return res.data;
  },
  assignHomeroom: async (id, classroom_id) => {
    const res = await API.post(`/admin/teachers/${id}/assign-homeroom`, { classroom_id });
    return res.data;
  },
};

export default teacherService;

