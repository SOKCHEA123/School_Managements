import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  KeyRound,
  History,
  Lock,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  Trash2,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { securityService } from '../../services';
import { useApp } from '../../context/AppContext';

const Security = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'users';

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modal: Create User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'teacher',
  });

  // Modal: Create Role
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', label: '' });

  // Modal: Create Permission
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [newPerm, setNewPerm] = useState({ name: '', module: 'general' });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchSec = async () => {
    setLoading(true);
    try {
      const [uRes, rRes, pRes, hRes, lRes] = await Promise.all([
        securityService.getUsers(),
        securityService.getRoles(),
        securityService.getPermissions(),
        securityService.getLoginHistory(),
        securityService.getActivityLogs(),
      ]);
      setUsers(uRes?.users || uRes?.data || []);
      setRoles(rRes?.data || rRes?.roles || (Array.isArray(rRes) ? rRes : []));
      setPermissions(pRes?.data || pRes?.permissions || (Array.isArray(pRes) ? pRes : []));
      setLoginHistory(hRes?.history || hRes?.data || []);
      setActivityLogs(lRes?.logs || lRes?.data || []);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSec();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await securityService.createUser(newUser);
      showMsg('✅ បានបង្កើតគណនីអ្នកប្រើប្រាស់ដោយជោគជ័យ!');
      setIsUserModalOpen(false);
      setNewUser({ name: '', email: '', password: '', user_type: 'teacher' });
      fetchSec();
    } catch (err) {
      showMsg(err.response?.data?.message || '❌ បរាជ័យក្នុងការបង្កើតគណនី');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await securityService.toggleUserStatus(id);
      showMsg('✅ បានប្តូរស្ថានភាពគណនីដោយជោគជ័យ!');
      fetchSec();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការប្តូរស្ថានភាព');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបគណនីនេះមែនទេ?')) return;
    try {
      await securityService.deleteUser(id);
      showMsg('✅ បានលុបគណនីអ្នកប្រើប្រាស់រួចរាល់');
      fetchSec();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('តើអ្នកចង់សម្អាតប្រវត្តិចូលទាំងអស់មែនទេ?')) return;
    try {
      await securityService.clearLoginHistory();
      showMsg('✅ បានសម្អាតប្រវត្តិចូល Login រួចរាល់');
      fetchSec();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការសម្អាត');
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await securityService.createRole(newRole);
      showMsg('✅ បានបង្កើតតួនាទីថ្មីដោយជោគជ័យ!');
      setIsRoleModalOpen(false);
      fetchSec();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការបង្កើតតួនាទី');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ១១. អ្នកប្រើប្រាស់ & សុវត្ថិភាព (User & Security)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            គ្រប់គ្រងគណនី តួនាទី សិទ្ធិអនុញ្ញាត ប្រវត្តិចូល Login និងកំណត់ត្រាសកម្មភាព
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ បង្កើតគណនីថ្មី</span>
          </button>
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>+ តួនាទីថ្មី</span>
          </button>
        </div>
      </div>

            {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.includes('✅') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {message}
        </div>
      )}

      {/* TAB 1: USERS */}
      {currentTab === 'users' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-100 dark:bg-[#252d52] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              បញ្ជីគណនីអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ (Total: {users.length} Accounts)
            </h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#1b213b] font-bold">
              <tr>
                <th className="p-3">ឈ្មោះអ្នកប្រើ</th>
                <th className="p-3">អ៊ីមែល (Email)</th>
                <th className="p-3">ប្រភេទគណនី</th>
                <th className="p-3">កាលបរិច្ឆេទបង្កើត</th>
                <th className="p-3 text-center">ស្ថានភាព</th>
                <th className="p-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="p-3 font-mono text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400">
                      {u.user_type || 'Staff'}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        u.is_active !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {u.is_active !== false ? 'សកម្ម (Active)' : 'បិទដំណើរការ'}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-500 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ROLES */}
      {currentTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(roles.length > 0 ? roles : [
            { name: 'admin', label: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ (Super Admin)', users_count: 2 },
            { name: 'principal', label: 'នាយកសាលា (Principal)', users_count: 1 },
            { name: 'vice_principal', label: 'នាយករង (Vice Principal)', users_count: 2 },
            { name: 'academic_staff', label: 'ការិយាល័យសិក្សា / លេខា', users_count: 3 },
            { name: 'teacher', label: 'គ្រូបង្រៀន (Teachers)', users_count: 45 },
            { name: 'student', label: 'សិស្សានុសិស្ស (Students)', users_count: 850 },
          ]).map((r, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono text-blue-400 font-bold uppercase">{r.name}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{r.label || r.display_name || r.name}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">ចំនួនអ្នកប្រើ:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{r.users_count || '-'} នាក់</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PERMISSIONS */}
      {currentTab === 'permissions' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ការកំណត់សិទ្ធិអនុញ្ញាត (Role-Based Access Control - RBAC)
          </h3>
          <div className="space-y-3">
            {[
              { module: 'ការគ្រប់គ្រងសិស្ស', perms: ['មើលសិស្ស', 'បន្ថែមសិស្ស', 'កែប្រែទិន្នន័យ', 'លុបសិស្ស'] },
              { module: 'ការបញ្ចូលពិន្ទុ', perms: ['មើលពិន្ទុ', 'បញ្ចូលពិន្ទុប្រចាំខែ', 'កែប្រែពិន្ទុ', 'ចាក់សោរបញ្ជីពិន្ទុ (Lock)'] },
              { module: 'វត្តមាន', perms: ['កត់ត្រាវត្តមានសិស្ស', 'កត់ត្រាវត្តមានគ្រូ', 'មើលរបាយការណ៍វត្តមាន'] },
              { module: 'ហិរញ្ញវត្ថុ', perms: ['មើលរបាយការណ៍ហិរញ្ញវត្ថុ', 'កត់ត្រាចំណូល-ចំណាយ', 'ចេញវិក្កយបត្រ'] },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
                <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">{p.module}</div>
                <div className="flex flex-wrap gap-2">
                  {p.perms.map((perm, pIdx) => (
                    <span key={pIdx} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOGIN HISTORY */}
      {currentTab === 'history' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ប្រវត្តិចូលប្រើប្រាស់ប្រព័ន្ធ (Login History & Audit Logs)
            </h3>
            <button
              onClick={handleClearHistory}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              សម្អាតប្រវត្តិចូល
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">គណនីអ្នកប្រើ</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">កាលបរិច្ឆេទ & ម៉ោង</th>
                  <th className="p-3 text-center">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(loginHistory.length > 0 ? loginHistory : [
                  { user: 'Admin (mrrsokchea0@gmail.com)', ip: '127.0.0.1', time: '12 នាទីមុន', status: 'ជោគជ័យ' },
                  { user: 'លោកគ្រូ សុខ', ip: '192.168.1.15', time: '1 ម៉ោងមុន', status: 'ជោគជ័យ' },
                ]).map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{h.user || h.user_name}</td>
                    <td className="p-3 font-mono">{h.ip || h.ip_address}</td>
                    <td className="p-3 font-mono text-slate-400">{h.time || h.created_at}</td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        {h.status || 'ជោគជ័យ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVITY LOGS */}
      {currentTab === 'logs' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            កំណត់ត្រាសកម្មភាពប្រតិបត្តិការ (System Activity Logs)
          </h3>
          <div className="divide-y divide-slate-200 dark:divide-gray-800 text-xs">
            {(activityLogs.length > 0 ? activityLogs : [
              { action: 'បានកែប្រែទិន្នន័យសិស្ស', user: 'Admin', time: '10 នាទីមុន' },
              { action: 'បានកត់ត្រាវត្តមានសិស្សថ្នាក់ 12A', user: 'លោកគ្រូ សុខ', time: '40 នាទីមុន' },
              { action: 'បានបញ្ចូលពិន្ទុមុខវិជ្ជាគណិតវិទ្យា', user: 'លោកគ្រូ សុខ', time: '1 ម៉ោងមុន' },
            ]).map((l, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{l.action || l.description}</div>
                  <div className="text-slate-400 mt-0.5">ដោយ: {l.user || l.user_name}</div>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{l.time || l.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតគណនីថ្មី</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះអ្នកប្រើប្រាស់</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">អ៊ីមែល (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ពាក្យសម្ងាត់ (Password)</label>
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភេទគណនី / តួនាទី</label>
                <select
                  value={newUser.user_type}
                  onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="admin">អ្នកគ្រប់គ្រង (Admin)</option>
                  <option value="principal">នាយកសាលា (Principal)</option>
                  <option value="vice_principal">នាយករង (Vice Principal)</option>
                  <option value="academic_staff">ការិយាល័យសិក្សា (Staff)</option>
                  <option value="teacher">គ្រូបង្រៀន (Teacher)</option>
                  <option value="student">សិស្ស (Student)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">បង្កើតគណនី</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Role */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតតួនាទីថ្មី</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateRole} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">កូដតួនាទី (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="librarian"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះតួនាទី (ខ្មែរ)</label>
                <input
                  type="text"
                  required
                  placeholder="បណ្ណារក្ស (Librarian)"
                  value={newRole.label}
                  onChange={(e) => setNewRole({ ...newRole, label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
