import API from './api';

export const settingsService = {
  getSettings: async (params = {}) => {
    const res = await API.get('/admin/settings', { params });
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await API.post('/admin/settings', data);
    return res.data;
  },
  getSchoolInfo: async () => {
    const res = await API.get('/admin/settings/school-info');
    return res.data;
  },
  updateSchoolInfo: async (data) => {
    const res = await API.put('/admin/settings/school-info', data);
    return res.data;
  },
  getBranding: async () => {
    const res = await API.get('/admin/settings/branding');
    return res.data;
  },
  updateBranding: async (data) => {
    const res = await API.put('/admin/settings/branding', data);
    return res.data;
  },
  getLanguage: async () => {
    const res = await API.get('/admin/settings/language');
    return res.data;
  },
  updateLanguage: async (data) => {
    const res = await API.put('/admin/settings/language', data);
    return res.data;
  },
  getAcademicSettings: async () => {
    const res = await API.get('/admin/settings/academic');
    return res.data;
  },
  updateAcademicSettings: async (data) => {
    const res = await API.put('/admin/settings/academic', data);
    return res.data;
  },
  triggerBackup: async () => {
    const res = await API.post('/admin/settings/backup');
    return res.data;
  },
  getBackupHistory: async () => {
    const res = await API.get('/admin/settings/backup/history');
    return res.data;
  },
  getProfile: async () => {
    const res = await API.get('/admin/settings/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await API.put('/admin/settings/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await API.put('/admin/settings/password', data);
    return res.data;
  },
  getSchoolProfile: async () => {
    const res = await API.get('/admin/school-profile');
    return res.data;
  },
};

export default settingsService;

