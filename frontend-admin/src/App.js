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
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
