'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Rocket, Check } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/providers/auth-provider';
import { authApi } from '@/lib/api';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'supporter' as 'supporter' | 'creator'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await authApi.googleAuth({
          access_token: tokenResponse.access_token,
          role: form.role,
        });
        if (res.data.success) {
          login(res.data.data.token, res.data.data.user);
          router.push(`/dashboard/${res.data.data.user.role}`);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Google registration failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google registration failed'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        router.push(`/dashboard/${res.data.data.user.role}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary-700 via-primary-700 to-primary-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-300 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative text-center px-12">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Join FundForge AI</h2>
          <p className="text-primary-100 text-lg max-w-md">
            Create your account and start your crowdfunding journey today. Get free credits to begin!
          </p>
          <div className="mt-8 space-y-4 text-left">
            {[
              'AI-powered campaign creation',
              'Secure credit-based contributions',
              'Real-time analytics & insights',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 text-accent-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl gradient-text">FundForge AI</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign In</Link>
          </p>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="John Doe" className="input-field pl-12" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={3} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" placeholder="you@example.com" className="input-field pl-12" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" className="input-field pl-12 pr-12" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {[
                  { label: '8+ chars', test: form.password.length >= 8 },
                  { label: 'Uppercase', test: /[A-Z]/.test(form.password) },
                  { label: 'Lowercase', test: /[a-z]/.test(form.password) },
                  { label: 'Number', test: /[0-9]/.test(form.password) },
                  { label: 'Special', test: /[^A-Za-z0-9]/.test(form.password) },
                ].map((req) => (
                  <span key={req.label} className={`px-2 py-1 rounded-lg text-xs ${req.test ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {req.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" placeholder="Repeat your password" className="input-field pl-12" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'supporter', label: 'Supporter', desc: 'Discover & contribute', credits: '50' },
                  { value: 'creator', label: 'Creator', desc: 'Launch campaigns', credits: '20' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: option.value as 'supporter' | 'creator' })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      form.role === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-sm">{option.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                    <p className="text-xs text-accent-500 font-medium mt-1">+{option.credits} free credits</p>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" required />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <Link href="#" className="text-primary-500 hover:text-primary-600">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-primary-500 hover:text-primary-600">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-950 text-slate-500">or continue with</span>
            </div>
          </div>

          <button onClick={() => handleGoogleRegister()} disabled={loading} className="btn-secondary w-full !py-3.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  );
}
