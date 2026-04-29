'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Smartphone,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  role: 'owner' | 'staff';
  userName: string;
  pendingRequests?: number;
}

const ownerNav = [
  { label: 'Dashboard', href: '/owner', icon: LayoutDashboard },
  { label: 'Produk', href: '/owner/produk', icon: Package },
  { label: 'Staf', href: '/owner/staf', icon: Users },
  { label: 'Permintaan', href: '/owner/permintaan', icon: ClipboardList },
  { label: 'Laporan', href: '/owner/laporan', icon: BarChart3 },
  { label: 'Pengaturan', href: '/owner/pengaturan', icon: Settings },
];

const staffNav = [
  { label: 'Produk Saya', href: '/staff', icon: Smartphone },
  { label: 'Gudang', href: '/staff/gudang', icon: Package },
  { label: 'Tim', href: '/staff/tim', icon: Users },
  { label: 'Jual', href: '/staff/jual', icon: ClipboardList },
  { label: 'Komisi', href: '/staff/komisi', icon: BarChart3 },
];

export default function Sidebar({ role, userName, pendingRequests = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = role === 'owner' ? ownerNav : staffNav;

  const isActive = (href: string) => {
    if (href === '/owner' || href === '/staff') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">BackOffice</h1>
          <p className="text-[11px] text-[var(--muted)] capitalize">{role} Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const showBadge = item.label === 'Permintaan' && pendingRequests > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${active ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse-glow">
                  {pendingRequests}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 mx-3 mb-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-[11px] text-[var(--muted)] capitalize">{role}</p>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-[var(--muted)] hover:text-red-400"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-[var(--navbar-height)] glass z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold">BackOffice</span>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors relative">
          <Bell className="w-5 h-5 text-[var(--muted)]" />
          {pendingRequests > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[var(--sidebar-width)] flex flex-col
          bg-[var(--surface)] border-r border-[var(--border-color)]
          transition-transform duration-300 ease-in-out z-50
          md:translate-x-0 md:z-30
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ '--sidebar-width': '260px' } as React.CSSProperties}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
