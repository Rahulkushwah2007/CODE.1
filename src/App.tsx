import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// View Components
import { LandingPage } from './components/LandingPage';
import { PublicShelterFinder } from './components/PublicShelterFinder';
import { ShelterMap } from './components/ShelterMap';
import { SheltersRosterView } from './components/SheltersRosterView';
import { FamilyIntakeWizard } from './components/FamilyIntakeWizard';
import { ShelterManagerDashboard } from './components/ShelterManagerDashboard';
import { CommandCenter } from './components/CommandCenter';
import { FamilyGroupingView } from './components/FamilyGroupingView';
import { ResourceManagementView } from './components/ResourceManagementView';
import { AlertCenterView } from './components/AlertCenterView';
import { VolunteerPortalView } from './components/VolunteerPortalView';
import { ShelterDetailView } from './components/ShelterDetailView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

const MainLayout: React.FC = () => {
  const { currentTab, country, role } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage />;
      case 'finder':
        return <PublicShelterFinder />;
      case 'map':
        return (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                  GEOGRAPHIC INFORMATION SYSTEM
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Live GIS Map of Verified Disaster Shelters
                </h1>
              </div>
            </div>
            <ShelterMap />
          </div>
        );
      case 'shelters':
      case 'roster':
        return <SheltersRosterView />;
      case 'intake':
        return <FamilyIntakeWizard />;
      case 'manager-dashboard':
        return <ShelterManagerDashboard />;
      case 'command':
        return <CommandCenter />;
      case 'families':
        return <FamilyGroupingView />;
      case 'resources':
        return <ResourceManagementView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'volunteers':
        return <VolunteerPortalView />;
      case 'shelter-detail':
        return <ShelterDetailView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1120] text-[#F8FAFC] flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Command Navbar */}
      <Navbar />

      {/* Center Layout with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileNav />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
