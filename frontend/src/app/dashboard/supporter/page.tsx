'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CreditCard, Heart, ArrowRight, Wallet, Coins } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { dashboardApi, contributionApi } from '@/lib/api';

export default function SupporterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [approvedContribs, setApprovedContribs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, contribRes] = await Promise.all([
          dashboardApi.getSupporterStats(),
          contributionApi.getMyContributions({ status: 'approved', limit: 10 }),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (contribRes.data.success) setApprovedContribs(contribRes.data.data);
      } catch { /* ignore */ }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0] || 'Supporter'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.contributions?.total ?? '-'}</p>
          <p className="text-xs text-slate-500">Total Contributions</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.contributions?.pending ?? '-'}</p>
          <p className="text-xs text-slate-500">Pending Contributions</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats?.contributions?.approved ? `${stats.contributions.approved} credits` : '-'}</p>
          <p className="text-xs text-slate-500">Amount Contributed</p>
        </div>
      </div>

      {/* Approved Contributions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent-500" />
            Approved Contributions
          </h2>
          <Link href="/dashboard/supporter/contributions" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {approvedContribs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Campaign</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Creator</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedContribs.map((c: any) => (
                  <tr key={c._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-2 font-medium">{c.campaignTitle}</td>
                    <td className="py-3 px-2 font-semibold">{c.amount} credits</td>
                    <td className="py-3 px-2 text-slate-500">{c.creatorName || 'N/A'}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-xs bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 px-2 py-0.5 rounded-full font-medium">
                        approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Heart className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No approved contributions yet</p>
            <Link href="/explore" className="text-sm text-primary-500 hover:underline mt-2 inline-block">
              Explore campaigns to contribute
            </Link>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/explore" className="flex items-center gap-3 p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Explore Campaigns</span>
            </Link>
            <Link href="/dashboard/supporter/purchase-credit" className="flex items-center gap-3 p-3 rounded-2xl bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-colors">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Buy Credits</span>
            </Link>
            <Link href="/dashboard/supporter/contributions" className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">My Contributions</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Your Credits</h2>
          <div className="text-center py-4">
            <p className="text-4xl font-bold gradient-text">{user?.credits ?? 0}</p>
            <p className="text-sm text-slate-500 mt-1">Available Credits</p>
            <Link href="/dashboard/supporter/purchase-credit" className="btn-primary mt-4 w-full">
              <CreditCard className="w-4 h-4" /> Buy More Credits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
