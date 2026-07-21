'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Bell, LogOut, Menu, X, User,
  Rocket, Heart, CreditCard, History,
  PlusCircle, Wallet,
  Users, Shield, Flag, CheckCircle, DollarSign, Search
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi } from '@/lib/api';

interface SidebarItem {
  label: string;
  icon: any;
  href: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Home', icon: LayoutDashboard, href: '/dashboard', roles: ['supporter', 'creator', 'admin'] },
  // Supporter
  { label: 'Explore Campaigns', icon: Search, href: '/dashboard/supporter/explore', roles: ['supporter'] },
  { label: 'My Contributions', icon: Heart, href: '/dashboard/supporter/contributions', roles: ['supporter'] },
  { label: 'Purchase Credit', icon: CreditCard, href: '/dashboard/supporter/purchase-credit', roles: ['supporter'] },
  { label: 'Payment History', icon: History, href: '/dashboard/supporter/payment-history', roles: ['supporter'] },
  // Creator
  { label: 'Add New Campaign', icon: PlusCircle, href: '/dashboard/creator/add-campaign', roles: ['creator'] },
  { label: 'My Campaigns', icon: Rocket, href: '/dashboard/creator/my-campaigns', roles: ['creator'] },
  { label: 'Withdrawals', icon: Wallet, href: '/dashboard/creator/withdrawals', roles: ['creator'] },
  { label: 'Payment History', icon: History, href: '/dashboard/creator/payment-history', roles: ['creator'] },
  // Admin
  { label: 'Manage Users', icon: Users, href: '/dashboard/admin/users', roles: ['admin'] },
  { label: 'Manage Campaigns', icon: Rocket, href: '/dashboard/admin/campaigns', roles: ['admin'] },
  { label: 'Campaign Approvals', icon: CheckCircle, href: '/dashboard/admin/campaign-approvals', roles: ['admin'] },
  { label: 'Withdrawal Requests', icon: Wallet, href: '/dashboard/admin/withdrawals', roles: ['admin'] },
  { label: 'Reports', icon: Flag, href: '/dashboard/admin/reports', roles: ['admin'] },
  { label: 'Payment History', icon: DollarSign, href: '/dashboard/admin/payments', roles: ['admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchNotifCount = async () => {
        try {
          const res = await notificationApi.getUnreadCount();
          if (res.data.success) setNotifCount(res.data.data.count);
        } catch { /* ignore */ }
      };
      fetchNotifCount();
      const interval = setInterval(fetchNotifCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = async () => {
    if (!notifOpen) {
      try {
        const res = await notificationApi.getAll({ limit: 10 });
        if (res.data.success) setNotifications(res.data.data);
      } catch { /* ignore */ }
    }
    setNotifOpen(!notifOpen);
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      setNotifCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch { /* ignore */ }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user.role));
  const credits = user.credits || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto no-scrollbar`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg gradient-text">FundForge AI</span>
          </Link>

          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-2xl">
              <span className="text-xs text-slate-500">Available Credits</span>
              <span className="text-sm font-bold gradient-text">{credits}</span>
            </div>
          </div>

          <nav className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 glass border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-2">
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <ThemeToggle />

              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <CreditCard className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-semibold">{credits}</span>
                <span className="text-xs text-slate-500">credits</span>
              </div>

              <div className="relative" ref={notifRef}>
                <button onClick={toggleNotifications} className="btn-ghost p-2.5 relative">
                  <Bell className="w-5 h-5" />
                  {notifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <Link href="/dashboard/notifications" className="text-xs text-primary-500 hover:underline" onClick={() => setNotifOpen(false)}>
                          View All
                        </Link>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-sm text-slate-500 p-4 text-center">No notifications</p>
                        ) : (
                          notifications.map((n: any) => (
                            <button
                              key={n._id}
                              onClick={() => markAsRead(n._id)}
                              className={`w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0 ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10 border-l-2 border-l-primary-500' : ''}`}
                            >
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={logout} className="btn-ghost p-2.5 text-red-500 hover:text-red-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
