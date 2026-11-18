import API from '../api';

export const academicService = {
  // --- Classrooms ---
  getClassrooms: async () => {
    const res = await API.get('/admin/classrooms');
    return res.data;
  },
  createClassroom: async (data) => {
    const res = await API.post('/admin/classrooms', data);
    return res.data;
  },
  getClassroom: async (id) => {
    const res = await API.get(`/admin/classrooms/${id}`);
    return res.data;
  },
  updateClassroom: async (id, data) => {
    const res = await API.put(`/admin/classrooms/${id}`, data);
    return res.data;
  },
  deleteClassroom: async (id) => {
    const res = await API.delete(`/admin/classrooms/${id}`);
    return res.data;
  },

  // --- Grade Levels ---
  getGradeLevels: async () => {
    const res = await API.get('/admin/grade-levels');
    return res.data;
  },

  // --- Subjects ---
  getSubjects: async () => {
    const res = await API.get('/admin/subjects');
    return res.data;
  },
  createSubject: async (data) => {
    const res = await API.post('/admin/subjects', data);
    return res.data;
  },
  getSubject: async (id) => {
    const res = await API.get(`/admin/subjects/${id}`);
    return res.data;
  },
  updateSubject: async (id, data) => {
    const res = await API.put(`/admin/subjects/${id}`, data);
    return res.data;
  },
  deleteSubject: async (id) => {
    const res = await API.delete(`/admin/subjects/${id}`);
    return res.data;
  },

  // --- Academic Years ---
  getAcademicYears: async () => {
    const res = await API.get('/admin/academic-years');
    return res.data;
  },
  createAcademicYear: async (data) => {
    const res = await API.post('/admin/academic-years', data);
    return res.data;
  },
  getAcademicYear: async (id) => {
    const res = await API.get(`/admin/academic-years/${id}`);
    return res.data;
  },
  updateAcademicYear: async (id, data) => {
    const res = await API.put(`/admin/academic-years/${id}`, data);
    return res.data;
  },
  deleteAcademicYear: async (id) => {
    const res = await API.delete(`/admin/academic-years/${id}`);
    return res.data;
  },

  // --- Sections ---
  getSections: async () => {
    const res = await API.get('/admin/sections');
    return res.data;
  },
  createSection: async (data) => {
    const res = await API.post('/admin/sections', data);
    return res.data;
  },
  updateSection: async (id, data) => {
    const res = await API.put(`/admin/sections/${id}`, data);
    return res.data;
  },
  deleteSection: async (id) => {
    const res = await API.delete(`/admin/sections/${id}`);
    return res.data;
  },

  // --- School Profile ---
  getSchoolProfile: async () => {
    const res = await API.get('/admin/school-profile');
    return res.data;
  },
};

export default academicService;
