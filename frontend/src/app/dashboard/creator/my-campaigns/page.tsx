'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@/types';

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await campaignApi.getMyCampaigns(params);
      if (res.data.success) {
        setCampaigns(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, [page, status]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will refund all supporters.')) return;
    try {
      await campaignApi.delete(id);
      fetchCampaigns();
    } catch { /* ignore */ }
    setDeleteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Campaigns</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your campaigns</p>
        </div>
        <Link href="/dashboard/creator/add-campaign" className="btn-primary">
          <PlusCircle className="w-5 h-5" /> New Campaign
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search campaigns..." className="input-field pl-10 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchCampaigns()} />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-auto text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={fetchCampaigns} className="btn-secondary text-sm">Search</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 flex gap-4">
              <div className="skeleton w-20 h-20 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-1/3" />
                <div className="skeleton h-4 w-1/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <motion.div key={campaign._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {campaign.image ? <img src={campaign.image} alt="" className="w-full h-full object-cover" /> : <Rocket className="w-6 h-6 text-primary-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{campaign.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{campaign.category}</span>
                  <span>{campaign.raisedAmount} / {campaign.goal} credits</span>
                  <span>{campaign.totalSupporters} supporters</span>
                </div>
                <div className="mt-2">
                  <span className={`badge text-xs ${
                    campaign.status === 'approved' ? 'badge-success' :
                    campaign.status === 'pending' ? 'badge-warning' :
                    campaign.status === 'rejected' ? 'badge-danger' :
                    campaign.status === 'suspended' ? 'badge-danger' :
                    'badge-info'
                  }`}>{campaign.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/campaigns/${campaign._id}`} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></Link>
                <button onClick={() => handleDelete(campaign._id)} className="btn-ghost p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Rocket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
          <p className="text-slate-500 mb-6">Start your first campaign today</p>
          <Link href="/dashboard/creator/add-campaign" className="btn-primary">Create Campaign</Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-2xl text-sm font-medium ${page === i + 1 ? 'gradient-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-2 disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
