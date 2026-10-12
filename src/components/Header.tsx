import React from 'react';
import { UserProfile, UserAccount } from '../types';
import { NavTab } from './BottomNav';
import {
  Sparkles,
  Dna,
  RotateCcw,
  Download,
  ShieldCheck,
  LogIn,
  Home,
  MessageSquare,
  ScanLine,
  ShoppingBag,
  FolderHeart,
  Calendar,
  Monitor,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  authUser: UserAccount | null;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenStyleDna: () => void;
  onStartOnboarding: () => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
  onOpenSuperadmin: () => void;
  desktopFrameMode: boolean;
  onToggleDesktopFrameMode: () => void;
  pwaInstallPrompt?: any;
  onInstallPwa?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  authUser,
  activeTab,
  onTabChange,
  onOpenStyleDna,
  onStartOnboarding,
  onOpenAuth,
  onOpenSuperadmin,
  desktopFrameMode,
  onToggleDesktopFrameMode,
  pwaInstallPrompt,
  onInstallPwa,
}) => {
  const isSuperadmin = authUser?.role === 'superadmin';

  const navItems = [
    { id: 'home' as NavTab, label: 'Inicio', icon: Home },
    { id: 'calendar' as NavTab, label: 'Calendario', icon: Calendar },
    { id: 'armario' as NavTab, label: 'Mi Armario', icon: FolderHeart },
    { id: 'chat' as NavTab, label: 'Chat con Wilma', icon: MessageSquare },
    { id: 'stylecheck' as NavTab, label: 'Analizar Look', icon: ScanLine },
    { id: 'comprar' as NavTab, label: '¿Me lo compro?', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#EBE3D5] px-4 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#1C1917] flex items-center justify-center text-[#C5A059] font-serif text-lg italic shadow-sm group-hover:scale-105 transition-transform">
            W
          </div>
          <div>
            <span className="font-serif text-lg tracking-tight font-semibold text-[#1C1917] block leading-none">
              Styled By Wilma
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#8A7968] font-medium block mt-0.5">
              Personal AI Stylist
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Visible on Tablet / PC / Mac) */}
        {!desktopFrameMode && (
          <nav className="hidden md:flex items-center gap-1 bg-[#F4EFE6]/70 p-1 rounded-2xl border border-[#E8DEC9]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#C86D51]' : 'text-stone-500'}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Action Badges & Utilities */}
        <div className="flex items-center gap-2">
          {/* Desktop/Mobile Frame Toggle */}
          <button
            onClick={onToggleDesktopFrameMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-medium text-stone-700 shadow-2xs transition-colors"
            title={desktopFrameMode ? 'Cambiar a Pantalla Completa PC' : 'Simular formato móvil'}
          >
            {desktopFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#C86D51]" />
                <span className="hidden lg:inline">Full Pantalla</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden lg:inline">Modo Móvil</span>
              </>
            )}
          </button>

          {/* Master Superadmin Badge */}
          {isSuperadmin ? (
            <button
              onClick={onOpenSuperadmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1917] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold shadow-xs hover:bg-black transition-all"
              title="Abrir Panel Superadmin"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>SUPERADMIN</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('admin')}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
              title="Acceso Superadmin (MASTER)"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* User Account / Auth Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFE8DC] hover:bg-[#E5DAC6] text-xs text-stone-800 font-semibold transition-colors"
            title={authUser ? `Cuenta: ${authUser.fullName}` : 'Iniciar Sesión / Registro'}
          >
            {authUser ? (
              <span className="truncate max-w-[85px]">{authUser.firstName}</span>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-[#C86D51]" />
                <span className="hidden sm:inline">Ingresar</span>
              </>
            )}
          </button>

          {/* Style DNA Badge */}
          <button
            onClick={onOpenStyleDna}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFE6] hover:bg-[#EAE2D3] border border-[#E0D5C3] text-xs font-semibold text-stone-800 transition-all shadow-xs"
            title="Ver pasaporte Style DNA"
          >
            <Dna className="w-3.5 h-3.5 text-[#C86D51]" />
            <span className="truncate max-w-[80px]">{profile.name}</span>
          </button>

          {/* Repeat Onboarding */}
          <button
            onClick={onStartOnboarding}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
            title="Repetir Onboarding Diagnóstico"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
