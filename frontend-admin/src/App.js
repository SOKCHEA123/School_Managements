import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/register/Register';
import Dashboard from './pages/dashboard/Dashboard';

// Management Modules
import {
  AllStudents,
  StudentPromotion,
  StudentTransfer,
  StudentDiscipline,
  StudentCertificates,
  StudentDocuments,
} from './pages/managementstudent';
import { Teachers, TeacherAttendance, TeacherTimetable } from './pages/managementteacher';
import { Parents, ParentCommunication } from './pages/managementparent';
import { Academics } from './pages/managementacademic';
import { Attendance } from './pages/managementattendance';
import { Timetable } from './pages/managementtimetable';
import { Exams, EnterScores } from './pages/managementexam';
import { Finance } from './pages/managementfinance';
import { Library } from './pages/managementlibrary';
import { Communication } from './pages/managementcommunication';
import { Reports } from './pages/managementreport';
import { Security } from './pages/managementsecurity';
import { Settings } from './pages/managementsettings';
import { Profile, PersonalInfo, ChangePassword } from './pages/profile';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import { AppProvider } from './context/AppContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc', padding: 20, fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: 520, width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', color: '#f43f5e', marginBottom: 8 }}>មានបញ្ហាក្នុងការបង្ហាញផ្ទាំង (Application Error)</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>សូមព្យាយាម Refresh ទំព័រ ឬចុះឈ្មោះចូលឡើងវិញ</p>
            <pre style={{ background: '#090d16', padding: 12, borderRadius: 8, fontSize: 11, textAlign: 'left', color: '#fda4af', overflowX: 'auto', marginBottom: 20 }}>
              {this.state.error?.toString()}
            </pre>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
              >
                Refresh ទំព័រ
              </button>
              <button
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                style={{ padding: '8px 16px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
              >
                សំអាត Cache & Login ម្តងទៀត
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes enclosed with AdminLayout */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              {/* 1. Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* 2. Management Student */}
              <Route path="/students" element={<AllStudents />} />
              <Route path="/students/all" element={<AllStudents />} />
              <Route path="/students/promotion" element={<StudentPromotion />} />
              <Route path="/students/transfer" element={<StudentTransfer />} />
              <Route path="/students/discipline" element={<StudentDiscipline />} />
              <Route path="/students/certificates" element={<StudentCertificates />} />
              <Route path="/students/documents" element={<StudentDocuments />} />
              <Route path="/services" element={<StudentPromotion />} />

              {/* 3. Management Teacher & Parents */}
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/teachers/all" element={<Teachers />} />
              <Route path="/teachers/attendance" element={<TeacherAttendance />} />
              <Route path="/teachers/timetable" element={<TeacherTimetable />} />

              <Route path="/parents" element={<Parents />} />
              <Route path="/parents/all" element={<Parents />} />
              <Route path="/parents/communication" element={<ParentCommunication />} />

              {/* 4. Management Academic Structure */}
              <Route path="/academics" element={<Academics />} />

              {/* 5. Management Attendance & Timetable */}
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/timetable" element={<Timetable />} />

              {/* 6. Management Exam & Scores */}
              <Route path="/exams" element={<Exams />} />
              <Route path="/grades" element={<EnterScores />} />

              {/* 7. Management Finance, Library & Communication */}
              <Route path="/finance" element={<Finance />} />
              <Route path="/library" element={<Library />} />
              <Route path="/communication" element={<Communication />} />

              {/* 8. Management Reports, Security & Settings */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/security" element={<Security />} />
              <Route path="/settings" element={<Settings />} />

              {/* 9. Profile & Account */}
              <Route path="/profile" element={<PersonalInfo />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
