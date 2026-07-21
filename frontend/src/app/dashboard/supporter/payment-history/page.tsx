'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { Payment } from '@/types';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await paymentApi.getHistory({ page, limit: 10 });
        if (res.data.success) {
          setPayments(res.data.data);
          setTotalPages(res.data.totalPages);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchData();
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Payment History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View your credit purchase history</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((p) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{p.packageName} - {p.credits} credits</p>
                  <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()} · {p.paymentMethod || 'card'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">${p.price}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.status === 'succeeded' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                  p.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                }`}>{p.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Purchase History</h3>
          <p className="text-slate-500">Buy credits to start contributing</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2"><ChevronLeft className="w-5 h-5" /></button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-2xl text-sm font-medium ${page === i + 1 ? 'gradient-primary text-white' : 'hover:bg-slate-100'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-2"><ChevronRight className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
}
