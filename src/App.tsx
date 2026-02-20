import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import { useAppContext } from './lib/app-context';
import AIRiskPage from './pages/AIRiskPage';
import DashboardPage from './pages/DashboardPage';
import DietaryAssistantPage from './pages/DietaryAssistantPage';
import FollowUpPage from './pages/FollowUpPage';
import GreenPage from './pages/GreenPage';
import LandingPage from './pages/LandingPage';
import PatientsPage from './pages/PatientsPage';

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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><AppShell><PatientsPage /></AppShell></ProtectedRoute>} />
      <Route path="/ai-risk" element={<ProtectedRoute><AppShell><AIRiskPage /></AppShell></ProtectedRoute>} />
      <Route path="/follow-up" element={<ProtectedRoute><AppShell><FollowUpPage /></AppShell></ProtectedRoute>} />
      <Route path="/green" element={<ProtectedRoute><AppShell><GreenPage /></AppShell></ProtectedRoute>} />
      <Route path="/dietary-assistant" element={<ProtectedRoute><AppShell><DietaryAssistantPage /></AppShell></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
