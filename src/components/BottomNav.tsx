import { Flame, Trophy, MonitorPlay, Diamond, ArrowRightLeft, MoreHorizontal, Dribbble } from 'lucide-react';

const tabs = [
  { id: 'TIPS', label: 'TIPS', icon: Flame },
  { id: 'FREE', label: 'FREE', icon: Dribbble },
  { id: 'BEST', label: 'BEST', icon: Trophy },
  { id: 'LIVE', label: 'LIVE', icon: MonitorPlay },
  { id: 'VIP', label: 'VIP', icon: Diamond },
  { id: 'HT-FT', label: 'HT-FT', icon: ArrowRightLeft },
  { id: 'MORE', label: 'MORE', icon: MoreHorizontal },
];

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between px-2 py-2 bg-[#131324] text-gray-400 absolute bottom-0 w-full border-t border-gray-800 z-40">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id} 
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full py-1 ${isActive ? 'text-[#facc15]' : ''}`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
