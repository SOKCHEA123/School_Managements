import API from './api';
import { securityService } from './securityService';
import { settingsService } from './settingsService';

export const userService = {
  getUsers: securityService.getUsers,
  getUser: securityService.getUser,
  createUser: securityService.createUser,
  updateUser: securityService.updateUser,
  deleteUser: securityService.deleteUser,
  toggleStatus: securityService.toggleUserStatus,
  getProfile: settingsService.getProfile,
  updateProfile: settingsService.updateProfile,
  changePassword: settingsService.changePassword,
  getLoginHistory: securityService.getLoginHistory,
  getActivityLogs: securityService.getActivityLogs,
};

export default userService;

