'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Rocket, ArrowRight, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ExploreContent() {
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Technology', 'Health', 'Education', 'Community', 'Art', 'Environment', 'Animals', 'Emergency', 'Business'];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await campaignApi.getAll(params);
        if (res.data.success) {
          setCampaigns(res.data.data);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchCampaigns();
  }, [page, sort, search, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Campaigns</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Discover amazing campaigns and support creators around the world
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns by title, creator, or category..."
                className="input-field pl-12 pr-4 h-14 text-base"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setCategory(''); setPage(1); }}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${!category ? 'gradient-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat === category ? '' : cat); setPage(1); }}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${category === cat ? 'gradient-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input-field w-auto min-w-[160px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_raised">Most Raised</option>
              <option value="least_raised">Least Raised</option>
              <option value="most_supporters">Most Popular</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="highest_goal">Highest Goal</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton h-48 rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-2 w-full" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign, i) => (
                  <motion.div key={campaign._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link href={`/campaigns/${campaign._id}`} className="card-hover block overflow-hidden group">
                      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30">
                        {campaign.image ? (
                          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Rocket className="w-12 h-12 text-primary-300 dark:text-primary-600" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="badge-primary">{campaign.category}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{campaign.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{campaign.story?.substring(0, 100)}...</p>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{campaign.raisedAmount} raised</span>
                            <span className="text-slate-500">{campaign.goal} goal</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full gradient-primary rounded-full" style={{ width: `${Math.min((campaign.raisedAmount / campaign.goal) * 100, 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>by {campaign.creatorName}</span>
                          <span>{campaign.totalSupporters} supporters</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-2xl text-sm font-medium transition-all ${
                        page === i + 1 ? 'gradient-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-2 disabled:opacity-30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Rocket className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {search ? `No results for "${search}". Try different keywords.` : 'No campaigns available yet.'}
              </p>
              {!search && (
                <Link href="/register" className="btn-primary">
                  Start a Campaign <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Campaigns</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Loading campaigns...</p>
          </div>
        </div>
      </main>
    }>
      <ExploreContent />
    </Suspense>
  );
}
