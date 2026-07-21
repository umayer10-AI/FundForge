'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { notificationApi } from '@/lib/api';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll({ page, limit: 20 });
      if (res.data.success) {
        setNotifications(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [page]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.delete(id);
      fetchNotifications();
    } catch { /* ignore */ }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all notifications?')) return;
    try {
      await notificationApi.clearAll();
      fetchNotifications();
    } catch { /* ignore */ }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with platform activity</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleMarkAllRead} className="btn-ghost text-sm"><CheckCheck className="w-4 h-4" /> Mark All Read</button>
          <button onClick={handleClearAll} className="btn-ghost text-sm text-red-500"><Trash2 className="w-4 h-4" /> Clear All</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4"><div className="skeleton h-5 w-3/4 mb-2" /><div className="skeleton h-4 w-1/2" /></div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-4 flex items-start justify-between gap-4 cursor-pointer hover:shadow-md transition-all ${!notif.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
              onClick={() => !notif.isRead && handleMarkRead(notif._id)}
            >
              <div className="flex items-start gap-3">
                <Bell className={`w-5 h-5 mt-0.5 ${!notif.isRead ? 'text-primary-500' : 'text-slate-400'}`} />
                <div>
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(notif._id); }} className="btn-ghost p-1 text-slate-400 hover:text-red-500 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
          <p className="text-slate-500">You're all caught up!</p>
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
