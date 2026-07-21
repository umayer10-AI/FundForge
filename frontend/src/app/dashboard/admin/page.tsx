'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Rocket, DollarSign, Wallet, Flag, Shield, BarChart, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getDashboard();
        if (res.data.success) setStats(res.data.data);
      } catch { /* ignore */ }
    };
    fetch();
  }, []);

  const statCards = [
    { label: 'Total Supporters', value: stats?.users?.supporters ?? '-', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Creators', value: stats?.users?.creators ?? '-', icon: Rocket, color: 'from-purple-500 to-violet-500' },
    { label: 'Available Credits', value: stats?.totalRaised ?? '-', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: 'Payments Processed', value: stats?.payments ?? '-', icon: BarChart, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xl font-bold">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/admin/campaign-approvals" className="card-hover p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-accent-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats?.campaigns?.pending ?? 0}</p>
            <p className="text-xs text-slate-500">Pending Approvals</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/withdrawals" className="card-hover p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats?.withdrawals?.pending ?? 0}</p>
            <p className="text-xs text-slate-500">Pending Withdrawals</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/reports" className="card-hover p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats?.reports?.pending ?? 0}</p>
            <p className="text-xs text-slate-500">Pending Reports</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/users" className="card-hover p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats?.users?.total ?? 0}</p>
            <p className="text-xs text-slate-500">Total Users</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
