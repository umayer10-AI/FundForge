'use client';

import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getPayments({ limit: 50 });
        if (res.data.success) setPayments(res.data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><DollarSign className="w-6 h-6" /> Payment History</h1>
        <p className="text-slate-500 text-sm mt-1">All platform payments and transactions</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : payments.length === 0 ? (
          <div className="p-8 text-center text-slate-500"><DollarSign className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p>No payments found</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Package</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Credits</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">{p.email}</td>
                  <td className="py-3 px-4">{p.packageName}</td>
                  <td className="py-3 px-4">{p.credits}</td>
                  <td className="py-3 px-4 font-medium">${p.price}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.status === 'succeeded' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                      p.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>{p.status}</span>
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
