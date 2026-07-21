'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { CreditPackage } from '@/types';
import { useAuth } from '@/providers/auth-provider';

export default function PurchaseCreditPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await paymentApi.getPackages();
        if (res.data.success) setPackages(res.data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id);
    try {
      const res = await paymentApi.createCheckoutSession({ packageId: pkg.id });
      if (res.data.success && res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to initiate purchase');
    }
    setPurchasing(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Purchase Credits</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Current balance: <span className="font-bold text-accent-500">{user?.credits ?? 0} credits</span>
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-6 text-center relative ${
                pkg.popular ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/20' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              {pkg.save && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-accent-500 text-white text-xs font-medium rounded-full">
                  Save
                </div>
              )}

              <p className="text-sm text-slate-500 mb-2">{pkg.name}</p>
              <p className="text-4xl font-bold mb-2">{pkg.credits}</p>
              <p className="text-sm text-slate-400 mb-1">credits</p>
              <div className="text-2xl font-bold gradient-text mb-4">${pkg.price}</div>
              <p className="text-xs text-slate-400 mb-4">{pkg.credits / 10} credits per dollar</p>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing === pkg.id}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all ${
                  pkg.popular
                    ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                    : 'border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 text-slate-700 dark:text-slate-300'
                }`}
              >
                {purchasing === pkg.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  `Buy $${pkg.price}`
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-12 card p-6">
        <h2 className="font-semibold text-lg mb-4">Why buy credits?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Support creators and their campaigns',
            'Credits never expire',
            'Secure payment via Stripe',
            'Instant credit addition after payment',
            'Use credits across any campaign',
            'Refunded if contribution is rejected',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <Check className="w-4 h-4 text-accent-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
