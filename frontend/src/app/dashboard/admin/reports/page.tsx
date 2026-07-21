'use client';

import { useEffect, useState } from 'react';
import { Flag, Search } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getReports({ limit: 50 });
      if (res.data.success) setReports(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSuspend = async (campaignId: string) => {
    try {
      await adminApi.suspendCampaign(campaignId, 'Suspended due to report');
      fetch();
    } catch { /* ignore */ }
  };

  const handleDismiss = async (id: string) => {
    try {
      await adminApi.dismissReport(id);
      fetch();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Flag className="w-6 h-6" /> Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Review reported campaigns and take action</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : reports.length === 0 ? (
          <div className="p-8 text-center text-slate-500"><Flag className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p>No reports found</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Reporter</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r: any) => (
                <tr key={r._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">{r.reportedBy || r.reporterEmail}</td>
                  <td className="py-3 px-4 font-medium max-w-[150px] truncate">{r.campaignTitle}</td>
                  <td className="py-3 px-4 text-slate-500">{r.reason}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      r.status === 'resolved' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleSuspend(r.campaignId)} className="btn-ghost p-1.5 text-red-500 text-xs" title="Suspend campaign">Suspend</button>
                      <button onClick={() => handleDismiss(r._id)} className="btn-ghost p-1.5 text-slate-500 text-xs" title="Dismiss">Dismiss</button>
                    </div>
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
