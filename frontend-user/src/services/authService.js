import axiosClient from '../config/axiosClient';

const authService = {
  // មុខងារ Login ដោយប្រើ Student ID
  login: (studentId, password) => {
    return axiosClient.post('/auth/login', {
      student_id: studentId,
      password: password,
    });
  },

  // មុខងារ Logout
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  // ទាញយកព័ត៌មានអ្នកប្រើប្រាស់បច្ចុប្បន្ន
  getMe: () => {
    return axiosClient.get('/auth/me');
  }
};

export default authService;