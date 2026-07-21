'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, Heart, TrendingUp, DollarSign, PlusCircle, Users, Wallet, Clock, X, Check, Eye } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { dashboardApi, contributionApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreatorDashboard() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [pendingContribs, setPendingContribs] = useState<any[]>([]);
  const [selectedContrib, setSelectedContrib] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, contribRes] = await Promise.all([
        dashboardApi.getCreatorStats(),
        contributionApi.getCreatorContributions({ status: 'pending', limit: 50 }),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (contribRes.data.success) setPendingContribs(contribRes.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await contributionApi.approve(id);
      setPendingContribs(prev => prev.filter(c => c._id !== id));
      setSelectedContrib(null);
      await fetchData();
      refreshUser();
    } catch { /* ignore */ }
  };

  const handleReject = async (id: string) => {
    try {
      await contributionApi.reject(id);
      setPendingContribs(prev => prev.filter(c => c._id !== id));
      setSelectedContrib(null);
      await fetchData();
      refreshUser();
    } catch { /* ignore */ }
  };

  const statCards = [
    { label: 'Total Campaigns', value: stats?.campaigns?.total ?? '-', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Campaigns', value: stats?.campaigns?.active ?? '-', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Raised', value: `${stats?.totalRaised ?? 0} credits`, icon: DollarSign, color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your campaigns and contributions</p>
        </div>
        <Link href="/dashboard/creator/add-campaign" className="btn-primary">
          <PlusCircle className="w-5 h-5" /> New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Contributions To Review */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Contributions To Review
            {pendingContribs.length > 0 && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                {pendingContribs.length} pending
              </span>
            )}
          </h2>
        </div>

        {pendingContribs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Supporter</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Campaign</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Amount</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingContribs.map((c: any) => (
                  <tr key={c._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                          {c.supporterName?.charAt(0)}
                        </div>
                        <span className="font-medium">{c.supporterName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{c.campaignTitle}</td>
                    <td className="py-3 px-2 font-semibold">{c.amount} credits</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedContrib(c)}
                          className="btn-ghost p-1.5 text-xs"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(c._id)}
                          className="btn-ghost p-1.5 text-accent-500 hover:text-accent-600"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          className="btn-ghost p-1.5 text-red-500 hover:text-red-600"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Heart className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No pending contributions to review</p>
          </div>
        )}
      </div>

      {/* View Contribution Modal */}
      <AnimatePresence>
        {selectedContrib && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedContrib(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Contribution Details</h3>
                <button onClick={() => setSelectedContrib(null)} className="btn-ghost p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500">Supporter</span>
                  <span className="text-sm font-medium">{selectedContrib.supporterName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500">Campaign</span>
                  <span className="text-sm font-medium">{selectedContrib.campaignTitle}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500">Amount</span>
                  <span className="text-sm font-bold text-accent-500">{selectedContrib.amount} credits</span>
                </div>
                {selectedContrib.message && (
                  <div className="py-2">
                    <span className="text-sm text-slate-500 block mb-1">Message</span>
                    <p className="text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3">{selectedContrib.message}</p>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500">Date</span>
                  <span className="text-sm">{new Date(selectedContrib.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => { handleApprove(selectedContrib._id); }} className="btn-primary flex-1">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => { handleReject(selectedContrib._id); }} className="btn-danger flex-1">
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/creator/add-campaign" className="flex items-center gap-3 p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors">
              <PlusCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Create New Campaign</span>
            </Link>
            <Link href="/dashboard/creator/my-campaigns" className="flex items-center gap-3 p-3 rounded-2xl bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 transition-colors">
              <Rocket className="w-5 h-5" />
              <span className="text-sm font-medium">View My Campaigns</span>
            </Link>
            <Link href="/dashboard/creator/withdrawals" className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Withdraw Earnings</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Campaign Tips</h2>
          <div className="space-y-3">
            {[
              'Use high-quality images for your campaign cover',
              'Write a compelling story that connects emotionally',
              'Set realistic funding goals based on your needs',
              'Promote your campaign on social media regularly',
              'Engage with your supporters and thank them',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent-600 dark:text-accent-400 text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-slate-600 dark:text-slate-400">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
