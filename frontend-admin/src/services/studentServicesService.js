import API from './api';

export const studentServicesService = {
  getOverview: async (params = {}) => {
    const res = await API.get('/admin/student-services', { params });
    return res.data;
  },
  promoteStudents: async (data = {}) => {
    const res = await API.post('/admin/student-services/promotion', data);
    return res.data;
  },
  getTransfers: async (params = {}) => {
    const res = await API.get('/admin/student-services/transfers', { params });
    return res.data;
  },
  createTransfer: async (data) => {
    const res = await API.post('/admin/student-services/transfer', data);
    return res.data;
  },
  updateTransfer: async (id, data) => {
    const res = await API.put(`/admin/student-services/transfers/${id}`, data);
    return res.data;
  },
  deleteTransfer: async (id) => {
    const res = await API.delete(`/admin/student-services/transfers/${id}`);
    return res.data;
  },
  getDisciplines: async (params = {}) => {
    const res = await API.get('/admin/student-services/disciplines', { params });
    return res.data;
  },
  createDiscipline: async (data) => {
    const res = await API.post('/admin/student-services/discipline', data);
    return res.data;
  },
  updateDiscipline: async (id, data) => {
    const res = await API.put(`/admin/student-services/discipline/${id}`, data);
    return res.data;
  },
  deleteDiscipline: async (id) => {
    const res = await API.delete(`/admin/student-services/discipline/${id}`);
    return res.data;
  },
  getCertificates: async (params = {}) => {
    const res = await API.get('/admin/student-services/certificates', { params });
    return res.data;
  },
  createCertificate: async (data) => {
    const res = await API.post('/admin/student-services/certificates', data);
    return res.data;
  },
  updateCertificate: async (id, data) => {
    const res = await API.put(`/admin/student-services/certificates/${id}`, data);
    return res.data;
  },
  deleteCertificate: async (id) => {
    const res = await API.delete(`/admin/student-services/certificates/${id}`);
    return res.data;
  },
  getDocuments: async (params = {}) => {
    const res = await API.get('/admin/student-services/documents', { params });
    return res.data;
  },
  createDocument: async (data) => {
    const res = await API.post('/admin/student-services/documents', data);
    return res.data;
  },
  deleteDocument: async (id) => {
    const res = await API.delete(`/admin/student-services/documents/${id}`);
    return res.data;
  },
};

export default studentServicesService;

