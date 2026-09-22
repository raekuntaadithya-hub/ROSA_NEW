import { Link, useLocation } from 'wouter';
import { useAuthStore, useSidebarStore } from '@/store/useAppStore';
import {
  LayoutDashboard,
  Users,
  ScanLine,
  Brain,
  Box,
  Scissors,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/imaging', label: 'Imaging', icon: ScanLine },
  { path: '/segmentation', label: 'Segmentation', icon: Brain },
  { path: '/reconstruction', label: '3D Reconstruction', icon: Box },
  { path: '/planning', label: 'Surgical Planning', icon: Scissors },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuthStore();
  const { collapsed, toggle } = useSidebarStore();

  const roleLabels: Record<string, string> = {
    surgeon: 'Surgeon',
    radiologist: 'Radiologist',
    robotic_technician: 'Robotic Technician',
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <Link href="/">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xs">
            <Activity className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-slate-900 leading-tight">Clinical Atlas</h1>
              <p className="text-[10px] font-medium text-slate-400 leading-tight">ROSA TKA Navigation</p>
            </div>
          )}
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === '/dashboard'
                ? location === '/' || location === '/dashboard'
                : location === item.path || location.startsWith(item.path + '/');
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-blue-600' : 'text-slate-400')} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center rounded-lg py-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-slate-400">{user?.role ? roleLabels[user.role] : 'Role'}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
