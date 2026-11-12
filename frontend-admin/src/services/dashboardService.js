import API from './api';

export const dashboardService = {
  getOverview: async (params = {}) => {
    const res = await API.get('/admin/dashboard/overview', { params });
    return res.data;
  },
  getStudentStatistics: async (params = {}) => {
    const res = await API.get('/admin/dashboard/student-statistics', { params });
    return res.data;
  },
  getTeacherStatistics: async (params = {}) => {
    const res = await API.get('/admin/dashboard/teacher-statistics', { params });
    return res.data;
  },
  getAttendanceStatistics: async (params = {}) => {
    const res = await API.get('/admin/dashboard/attendance-statistics', { params });
    return res.data;
  },
  getRecentActivities: async (params = {}) => {
    const res = await API.get('/admin/dashboard/recent-activities', { params });
    return res.data;
  },
  getDashboardStats: async (params = {}) => {
    const res = await API.get('/admin/dashboard/overview', { params });
    return res.data;
  },
};

export default dashboardService;

