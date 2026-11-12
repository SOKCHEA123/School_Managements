import API from './api';

export const communicationService = {
  getOverview: async (params = {}) => {
    const res = await API.get('/admin/communication', { params });
    return res.data;
  },
  getAnnouncements: async (params = {}) => {
    const res = await API.get('/admin/communication/announcements', { params });
    return res.data;
  },
  createAnnouncement: async (data) => {
    const res = await API.post('/admin/communication/announcements', data);
    return res.data;
  },
  getAnnouncement: async (id) => {
    const res = await API.get(`/admin/communication/announcements/${id}`);
    return res.data;
  },
  updateAnnouncement: async (id, data) => {
    const res = await API.put(`/admin/communication/announcements/${id}`, data);
    return res.data;
  },
  deleteAnnouncement: async (id) => {
    const res = await API.delete(`/admin/communication/announcements/${id}`);
    return res.data;
  },
  markAnnouncementRead: async (id) => {
    const res = await API.put(`/admin/communication/announcements/${id}/read`);
    return res.data;
  },
  getNotifications: async (params = {}) => {
    const res = await API.get('/admin/communication/notifications', { params });
    return res.data;
  },
  createNotification: async (data) => {
    const res = await API.post('/admin/communication/notifications', data);
    return res.data;
  },
  markNotificationRead: async (id) => {
    const res = await API.put(`/admin/communication/notifications/${id}/read`);
    return res.data;
  },
  getEvents: async (params = {}) => {
    const res = await API.get('/admin/communication/events', { params });
    return res.data;
  },
  createEvent: async (data) => {
    const res = await API.post('/admin/communication/events', data);
    return res.data;
  },
  updateEvent: async (id, data) => {
    const res = await API.put(`/admin/communication/events/${id}`, data);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await API.delete(`/admin/communication/events/${id}`);
    return res.data;
  },
  getAcademicCalendar: async (params = {}) => {
    const res = await API.get('/admin/communication/calendar', { params });
    return res.data;
  },
  createCalendarEvent: async (data) => {
    const res = await API.post('/admin/communication/calendar', data);
    return res.data;
  },
  updateCalendarEvent: async (id, data) => {
    const res = await API.put(`/admin/communication/calendar/${id}`, data);
    return res.data;
  },
  deleteCalendarEvent: async (id) => {
    const res = await API.delete(`/admin/communication/calendar/${id}`);
    return res.data;
  },
};

export default communicationService;

