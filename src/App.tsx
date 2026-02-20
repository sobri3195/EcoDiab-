import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import AIRiskPage from './pages/AIRiskPage';
import DashboardPage from './pages/DashboardPage';
import DietaryAssistantPage from './pages/DietaryAssistantPage';
import FollowUpPage from './pages/FollowUpPage';
import GreenPage from './pages/GreenPage';
import LandingPage from './pages/LandingPage';
import PatientsPage from './pages/PatientsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
      <Route path="/patients" element={<AppShell><PatientsPage /></AppShell>} />
      <Route path="/ai-risk" element={<AppShell><AIRiskPage /></AppShell>} />
      <Route path="/follow-up" element={<AppShell><FollowUpPage /></AppShell>} />
      <Route path="/green" element={<AppShell><GreenPage /></AppShell>} />
      <Route path="/dietary-assistant" element={<AppShell><DietaryAssistantPage /></AppShell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
