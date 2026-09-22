import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useSidebarStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { collapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          collapsed ? 'ml-[68px]' : 'ml-[240px]'
        )}
      >
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
