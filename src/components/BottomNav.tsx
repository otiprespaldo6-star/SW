import React from 'react';
import { Home, Calendar, MessageSquare, ScanLine, ShoppingBag, FolderHeart } from 'lucide-react';

export type NavTab = 'home' | 'calendar' | 'chat' | 'stylecheck' | 'comprar' | 'armario';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount?: number;
  desktopFrameMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  desktopFrameMode = false,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Inicio', icon: Home },
    { id: 'calendar' as NavTab, label: 'Agenda', icon: Calendar },
    { id: 'armario' as NavTab, label: 'Armario', icon: FolderHeart },
    { id: 'chat' as NavTab, label: 'Chat', icon: MessageSquare },
    { id: 'stylecheck' as NavTab, label: 'Analizar', icon: ScanLine },
    { id: 'comprar' as NavTab, label: 'Comprar', icon: ShoppingBag },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-lg border-t border-[#EBE3D5] pb-safe pt-1 ${
        desktopFrameMode ? '' : 'md:hidden'
      }`}
    >
      <div className="max-w-md mx-auto grid grid-cols-6 px-1 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#1C1917]'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-[#EFE8DC]/80 text-[#C86D51]' : ''
                }`}
              >
                <Icon className="w-4.5 h-4.5 stroke-[1.8]" />
              </div>
              <span
                className={`text-[9px] mt-0.5 font-medium tracking-tight truncate ${
                  isActive ? 'font-semibold text-[#1C1917]' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#C86D51] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
