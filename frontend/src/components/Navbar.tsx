'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard, CreditCard, ExternalLink } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/dashboard/${user.role}`;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore Campaigns' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl gradient-text">FundForge AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="btn-ghost text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <CreditCard className="w-4 h-4 text-accent-500" />
                  <span className="text-sm font-semibold">{user?.credits ?? 0}</span>
                  <span className="text-xs text-slate-500">credits</span>
                </div>

                <Link href={getDashboardLink()} className="btn-ghost p-2.5 relative">
                  <Bell className="w-5 h-5" />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 btn-ghost"
                  >
                    <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/30 p-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 mb-1">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                        </div>
                        <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href={`/dashboard/${user?.role}/profile`} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm w-full">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href="https://github.com/anomalyco/opencode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Join as Developer
                </a>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm !py-2.5 !px-5">
                  Get Started
                </Link>
                <a
                  href="https://github.com/anomalyco/opencode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Join as Developer
                </a>
              </div>
            )}

            <button
              className="md:hidden btn-ghost p-2.5"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200/50 dark:border-slate-700/30"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-slate-200 dark:border-slate-700 my-2" />
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role} · {user?.credits} credits</p>
                    </div>
                  </div>
                  <Link href={getDashboardLink()} className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium" onClick={() => setIsMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <a
                    href="https://github.com/anomalyco/opencode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium"
                  >
                    <ExternalLink className="w-3 h-3 inline" /> Join as Developer
                  </a>
                  <button onClick={() => { logout(); setIsMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium" onClick={() => setIsMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-3 rounded-xl text-sm font-medium" onClick={() => setIsMobileOpen(false)}>
                    <span className="btn-primary w-full text-center inline-block">Get Started</span>
                  </Link>
                  <a
                    href="https://github.com/anomalyco/opencode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium"
                  >
                    <ExternalLink className="w-3 h-3 inline" /> Join as Developer
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
