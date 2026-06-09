import {
  LayoutDashboard,
  Users,
  FileText,
  Truck,
  BarChart3,
  ShieldAlert,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';

export type Page = 'dashboard' | 'vendors' | 'purchase-orders' | 'delivery' | 'scorecard' | 'ai-risk';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  notificationCount?: number;
}

const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'vendors', label: 'Vendors', icon: Users },
  { page: 'purchase-orders', label: 'Purchase Orders', icon: FileText },
  { page: 'delivery', label: 'Delivery', icon: Truck },
  { page: 'scorecard', label: 'Scorecard', icon: BarChart3 },
  { page: 'ai-risk', label: 'AI Risk', icon: ShieldAlert },
];

export default function Sidebar({ currentPage, onNavigate, isDark, onToggleTheme, notificationCount = 3 }: SidebarProps) {
  return (
    <aside className="glass-panel fixed left-4 top-4 bottom-4 w-[220px] flex flex-col z-30 overflow-hidden"
      style={{ borderRadius: '28px' }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2">
        <span className="text-2xl">🚚</span>
        <span className="text-lg font-bold tracking-tight text-glass">ProcureAI</span>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--glass-border)]" />

      {/* Notification + Theme */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          className="relative p-2 rounded-xl hover:bg-[var(--surface-strong)] transition-colors duration-180"
          style={{ cursor: 'pointer' }}
          aria-label="Notifications"
        >
          <Bell size={18} className="text-glass-secondary" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--red)] text-white text-[10px] font-bold flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl hover:bg-[var(--surface-strong)] transition-colors duration-180"
          style={{ cursor: 'pointer' }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-glass-secondary" /> : <Moon size={18} className="text-glass-secondary" />}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--glass-border)]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-180 cursor-pointer ${
                isActive
                  ? 'nav-active'
                  : 'text-glass-secondary hover:text-glass hover:bg-[var(--surface)]'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 text-xs text-glass-muted border-t border-[var(--glass-border)]">
        ProcureAI v1.0
      </div>
    </aside>
  );
}
