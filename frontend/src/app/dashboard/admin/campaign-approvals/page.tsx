'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CampaignApprovals() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCampaigns({ status: 'pending', limit: 50 });
      if (res.data.success) setCampaigns(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: string) => {
    try { await adminApi.approveCampaign(id); fetch(); setSelected(null); } catch { /* ignore */ }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try { await adminApi.rejectCampaign(id, reason); fetch(); setSelected(null); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><CheckCircle className="w-6 h-6" /> Campaign Approvals</h1>
        <p className="text-slate-500 text-sm mt-1">Review and approve or reject pending campaigns</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : campaigns.length === 0 ? (
          <div className="p-8 text-center text-slate-500"><CheckCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p>No pending campaigns</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Title</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Creator</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Goal</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c: any) => (
                <tr key={c._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium max-w-[200px] truncate">
                    <button onClick={() => setSelected(c)} className="hover:text-primary-500 text-left">{c.title}</button>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{c.creatorName}</td>
                  <td className="py-3 px-4">{c.goal} credits</td>
                  <td className="py-3 px-4 text-slate-500">{c.category}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(c)} className="btn-ghost p-1.5 text-xs"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleApprove(c._id)} className="btn-ghost p-1.5 text-accent-500"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => handleReject(c._id)} className="btn-ghost p-1.5 text-red-500"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Campaign Preview</h3>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1"><X className="w-5 h-5" /></button>
              </div>
              {selected.image && <img src={selected.image} alt="" className="w-full h-40 object-cover rounded-2xl mb-4" />}
              <div className="space-y-3">
                <div><span className="text-xs text-slate-500">Title</span><p className="font-medium">{selected.title}</p></div>
                <div><span className="text-xs text-slate-500">Story</span><p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-6">{selected.story}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-xs text-slate-500">Goal</span><p className="font-medium">{selected.goal} credits</p></div>
                  <div><span className="text-xs text-slate-500">Min Contribution</span><p className="font-medium">{selected.minimumContribution} credits</p></div>
                  <div><span className="text-xs text-slate-500">Category</span><p className="font-medium">{selected.category}</p></div>
                  <div><span className="text-xs text-slate-500">Deadline</span><p className="font-medium">{new Date(selected.deadline).toLocaleDateString()}</p></div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => { handleApprove(selected._id); }} className="btn-primary flex-1"><CheckCircle className="w-4 h-4" /> Approve</button>
                <button onClick={() => { handleReject(selected._id); }} className="btn-danger flex-1"><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
