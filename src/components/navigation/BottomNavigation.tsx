import React from 'react';
import { Map, Wallet, User } from 'lucide-react';
import { NavTab } from '../../types';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const tabs = [
    { id: 'map' as NavTab, label: 'Mapa', icon: Map },
    { id: 'earnings' as NavTab, label: 'Ganhos', icon: Wallet },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141519]/95 backdrop-blur-xl border-t border-white/10 px-6 py-2 pb-5 flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.7)] ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-4 transition-all duration-200 cursor-pointer select-none group"
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#00E676]' : 'text-gray-500 hover:text-zinc-300'
                }`}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
              )}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wider transition-colors duration-200 ${
                isActive ? 'text-[#00E676]' : 'text-gray-500 group-hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
