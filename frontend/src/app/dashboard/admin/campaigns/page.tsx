'use client';

import { useEffect, useState } from 'react';
import { Rocket, Trash2 } from 'lucide-react';
import { adminApi, campaignApi } from '@/lib/api';

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCampaigns({ limit: 50 });
      if (res.data.success) setCampaigns(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign? All approved supporters will be refunded.')) return;
    try {
      const res = await campaignApi.delete(id);
      if (res.data.success) fetch();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Rocket className="w-6 h-6" /> Manage Campaigns</h1>
        <p className="text-slate-500 text-sm mt-1">View and manage all campaigns</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : campaigns.length === 0 ? (
          <div className="p-8 text-center text-slate-500"><Rocket className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p>No campaigns found</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Title</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Creator</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Goal</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Raised</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c: any) => (
                <tr key={c._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium max-w-[200px] truncate">{c.title}</td>
                  <td className="py-3 px-4 text-slate-500">{c.creatorName}</td>
                  <td className="py-3 px-4">{c.goal}</td>
                  <td className="py-3 px-4">{c.raisedAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === 'approved' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                      c.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      c.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>{c.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="btn-ghost p-1.5 text-red-500 hover:text-red-600" title="Delete campaign">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
