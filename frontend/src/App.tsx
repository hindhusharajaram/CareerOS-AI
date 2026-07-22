import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import EducationPage from './pages/EducationPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificatesPage from './pages/CertificatesPage';
import ExperiencePage from './pages/ExperiencePage';
import CareerGoalsPage from './pages/CareerGoalsPage';

import ResumeManagerPage from './pages/ResumeManagerPage';
import ProfileHealthPage from './pages/ProfileHealthPage';
import UploadCenterPage from './pages/UploadCenterPage';
import SearchPage from './pages/SearchPage';

/**
 * Root Application Shell Component — CareerOS AI
 * Configures routes for Authentication and Student Career Workspace modules.
 */
export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Workspace Routes */}
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resumes" element={<ResumeManagerPage />} />
        <Route path="/health" element={<ProfileHealthPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/career-goals" element={<CareerGoalsPage />} />
        <Route path="/upload-center" element={<UploadCenterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<Navigate to="/profile" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
