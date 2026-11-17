import React from 'react';
import {
  Map,
  Wallet,
  User,
  Briefcase,
  PlusCircle,
  BarChart3,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';
import { NavTab } from '@trampotaxa/shared';
import { UserRole } from '../../context/AuthContext';

interface BottomNavigationProps {
  role?: UserRole;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  role = 'Freelancer',
  activeTab,
  onTabChange,
  className = '',
}) => {
  const freelancerTabs = [
    { id: 'map' as NavTab, label: 'Mapa', icon: Map },
    { id: 'earnings' as NavTab, label: 'Ganhos', icon: Wallet },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  const contractorTabs = [
    { id: 'contractor-dashboard' as NavTab, label: 'Início', icon: LayoutDashboard },
    { id: 'contractor-gigs' as NavTab, label: 'Vagas', icon: Briefcase },
    { id: 'contractor-create' as NavTab, label: 'Criar', icon: PlusCircle },
    { id: 'contractor-chat' as NavTab, label: 'Chat', icon: MessageSquare },
    { id: 'contractor-reports' as NavTab, label: 'Relatórios', icon: BarChart3 },
  ];

  const tabs = role === 'Contratante' ? contractorTabs : freelancerTabs;

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171B1A]/98 border-t border-[#E7ECE8]/12 px-3 py-1.5 pb-4 flex items-center justify-around ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 transition-all duration-200 cursor-pointer select-none group"
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#34745A]' : 'text-[#AAB5AE] hover:text-[#E7ECE8]'
                }`}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-none bg-[#34745A]" />
              )}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wider transition-colors duration-200 ${
                isActive ? 'text-[#34745A]' : 'text-[#AAB5AE] group-hover:text-[#E7ECE8]'
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
