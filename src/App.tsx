import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ThemeApplier from './components/ThemeApplier';
import Dashboard from './pages/Dashboard';
import CharacterPage from './pages/Character';
import CampaignsPage from './pages/Campaigns';
import QuestsPage from './pages/Quests';
import SkillTreePage from './pages/SkillTree';
import BattlesPage from './pages/Battles';
import AchievementsPage from './pages/Achievements';
import InventoryPage from './pages/Inventory';
import CalendarPage from './pages/Calendar';
import AnalyticsPage from './pages/Analytics';
import JournalPage from './pages/Journal';
import EconomyPage from './pages/Economy';
import CustomizationPage from './pages/Customization';
import CommunityPage from './pages/Community';
import CoachPage from './pages/Coach';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeApplier />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/character" element={<CharacterPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/skills" element={<SkillTreePage />} />
          <Route path="/battles" element={<BattlesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/economy" element={<EconomyPage />} />
          <Route path="/customization" element={<CustomizationPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/coach" element={<CoachPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
