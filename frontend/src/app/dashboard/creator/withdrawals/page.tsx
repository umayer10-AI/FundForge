'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { withdrawalApi, dashboardApi } from '@/lib/api';
import { Withdrawal } from '@/types';

export default function CreatorWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ credits: '', paymentMethod: 'stripe', accountNumber: '', remarks: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wdRes, statsRes] = await Promise.all([
        withdrawalApi.getMyWithdrawals({ page, limit: 10 }),
        dashboardApi.getCreatorStats(),
      ]);
      if (wdRes.data.success) {
        setWithdrawals(wdRes.data.data);
        setTotalPages(wdRes.data.totalPages);
      }
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await withdrawalApi.request({
        credits: Number(form.credits),
        paymentMethod: form.paymentMethod,
        accountNumber: form.accountNumber,
        remarks: form.remarks,
      });
      setShowForm(false);
      setForm({ credits: '', paymentMethod: 'stripe', accountNumber: '', remarks: '' });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit withdrawal');
    }
    setSubmitting(false);
  };

  const amount = form.credits ? Number(form.credits) / 20 : 0;
  const available = stats?.availableWithdrawal ?? 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Withdrawals</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Available: {available} credits</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Wallet className="w-5 h-5" /> Request Withdrawal
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">New Withdrawal Request</h2>
          <p className="text-sm text-slate-500 mb-4">20 credits = $1 · Minimum 200 credits · Available: {available} credits</p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Credits</label>
              <input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} placeholder="200 minimum" className="input-field" required min={200} max={available} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <input type="text" value={`$${amount.toFixed(2)}`} disabled className="input-field opacity-60" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="input-field">
                <option value="stripe">Stripe</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input type="text" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Remarks (optional)</label>
              <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="input-field min-h-[60px]" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting || Number(form.credits) > available} className="btn-primary">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Submit Request
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : withdrawals.length > 0 ? (
        <div className="space-y-3">
          {withdrawals.map((wd) => (
            <motion.div key={wd._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{wd.credits} credits = ${wd.amount}</p>
                <p className="text-xs text-slate-500">{wd.paymentMethod} · {wd.accountNumber} · {new Date(wd.requestedAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                wd.status === 'approved' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                wd.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
              }`}>{wd.status}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Withdrawals Yet</h3>
          <p className="text-slate-500">Raise credits from your campaigns to withdraw</p>
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
