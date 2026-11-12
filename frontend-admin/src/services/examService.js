import API from './api';

export const examService = {
  getExams: async (params = {}) => {
    const res = await API.get('/admin/exams', { params });
    return res.data;
  },
  createExam: async (data) => {
    const res = await API.post('/admin/exams', data);
    return res.data;
  },
  getExam: async (id) => {
    const res = await API.get(`/admin/exams/${id}`);
    return res.data;
  },
  updateExam: async (id, data) => {
    const res = await API.put(`/admin/exams/${id}`, data);
    return res.data;
  },
  deleteExam: async (id) => {
    const res = await API.delete(`/admin/exams/${id}`);
    return res.data;
  },
  getExamSchedule: async (params = {}) => {
    const res = await API.get('/admin/exams/schedule', { params });
    return res.data;
  },
  createExamSchedule: async (data) => {
    const res = await API.post('/admin/exams/schedule', data);
    return res.data;
  },
  calculateGrades: async (data = {}) => {
    const res = await API.post('/admin/exams/calculation', data);
    return res.data;
  },
  getStudentRankings: async (params = {}) => {
    const res = await API.get('/admin/exams/rankings', { params });
    return res.data;
  },
  getReportCards: async (params = {}) => {
    const res = await API.get('/admin/exams/report-cards', { params });
    return res.data;
  },
  getReportCardByStudent: async (id) => {
    const res = await API.get(`/admin/exams/report-cards/${id}`);
    return res.data;
  },
};

export default examService;

