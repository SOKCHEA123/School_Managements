import API from './api';

export const securityService = {
  // --- Users ---
  getUsers: async (params = {}) => {
    const res = await API.get('/admin/users', { params });
    return res.data;
  },
  createUser: async (data) => {
    const res = await API.post('/admin/users', data);
    return res.data;
  },
  getUsersSecurity: async (params = {}) => {
    const res = await API.get('/admin/users-security', { params });
    return res.data;
  },
  createSecurityUser: async (data) => {
    const res = await API.post('/admin/users-security/users', data);
    return res.data;
  },
  getUser: async (id) => {
    const res = await API.get(`/admin/users/${id}`);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await API.put(`/admin/users/${id}`, data);
    return res.data;
  },
  patchUser: async (id, data) => {
    const res = await API.patch(`/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data;
  },
  toggleUserStatus: async (id) => {
    const res = await API.patch(`/admin/users/${id}/toggle`);
    return res.data;
  },

  // --- Roles ---
  getRoles: async (params = {}) => {
    const res = await API.get('/admin/roles', { params });
    return res.data;
  },
  createRole: async (data) => {
    const res = await API.post('/admin/roles', data);
    return res.data;
  },
  updateRole: async (id, data) => {
    const res = await API.put(`/admin/roles/${id}`, data);
    return res.data;
  },
  deleteRole: async (id) => {
    const res = await API.delete(`/admin/roles/${id}`);
    return res.data;
  },

  // --- Permissions ---
  getPermissions: async (params = {}) => {
    const res = await API.get('/admin/permissions', { params });
    return res.data;
  },
  createPermission: async (data) => {
    const res = await API.post('/admin/permissions', data);
    return res.data;
  },
  updatePermission: async (id, data) => {
    const res = await API.put(`/admin/permissions/${id}`, data);
    return res.data;
  },
  deletePermission: async (id) => {
    const res = await API.delete(`/admin/permissions/${id}`);
    return res.data;
  },

  // --- Security Logs & History ---
  getLoginHistory: async (params = {}) => {
    const res = await API.get('/admin/security/login-history', { params });
    return res.data;
  },
  clearLoginHistory: async () => {
    const res = await API.delete('/admin/security/login-history');
    return res.data;
  },
  getActivityLogs: async (params = {}) => {
    const res = await API.get('/admin/security/activity-logs', { params });
    return res.data;
  },
};

export default securityService;

