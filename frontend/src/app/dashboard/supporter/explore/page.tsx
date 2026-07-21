'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Rocket, ArrowRight } from 'lucide-react';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@/types';

const categories = ['All', 'Technology', 'Health', 'Education', 'Community', 'Art', 'Environment', 'Animals', 'Emergency', 'Business'];

export default function SupporterExplore() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        const res = await campaignApi.getAll(params);
        if (res.data.success) { setCampaigns(res.data.data); setTotal(res.data.total); }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, [page, sort, category, search]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Explore Campaigns</h1>
        <p className="text-slate-500 text-sm mt-1">Discover campaigns that need your support</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search campaigns..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto">
          <option value="newest">Newest</option>
          <option value="most_raised">Most Raised</option>
          <option value="ending_soon">Ending Soon</option>
          <option value="trending">Trending</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === cat ? 'gradient-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
          >{cat}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden"><div className="skeleton h-40 rounded-none" /><div className="p-4 space-y-2"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-full" /><div className="skeleton h-2 w-full" /></div></div>
        )) : campaigns.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500"><Rocket className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>No campaigns found</p></div>
        ) : campaigns.map((c: any) => {
          const progress = c.goal > 0 ? Math.min((c.raisedAmount / c.goal) * 100, 100) : 0;
          return (
            <Link key={c._id} href={`/campaigns/${c._id}`} className="card-hover block overflow-hidden group">
              <div className="relative h-40 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30">
                {c.image ? <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center h-full"><Rocket className="w-10 h-10 text-primary-300" /></div>}
                <span className="absolute top-2 left-2 text-xs px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 rounded-full font-medium">{c.category}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-500 mb-2">by {c.creatorName}</p>
                <div className="flex justify-between text-xs mb-1"><span className="font-medium">{c.raisedAmount} raised</span><span className="text-slate-500">{c.goal} goal</span></div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"><div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium ${page === p ? 'gradient-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
