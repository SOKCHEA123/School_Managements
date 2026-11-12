import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/student/Students';
import Teachers from './pages/teacher/Teachers';
import Parents from './pages/academic/Parents';
import Attendance from './pages/attendance/Attendance';
import Timetable from './pages/timetable/Timetable';
import Exams from './pages/exam/Exams';
import Grades from './pages/Grades';
import Academics from './pages/Academics';
import StudentServices from './pages/service/StudentServices';
import Finance from './pages/finance/Finance';
import Library from './pages/library/Library';
import Communication from './pages/communication/Communication';
import Reports from './pages/report/Reports';
import Security from './pages/security/Security';
import Settings from './pages/settings/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes enclosed with AdminLayout */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            {/* 1. Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 2. Academic Management */}
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/academics" element={<Academics />} />

            {/* 3. Attendance & Timetable */}
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/timetable" element={<Timetable />} />

            {/* 4. Examination & Results */}
            <Route path="/exams" element={<Exams />} />
            <Route path="/grades" element={<Grades />} />

            {/* 5. Student Services & Operations */}
            <Route path="/services" element={<StudentServices />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/library" element={<Library />} />
            <Route path="/communication" element={<Communication />} />

            {/* 6. Reports, Security & Settings */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/security" element={<Security />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
