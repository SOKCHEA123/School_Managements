import API from './api';

export const reportService = {
  getOverview: async (params = {}) => {
    const res = await API.get('/admin/reports', { params });
    return res.data;
  },
  getStudentReports: async (params = {}) => {
    const res = await API.get('/admin/reports/students', { params });
    return res.data;
  },
  getTeacherReports: async (params = {}) => {
    const res = await API.get('/admin/reports/teachers', { params });
    return res.data;
  },
  getAttendanceReports: async (params = {}) => {
    const res = await API.get('/admin/reports/attendance', { params });
    return res.data;
  },
  getExamReports: async (params = {}) => {
    const res = await API.get('/admin/reports/exams', { params });
    return res.data;
  },
  getFinanceReports: async (params = {}) => {
    const res = await API.get('/admin/reports/finance', { params });
    return res.data;
  },
  exportReport: async (data = {}) => {
    const res = await API.post('/admin/reports/export', data);
    return res.data;
  },
  getExportReport: async (params = {}) => {
    const res = await API.get('/admin/reports/export', { params });
    return res.data;
  },
  exportByFormat: async (format, params = {}) => {
    const res = await API.get(`/admin/reports/export/${format}`, { params });
    return res.data;
  },
};

export default reportService;

