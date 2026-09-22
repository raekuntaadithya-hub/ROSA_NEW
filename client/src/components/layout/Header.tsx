import { useAuthStore, usePatientStore } from '@/store/useAppStore';
import { mockPatients } from '@/data/mockPatients';
import { Bell, Search, Wifi, User } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function Header() {
  const { user } = useAuthStore();
  const { selectedPatientId } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const selectedPatient = selectedPatientId
    ? mockPatients.find((p) => p.id === selectedPatientId)
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6">
      {/* Left: Current Patient Context */}
      <div className="flex items-center gap-4">
        {selectedPatient && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5">
            <User className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {selectedPatient.name}
            </span>
            <span className="text-xs text-blue-500">
              {selectedPatient.id} · {selectedPatient.kneeSide} Knee
            </span>
          </div>
        )}
      </div>

      {/* Right: Search, Notifications, Status, Profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-52 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-200 transition-colors"
          />
        </form>

        {/* System Status */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5" title="System Online">
          <Wifi className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs font-medium text-emerald-600">Online</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => toast.info('3 pending reviews require attention')}
          className="relative rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
