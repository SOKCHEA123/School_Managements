import API from '../api';

export const portalService = {
  getProfile: async () => {
    const res = await API.get('/portal/my-profile');
    return res.data;
  },
  getGrades: async () => {
    const res = await API.get('/portal/my-grades');
    return res.data;
  },
  getAttendance: async () => {
    const res = await API.get('/portal/my-attendance');
    return res.data;
  },
};

export default portalService;
