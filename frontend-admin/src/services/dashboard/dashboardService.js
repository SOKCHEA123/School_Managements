import API from '../api';

export const dashboardService = {
  getOverview: async () => {
    const res = await API.get('/admin/dashboard/overview');
    return res.data;
  },
  getStudentStatistics: async () => {
    const res = await API.get('/admin/dashboard/student-statistics');
    return res.data;
  },
  getTeacherStatistics: async () => {
    const res = await API.get('/admin/dashboard/teacher-statistics');
    return res.data;
  },
  getAttendanceStatistics: async () => {
    const res = await API.get('/admin/dashboard/attendance-statistics');
    return res.data;
  },
  getRecentActivities: async () => {
    const res = await API.get('/admin/dashboard/recent-activities');
    return res.data;
  },
};

export default dashboardService;
