'use client';

import { useEffect, useState } from 'react';
import { History, Wallet } from 'lucide-react';
import { withdrawalApi } from '@/lib/api';

export default function CreatorPaymentHistory() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await withdrawalApi.getMyWithdrawals({ limit: 50 });
        if (res.data.success) setWithdrawals(res.data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><History className="w-6 h-6" /> Payment History</h1>
        <p className="text-slate-500 text-sm mt-1">All your withdrawal requests and payments</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Wallet className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No withdrawal history yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Credits</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Amount ($)</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Method</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w: any) => (
                <tr key={w._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4 text-slate-500">{new Date(w.requestedAt || w.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium">{w.credits}</td>
                  <td className="py-3 px-4 font-medium">${w.amount?.toFixed(2)}</td>
                  <td className="py-3 px-4 capitalize text-slate-500">{w.paymentMethod}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      w.status === 'approved' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                      w.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                    }`}>{w.status}</span>
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
