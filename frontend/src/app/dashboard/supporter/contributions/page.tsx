'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { contributionApi } from '@/lib/api';
import { Contribution } from '@/types';

export default function SupporterContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (status) params.status = status;
      if (search) params.search = search;
      const res = await contributionApi.getMyContributions(params);
      if (res.data.success) {
        setContributions(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchContributions(); }, [page, status]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Contributions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your contributions to campaigns</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search..." className="input-field pl-10 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchContributions()} />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-auto text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchContributions} className="btn-secondary text-sm">Search</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-5 w-1/3 mb-2" />
              <div className="skeleton h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : contributions.length > 0 ? (
        <div className="space-y-3">
          {contributions.map((c) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{c.campaignTitle}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()} · {c.supporterName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{c.amount} credits</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  c.status === 'approved' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                  c.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                }`}>{c.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Contributions Yet</h3>
          <p className="text-slate-500">Start exploring campaigns to contribute</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-2xl text-sm font-medium ${page === i + 1 ? 'gradient-primary text-white' : 'hover:bg-slate-100'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-2 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
}
