'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, CreditCard, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { authApi } from '@/lib/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await authApi.updateProfile({ name });
      if (res.data.success) {
        updateUser(res.data.data);
        setMessage('Profile updated successfully');
      }
    } catch {
      setMessage('Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account information</p>
      </div>

      <div className="grid gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Credits</p>
                <p className="font-medium">{user?.credits}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Joined</p>
                <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Edit Profile</h2>

          {message && (
            <div className={`p-3 rounded-2xl text-sm mb-4 ${
              message.includes('successfully')
                ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required minLength={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={user?.email} disabled className="input-field opacity-60" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
