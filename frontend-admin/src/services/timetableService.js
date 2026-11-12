import API from './api';

export const timetableService = {
  getTimetables: async (params = {}) => {
    const res = await API.get('/admin/timetables', { params });
    return res.data;
  },
  createTimetable: async (data) => {
    const res = await API.post('/admin/timetables', data);
    return res.data;
  },
  updateTimetable: async (id, data) => {
    const res = await API.put(`/admin/timetables/${id}`, data);
    return res.data;
  },
  deleteTimetable: async (id) => {
    const res = await API.delete(`/admin/timetables/${id}`);
    return res.data;
  },
  getClassTimetable: async (params = {}) => {
    const res = await API.get('/admin/timetable/class', { params });
    return res.data;
  },
  getTeacherTimetable: async (params = {}) => {
    const res = await API.get('/admin/timetable/teacher', { params });
    return res.data;
  },
  getRoomSchedule: async (params = {}) => {
    const res = await API.get('/admin/timetable/rooms', { params });
    return res.data;
  },
  getExamTimetable: async (params = {}) => {
    const res = await API.get('/admin/timetable/exams', { params });
    return res.data;
  },
};

export default timetableService;

