import API from './api';

export const libraryService = {
  getOverview: async (params = {}) => {
    const res = await API.get('/admin/library', { params });
    return res.data;
  },
  getBooks: async (params = {}) => {
    const res = await API.get('/admin/library/books', { params });
    return res.data;
  },
  createBook: async (data) => {
    const res = await API.post('/admin/library/books', data);
    return res.data;
  },
  getBook: async (id) => {
    const res = await API.get(`/admin/library/books/${id}`);
    return res.data;
  },
  updateBook: async (id, data) => {
    const res = await API.put(`/admin/library/books/${id}`, data);
    return res.data;
  },
  deleteBook: async (id) => {
    const res = await API.delete(`/admin/library/books/${id}`);
    return res.data;
  },
  getBorrows: async (params = {}) => {
    const res = await API.get('/admin/library/borrows', { params });
    return res.data;
  },
  borrowBook: async (data) => {
    const res = await API.post('/admin/library/borrow', data);
    return res.data;
  },
  returnBook: async (data) => {
    const res = await API.post('/admin/library/return', data);
    return res.data;
  },
  getOverdueBooks: async (params = {}) => {
    const res = await API.get('/admin/library/overdue', { params });
    return res.data;
  },
};

export default libraryService;

