'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Calendar, Target, Users, ChevronDown, Send, Flag, Share2, Rocket } from 'lucide-react';
import { campaignApi, contributionApi, reportApi } from '@/lib/api';
import { Campaign } from '@/types';
import { useAuth } from '@/providers/auth-provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [contributing, setContributing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDesc, setReportDesc] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignApi.getById(id as string);
        if (res.data.success) setCampaign(res.data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchCampaign();
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/login'); return; }
    setContributing(true);
    try {
      const res = await contributionApi.create({ campaignId: id, amount: Number(amount), message });
      if (res.data.success) {
        alert('Contribution submitted! Awaiting creator approval.');
        setAmount('');
        setMessage('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Contribution failed');
    }
    setContributing(false);
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await reportApi.create({ campaignId: id, reason: reportReason, description: reportDesc });
      if (res.data.success) {
        alert('Report submitted. Thank you for helping keep our platform safe.');
        setShowReport(false);
        setReportReason('');
        setReportDesc('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit report');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 max-w-4xl mx-auto px-4 py-12">
          <div className="skeleton h-64 rounded-3xl mb-8" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 max-w-4xl mx-auto px-4 py-20 text-center">
          <Rocket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
          <p className="text-slate-500 mb-6">This campaign doesn't exist or has been removed.</p>
          <Link href="/explore" className="btn-primary">Explore Campaigns</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const progress = campaign.goal > 0 ? Math.min((campaign.raisedAmount / campaign.goal) * 100, 100) : 0;
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const isSupporter = user?.role === 'supporter';

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30">
                {campaign.image ? (
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Rocket className="w-20 h-20 text-primary-300 dark:text-primary-600" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="badge-primary">{campaign.category}</span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{campaign.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> by {campaign.creatorName}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {daysLeft} days left</span>
                  <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {campaign.totalSupporters} supporters</span>
                </div>

                <div className="lg:hidden mb-6 card p-5">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-lg">{campaign.raisedAmount} credits</span>
                      <span className="text-slate-500">raised of {campaign.goal}</span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{progress.toFixed(1)}% funded</p>
                  </div>

                  {isSupporter && (
                    <form onSubmit={handleContribute} className="space-y-3">
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min. ${campaign.minimumContribution} credits`} className="input-field" required min={campaign.minimumContribution} max={user?.credits} />
                      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a message (optional)" className="input-field" />
                      <button type="submit" disabled={contributing || !amount} className="btn-primary w-full">
                        <Heart className="w-4 h-4" /> {contributing ? 'Processing...' : 'Contribute Now'}
                      </button>
                    </form>
                  )}
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-xl font-semibold mb-3">Story</h2>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {campaign.story}
                  </div>
                </div>

                {campaign.reward && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">Rewards</h2>
                    <div className="card p-5">
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{campaign.reward}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24 card p-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-xl">{campaign.raisedAmount}</span>
                    <span className="text-slate-500">raised</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Goal: {campaign.goal} credits</span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {daysLeft} days left</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {campaign.totalSupporters} supporters</span>
                </div>

                {isSupporter ? (
                  <form onSubmit={handleContribute} className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Amount (credits)</label>
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min. ${campaign.minimumContribution}`} className="input-field" required min={campaign.minimumContribution} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Message (optional)</label>
                      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say something nice..." className="input-field" />
                    </div>
                    <button type="submit" disabled={contributing || !amount} className="btn-primary w-full">
                      <Heart className="w-4 h-4" /> {contributing ? 'Processing...' : `Contribute ${amount || ''} Credits`}
                    </button>
                    <p className="text-xs text-slate-400 text-center">Your balance: {user?.credits ?? 0} credits</p>
                  </form>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-slate-500">Sign in to contribute</p>
                    <Link href="/login" className="btn-primary w-full">Sign In</Link>
                  </div>
                )}

                <hr className="my-6 border-slate-200 dark:border-slate-700" />

                <div className="flex items-center justify-between">
                  <button onClick={() => setShowReport(!showReport)} className="btn-ghost text-xs text-slate-500">
                    <Flag className="w-4 h-4" /> Report
                  </button>
                  <button className="btn-ghost text-xs text-slate-500">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>

                {showReport && (
                  <form onSubmit={handleReport} className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                    <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="input-field text-sm" required>
                      <option value="">Select reason</option>
                      <option value="Fake Campaign">Fake Campaign</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Spam">Spam</option>
                      <option value="Misleading">Misleading Information</option>
                      <option value="Other">Other</option>
                    </select>
                    <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} placeholder="Description (optional)" className="input-field text-sm min-h-[60px]" maxLength={500} />
                    <button type="submit" className="btn-danger w-full text-sm">Submit Report</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
