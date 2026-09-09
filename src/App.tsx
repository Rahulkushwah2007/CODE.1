import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { EmergencyFAB } from './components/EmergencyFAB';
import { ShelterDetailBottomSheet } from './components/ShelterDetailBottomSheet';
import { BookingConfirmModal } from './components/BookingConfirmModal';
import { Shelter } from './types';

// View Components
import { LandingPage } from './components/LandingPage';
import { PublicShelterFinder } from './components/PublicShelterFinder';
import { ShelterMap } from './components/ShelterMap';
import { SheltersRosterView } from './components/SheltersRosterView';
import { ProfileView } from './components/ProfileView';
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
import { RegisterShelterView } from './components/RegisterShelterView';

const MainLayout: React.FC = () => {
  const { currentTab, country, role } = useApp();

  // Root level bottom sheet & modal management for Emergency FAB & Navbar Search
  const [globalSheetShelter, setGlobalSheetShelter] = useState<Shelter | null>(null);
  const [globalSheetDistance, setGlobalSheetDistance] = useState<number | undefined>(undefined);
  const [globalBookingShelter, setGlobalBookingShelter] = useState<Shelter | null>(null);

  const handleOpenGlobalSheet = (shelter: Shelter, distanceKm?: number) => {
    setGlobalSheetShelter(shelter);
    setGlobalSheetDistance(distanceKm);
  };

  const handleBookFromGlobalSheet = (shelter: Shelter) => {
    setGlobalSheetShelter(null);
    setGlobalBookingShelter(shelter);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'shelters':
      case 'roster':
        return <SheltersRosterView />;
      case 'register-shelter':
        return <RegisterShelterView />;
      case 'resources':
        return <ResourceManagementView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'profile':
        return <ProfileView />;
      case 'finder':
        return <PublicShelterFinder />;
      case 'map':
        return (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 text-[#F8FAFC]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                GEOGRAPHIC INFORMATION SYSTEM
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Live GIS Safe Zones &amp; Relief Hubs
              </h1>
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
              <ShelterMap onSelectShelter={handleOpenGlobalSheet} />
            </div>
          </div>
        );
      case 'intake':
        return <FamilyIntakeWizard />;
      case 'manager-dashboard':
        return <ShelterManagerDashboard />;
      case 'command':
        return <CommandCenter />;
      case 'families':
        return <FamilyGroupingView />;
      case 'volunteers':
        return <VolunteerPortalView />;
      case 'shelter-detail':
        return <ShelterDetailView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'landing':
        return <LandingPage />;
      default:
        return <SheltersRosterView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col selection:bg-[#EA580C] selection:text-white transition-colors">
      
      {/* Floating Glassmorphic Top App Bar */}
      <Navbar onOpenShelterDetails={handleOpenGlobalSheet} />

      {/* 12-Column Desktop Grid Layout with Persistent Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Main Workspace with Safe Area and Responsive Padding */}
        <main className="flex-1 overflow-y-auto pb-28 lg:pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Massive Emergency FAB Anchored to Bottom Right */}
      <EmergencyFAB onOpenShelter={handleOpenGlobalSheet} />

      {/* Mobile Sticky Bottom Bar */}
      <MobileNav />

      {/* Global Bottom Sheet for Instant Shelter Inspection */}
      <ShelterDetailBottomSheet
        shelter={globalSheetShelter}
        distanceKm={globalSheetDistance}
        isOpen={Boolean(globalSheetShelter)}
        onClose={() => setGlobalSheetShelter(null)}
        onBookSpot={handleBookFromGlobalSheet}
      />

      {/* Global Critical Booking Confirmation Modal */}
      {globalBookingShelter && (
        <BookingConfirmModal
          shelter={globalBookingShelter}
          isOpen={Boolean(globalBookingShelter)}
          onClose={() => setGlobalBookingShelter(null)}
          onConfirmed={bookingData => {
            // Confirmation saved
          }}
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
