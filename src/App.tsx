import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import { useAppContext } from './lib/app-context';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const AIRiskPage = lazy(() => import('./pages/AIRiskPage'));
const FollowUpPage = lazy(() => import('./pages/FollowUpPage'));
const GreenPage = lazy(() => import('./pages/GreenPage'));
const DietaryAssistantPage = lazy(() => import('./pages/DietaryAssistantPage'));
const SmartAlertCenterPage = lazy(() => import('./pages/SmartAlertCenterPage'));
const PatientEducationPage = lazy(() => import('./pages/PatientEducationPage'));
const PatientEducationAchievementsPage = lazy(() => import('./pages/PatientEducationAchievementsPage'));
const PersonalGoalTrackerPage = lazy(() => import('./pages/PersonalGoalTrackerPage'));
const MedicationAdherencePage = lazy(() => import('./pages/MedicationAdherencePage'));
const TelemedicineHubPage = lazy(() => import('./pages/TelemedicineHubPage'));
const LabInsightsPage = lazy(() => import('./pages/LabInsightsPage'));
const CommunitySupportPage = lazy(() => import('./pages/CommunitySupportPage'));
const OperationsCenterPage = lazy(() => import('./pages/OperationsCenterPage'));

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ redirectTo: location.pathname }} />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><AppShell><PatientsPage /></AppShell></ProtectedRoute>} />
        <Route path="/ai-risk" element={<ProtectedRoute><AppShell><AIRiskPage /></AppShell></ProtectedRoute>} />
        <Route path="/follow-up" element={<ProtectedRoute><AppShell><FollowUpPage /></AppShell></ProtectedRoute>} />
        <Route path="/green" element={<ProtectedRoute><AppShell><GreenPage /></AppShell></ProtectedRoute>} />
        <Route path="/dietary-assistant" element={<ProtectedRoute><AppShell><DietaryAssistantPage /></AppShell></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AppShell><SmartAlertCenterPage /></AppShell></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><AppShell><PatientEducationPage /></AppShell></ProtectedRoute>} />
        <Route path="/education/achievements" element={<ProtectedRoute><AppShell><PatientEducationAchievementsPage /></AppShell></ProtectedRoute>} />
        <Route path="/personal-goals" element={<ProtectedRoute><AppShell><PersonalGoalTrackerPage /></AppShell></ProtectedRoute>} />
        <Route path="/medication-adherence" element={<ProtectedRoute><AppShell><MedicationAdherencePage /></AppShell></ProtectedRoute>} />
        <Route path="/telemedicine-hub" element={<ProtectedRoute><AppShell><TelemedicineHubPage /></AppShell></ProtectedRoute>} />
        <Route path="/lab-insights" element={<ProtectedRoute><AppShell><LabInsightsPage /></AppShell></ProtectedRoute>} />
        <Route path="/community-support" element={<ProtectedRoute><AppShell><CommunitySupportPage /></AppShell></ProtectedRoute>} />
        <Route path="/operations-center" element={<ProtectedRoute><AppShell><OperationsCenterPage /></AppShell></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
