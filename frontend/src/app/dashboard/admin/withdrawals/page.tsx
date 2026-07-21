'use client';

import { useEffect, useState } from 'react';
import { Wallet, DollarSign } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getWithdrawals({ status: 'pending', limit: 50 });
      if (res.data.success) setWithdrawals(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveWithdrawal(id);
      fetch();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Wallet className="w-6 h-6" /> Withdrawal Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Process creator withdrawal requests</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : withdrawals.length === 0 ? (
          <div className="p-8 text-center text-slate-500"><Wallet className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p>No pending withdrawal requests</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Creator</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Credits</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Amount ($)</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Method</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Account</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w: any) => (
                <tr key={w._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">{w.creatorName || w.creatorEmail}</td>
                  <td className="py-3 px-4">{w.credits}</td>
                  <td className="py-3 px-4 font-semibold">${w.amount?.toFixed(2)}</td>
                  <td className="py-3 px-4 capitalize text-slate-500">{w.paymentMethod}</td>
                  <td className="py-3 px-4 text-slate-500">{w.accountNumber}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleApprove(w._id)} className="btn-primary text-xs !py-1.5 !px-3">
                      Payment Success
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
