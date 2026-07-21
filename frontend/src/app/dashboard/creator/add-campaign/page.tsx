'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import { campaignApi, aiApi } from '@/lib/api';

const categories = ['Technology', 'Health', 'Education', 'Community', 'Art', 'Environment', 'Animals', 'Emergency', 'Business'];

export default function AddCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', goal: '', minimumContribution: '', deadline: '',
    story: '', reward: '', image: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAiAction = async (action: string) => {
    if (!form.story && action !== 'title') {
      alert('Please write a campaign story first before using AI.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiApi.chat({
        message: form.story || form.title || '',
        type: action,
        campaignData: { title: form.title, story: form.story, category: form.category, goal: Number(form.goal) },
      });
      if (res.data?.success && res.data?.data?.response) {
        const response = res.data.data.response;
        if (action === 'title') {
          setForm(f => ({ ...f, title: response.slice(0, 200) }));
        } else if (action === 'improve' || action === 'grammar') {
          setForm(f => ({ ...f, story: response }));
        } else {
          alert(response.slice(0, 500));
        }
      } else {
        alert(res.data?.message || 'AI request failed. Please try again.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'AI service error. Check your connection.');
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (new Date(form.deadline) <= new Date()) {
      setError('Deadline must be in the future');
      setLoading(false);
      return;
    }

    try {
      const res = await campaignApi.create({
        ...form,
        goal: Number(form.goal),
        minimumContribution: Number(form.minimumContribution),
      });
      if (res.data.success) {
        router.push('/dashboard/creator/my-campaigns');
      }
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data?.message || 'Failed to create campaign';
      const details = data?.errors?.length ? data.errors.join('; ') : '';
      setError(details || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Create New Campaign</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Launch your next big idea</p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[
          { num: 1, label: 'Info' },
          { num: 2, label: 'Details' },
          { num: 3, label: 'Media' },
          { num: 4, label: 'Review' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s.num ? 'gradient-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
            }`}>{s.num}</div>
            <span className={`text-sm hidden md:block ${step >= s.num ? 'font-medium' : 'text-slate-400'}`}>{s.label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Title</label>
              <div className="flex gap-2">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Enter a compelling title" className="input-field flex-1" />
                <button type="button" onClick={() => handleAiAction('title')} disabled={aiLoading} className="btn-secondary !px-3" title="Generate with AI">
                  <Sparkles className={`w-5 h-5 ${aiLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
               <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="">Select category</option>
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Funding Goal (credits)</label>
                <input name="goal" type="number" value={form.goal} onChange={handleChange} placeholder="1000" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Contribution</label>
                <input name="minimumContribution" type="number" value={form.minimumContribution} onChange={handleChange} placeholder="10" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Campaign Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input-field" />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Campaign Story</label>
                <div className="flex gap-1">
                  <button type="button" onClick={() => handleAiAction('improve')} disabled={aiLoading} className="btn-ghost text-xs" title="Improve with AI">
                    <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} /> Improve
                  </button>
                  <button type="button" onClick={() => handleAiAction('grammar')} disabled={aiLoading} className="btn-ghost text-xs" title="Fix Grammar">
                    <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} /> Grammar
                  </button>
                </div>
              </div>
              <textarea
                name="story" value={form.story} onChange={handleChange}
                placeholder="Tell your story... why does this campaign matter? (at least 200 characters)"
                className="input-field min-h-[250px] resize-y"
              />
              <p className="text-xs text-slate-400 mt-1">{form.story.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reward Information (optional)</label>
              <textarea
                name="reward" value={form.reward} onChange={handleChange}
                placeholder="Describe what supporters will receive..."
                className="input-field min-h-[100px] resize-y"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Cover Image</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-sm text-slate-500 mb-2">Drag and drop or click to upload</p>
                <p className="text-xs text-slate-400">JPG, PNG, WebP up to 5MB</p>
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Or paste image URL here"
                  className="input-field mt-4"
                />
              </div>
              {form.image && (
                <div className="mt-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <img src={form.image} alt="Preview" className="max-h-48 rounded-xl mx-auto" />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="card p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Title:</span> <span className="font-medium">{form.title}</span></div>
                <div><span className="text-slate-500">Category:</span> <span className="font-medium">{form.category}</span></div>
                <div><span className="text-slate-500">Goal:</span> <span className="font-medium">{form.goal} credits</span></div>
                <div><span className="text-slate-500">Min. Contribution:</span> <span className="font-medium">{form.minimumContribution} credits</span></div>
                <div><span className="text-slate-500">Deadline:</span> <span className="font-medium">{form.deadline}</span></div>
              </div>
              <hr className="border-slate-200 dark:border-slate-700" />
              <div>
                <p className="text-sm text-slate-500 mb-2">Story Preview:</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-5">{form.story}</p>
              </div>
              {form.reward && (
                <>
                  <hr className="border-slate-200 dark:border-slate-700" />
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Rewards:</p>
                    <p className="text-sm">{form.reward}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button type="button" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="btn-secondary disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {step < 4 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} className="btn-primary">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Campaign</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
