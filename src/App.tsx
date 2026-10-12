import React, { useState, useEffect } from 'react';
import { UserProfile, UserAccount } from './types';
import { StorageService } from './services/storage';
import { AuthService } from './services/authService';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ChatView } from './components/ChatView';
import { StyleCheckView } from './components/StyleCheckView';
import { BuyCheckView } from './components/BuyCheckView';
import { ColorCheckView } from './components/ColorCheckView';
import { WardrobeView } from './components/WardrobeView';
import { CalendarView } from './components/CalendarView';
import { OnboardingModal } from './components/OnboardingModal';
import { StyleDnaModal } from './components/StyleDnaModal';
import { AuthModal } from './components/AuthModal';
import { SuperadminDashboard } from './components/SuperadminDashboard';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [authUser, setAuthUser] = useState<UserAccount | null>(() => AuthService.getCurrentUser());
  const [viewMode, setViewMode] = useState<'client' | 'superadmin'>('client');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [desktopFrameMode, setDesktopFrameMode] = useState<boolean>(false);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isStyleDnaModalOpen, setIsStyleDnaModalOpen] = useState(false);
  const [isColorCheckModalOpen, setIsColorCheckModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Register PWA Service Worker & listen for install prompt
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('Wilma ServiceWorker registered:', reg.scope))
          .catch((err) => console.log('ServiceWorker registration error:', err));
      });
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleRestartOnboarding = () => {
    setIsStyleDnaModalOpen(false);
    setIsOnboardingOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'admin' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setAuthUser(user);
    if (user.role === 'superadmin') {
      setViewMode('superadmin');
    } else {
      const updatedProfile = {
        ...profile,
        name: user.firstName || user.fullName,
        email: user.email || user.emailOrPhone,
      };
      setProfile(updatedProfile);
      StorageService.saveProfile(updatedProfile);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setAuthUser(null);
    setViewMode('client');
  };

  // If in Superadmin View Mode, render the full Superadmin panel
  if (viewMode === 'superadmin' && authUser?.role === 'superadmin') {
    return (
      <SuperadminDashboard
        currentUser={authUser}
        onLogout={handleLogout}
        onSwitchToClientView={() => setViewMode('client')}
      />
    );
  }

  return (
    <div
      className={
        desktopFrameMode
          ? 'min-h-screen bg-[#EDE7DD] sm:py-6 flex justify-center items-center transition-all'
          : 'min-h-screen bg-[#FBF9F5] flex flex-col w-full transition-all'
      }
    >
      {/* Shell Container: Full-screen responsive on PC or simulated mobile phone frame */}
      <div
        className={
          desktopFrameMode
            ? 'w-full max-w-md bg-[#FBF9F5] min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:rounded-[38px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-8 sm:border-stone-800'
            : 'w-full min-h-screen bg-[#FBF9F5] flex flex-col'
        }
      >
        {/* Header with full width desktop support */}
        <Header
          profile={profile}
          authUser={authUser}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onOpenStyleDna={() => setIsStyleDnaModalOpen(true)}
          onStartOnboarding={() => setIsOnboardingOpen(true)}
          onOpenAuth={handleOpenAuth}
          onOpenSuperadmin={() => setViewMode('superadmin')}
          desktopFrameMode={desktopFrameMode}
          onToggleDesktopFrameMode={() => setDesktopFrameMode(!desktopFrameMode)}
          pwaInstallPrompt={deferredPrompt}
          onInstallPwa={handleInstallPwa}
        />

        {/* Main Content Area */}
        <main
          className={
            desktopFrameMode
              ? 'flex-1 overflow-y-auto px-4 pt-4'
              : 'flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 md:pb-12'
          }
        >
          {activeTab === 'home' && (
            <HomeView
              profile={profile}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenStyleDna={() => setIsStyleDnaModalOpen(true)}
              onOpenColorModal={() => setIsColorCheckModalOpen(true)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              profile={profile}
              onUpdateProfile={handleSaveProfile}
              onNavigateToChatWithPrompt={(prompt) => {
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'chat' && <ChatView profile={profile} />}

          {activeTab === 'stylecheck' && <StyleCheckView profile={profile} />}

          {activeTab === 'comprar' && <BuyCheckView profile={profile} />}

          {activeTab === 'armario' && (
            <WardrobeView
              profile={profile}
              onUpdateProfile={handleSaveProfile}
              onNavigateToChatWithQuery={(query) => {
                setActiveTab('chat');
              }}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation (Hidden on desktop in full screen mode) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          desktopFrameMode={desktopFrameMode}
        />

        {/* Diagnostic Onboarding Modal (5 Stages) */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onSaveProfile={handleSaveProfile}
          currentProfile={profile}
        />

        {/* Style DNA Passport Modal */}
        <StyleDnaModal
          isOpen={isStyleDnaModalOpen}
          onClose={() => setIsStyleDnaModalOpen(false)}
          profile={profile}
          onRestartOnboarding={handleRestartOnboarding}
        />

        {/* Color Check Express Modal */}
        {isColorCheckModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-[#FBF9F5] w-full sm:max-w-md h-[88vh] sm:h-auto sm:max-h-[82vh] rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl p-5 overflow-y-auto">
              <ColorCheckView
                profile={profile}
                onClose={() => setIsColorCheckModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Facebook-style Auth & Master Login Modal with 3 Login Options */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalMode}
        />
      </div>
    </div>
  );
}
