import API from './api';

export const attendanceService = {
  getAttendances: async (params = {}) => {
    const res = await API.get('/admin/attendances', { params });
    return res.data;
  },
  storeBatch: async (data) => {
    const res = await API.post('/admin/attendances/batch', data);
    return res.data;
  },
  getSummary: async (params = {}) => {
    const res = await API.get('/admin/attendances/summary', { params });
    return res.data;
  },
  getTeachersAttendance: async (params = {}) => {
    const res = await API.get('/admin/attendances/teachers', { params });
    return res.data;
  },
  storeTeacherAttendance: async (data) => {
    const res = await API.post('/admin/attendances/teachers', data);
    return res.data;
  },
  updateTeacherAttendance: async (id, data) => {
    const res = await API.put(`/admin/attendances/teachers/${id}`, data);
    return res.data;
  },
  getDaily: async (params = {}) => {
    const res = await API.get('/admin/attendances/daily', { params });
    return res.data;
  },
  getMonthly: async (params = {}) => {
    const res = await API.get('/admin/attendances/monthly', { params });
    return res.data;
  },
  getAbsentLateList: async (params = {}) => {
    const res = await API.get('/admin/attendances/absent-late', { params });
    return res.data;
  },
  getAttendance: async (id) => {
    const res = await API.get(`/admin/attendances/${id}`);
    return res.data;
  },
  updateAttendance: async (id, data) => {
    const res = await API.put(`/admin/attendances/${id}`, data);
    return res.data;
  },
  deleteAttendance: async (id) => {
    const res = await API.delete(`/admin/attendances/${id}`);
    return res.data;
  },
  // --- Attendance Permissions ---
  getPermissions: async (params = {}) => {
    const res = await API.get('/admin/attendances/permissions', { params });
    return res.data;
  },
  createPermission: async (data) => {
    const res = await API.post('/admin/attendances/permissions', data);
    return res.data;
  },
  updatePermission: async (id, data) => {
    const res = await API.put(`/admin/attendances/permissions/${id}`, data);
    return res.data;
  },
  deletePermission: async (id) => {
    const res = await API.delete(`/admin/attendances/permissions/${id}`);
    return res.data;
  },
};

export default attendanceService;

