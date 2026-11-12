import API from './api';

export const portalService = {
  getMyAttendance: async (params = {}) => {
    const res = await API.get('/portal/my-attendance', { params });
    return res.data;
  },
  getMyGrades: async (params = {}) => {
    const res = await API.get('/portal/my-grades', { params });
    return res.data;
  },
  getMyProfile: async () => {
    const res = await API.get('/portal/my-profile');
    return res.data;
  },
};

export default portalService;

