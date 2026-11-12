import API from './api';

export const financeService = {
  getOverview: async (params = {}) => {
    const res = await API.get('/admin/finance', { params });
    return res.data;
  },
  getFees: async (params = {}) => {
    const res = await API.get('/admin/finance/fees', { params });
    return res.data;
  },
  createFee: async (data) => {
    const res = await API.post('/admin/finance/fees', data);
    return res.data;
  },
  updateFee: async (id, data) => {
    const res = await API.put(`/admin/finance/fees/${id}`, data);
    return res.data;
  },
  deleteFee: async (id) => {
    const res = await API.delete(`/admin/finance/fees/${id}`);
    return res.data;
  },
  getPayments: async (params = {}) => {
    const res = await API.get('/admin/finance/payments', { params });
    return res.data;
  },
  createPayment: async (data) => {
    const res = await API.post('/admin/finance/payments', data);
    return res.data;
  },
  updatePayment: async (id, data) => {
    const res = await API.put(`/admin/finance/payments/${id}`, data);
    return res.data;
  },
  deletePayment: async (id) => {
    const res = await API.delete(`/admin/finance/payments/${id}`);
    return res.data;
  },
  getExpenses: async (params = {}) => {
    const res = await API.get('/admin/finance/expenses', { params });
    return res.data;
  },
  createExpense: async (data) => {
    const res = await API.post('/admin/finance/expenses', data);
    return res.data;
  },
  updateExpense: async (id, data) => {
    const res = await API.put(`/admin/finance/expenses/${id}`, data);
    return res.data;
  },
  deleteExpense: async (id) => {
    const res = await API.delete(`/admin/finance/expenses/${id}`);
    return res.data;
  },
  getIncome: async (params = {}) => {
    const res = await API.get('/admin/finance/income', { params });
    return res.data;
  },
  createIncome: async (data) => {
    const res = await API.post('/admin/finance/income', data);
    return res.data;
  },
  updateIncome: async (id, data) => {
    const res = await API.put(`/admin/finance/income/${id}`, data);
    return res.data;
  },
  deleteIncome: async (id) => {
    const res = await API.delete(`/admin/finance/income/${id}`);
    return res.data;
  },
  getReports: async (params = {}) => {
    const res = await API.get('/admin/finance/reports', { params });
    return res.data;
  },
  createTransaction: async (data) => {
    const res = await API.post('/admin/finance/transactions', data);
    return res.data;
  },
};

export default financeService;

