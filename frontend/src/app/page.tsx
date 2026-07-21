'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight, Search, Shield, Zap, Bell, Users, BarChart, Heart,
  Rocket, ChevronRight, Star, ChevronDown, Send, Target, Globe, Award,
  ChevronLeft, ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@/types';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

const heroSlides = [
  {
    badge: 'AI-Powered Crowdfunding',
    title: 'Forge Ideas.',
    gradient: 'Fund Dreams.',
    subtitle: 'Empower Communities.',
    desc: 'Launch your campaign in minutes with AI-powered assistance. Connect with supporters worldwide and bring your projects to life.',
    cta: 'Start a Campaign',
    ctaLink: '/register',
    secondary: 'Explore Campaigns',
    secondaryLink: '/explore',
    stats: [
      { value: '$2M+', label: 'Total Raised' },
      { value: '10K+', label: 'Supporters' },
      { value: '500+', label: 'Campaigns' },
    ],
    bg: 'from-primary-50 via-white to-secondary-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
  },
  {
    badge: 'Support Innovation',
    title: 'Discover.',
    gradient: 'Fund the Future.',
    subtitle: 'Be Part of Something Bigger.',
    desc: 'Browse hundreds of campaigns from passionate creators. Every contribution brings groundbreaking ideas one step closer to reality.',
    cta: 'Explore Campaigns',
    ctaLink: '/explore',
    secondary: 'Learn More',
    secondaryLink: '/#how-it-works',
    stats: [
      { value: '50K+', label: 'Contributions' },
      { value: '95%', label: 'Success Rate' },
      { value: '150+', label: 'Countries' },
    ],
    bg: 'from-secondary-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
  },
  {
    badge: 'Creator-First Platform',
    title: 'Create.',
    gradient: 'Grow Your Vision.',
    subtitle: 'We Handle the Rest.',
    desc: 'From AI-assisted campaign creation to real-time analytics and seamless withdrawals - everything you need to succeed.',
    cta: 'Start Creating',
    ctaLink: '/register',
    secondary: 'How It Works',
    secondaryLink: '/#how-it-works',
    stats: [
      { value: '1000+', label: 'Creators' },
      { value: '$1.5M+', label: 'Paid Out' },
      { value: '24/7', label: 'AI Support' },
    ],
    bg: 'from-accent-50 via-white to-primary-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
  },
];

export default function HomePage() {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await campaignApi.getFeatured();
        if (res.data.success) setFeaturedCampaigns(res.data.data);
      } catch { /* ignore */ }
    };
    fetchFeatured();
  }, []);

  const nextHero = useCallback(() => setHeroIdx(i => (i + 1) % heroSlides.length), []);
  const prevHero = useCallback(() => setHeroIdx(i => (i - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(nextHero, 5000);
    return () => clearInterval(timer);
  }, [nextHero]);

  const categories = [
    { name: 'Technology', icon: '💻', count: '120+ Campaigns' },
    { name: 'Health', icon: '❤️', count: '85+ Campaigns' },
    { name: 'Education', icon: '📚', count: '95+ Campaigns' },
    { name: 'Community', icon: '🤝', count: '150+ Campaigns' },
    { name: 'Art', icon: '🎨', count: '65+ Campaigns' },
    { name: 'Environment', icon: '🌱', count: '45+ Campaigns' },
    { name: 'Animals', icon: '🐾', count: '30+ Campaigns' },
    { name: 'Emergency', icon: '🚨', count: '20+ Campaigns' },
  ];

  const features = [
    { icon: Shield, title: 'Secure Payments', desc: 'Industry-standard encryption and Stripe-powered secure transactions.' },
    { icon: Zap, title: 'AI Assistant', desc: 'Smart campaign creation with AI-powered suggestions and optimization.' },
    { icon: Bell, title: 'Real-time Notifications', desc: 'Stay updated with instant notifications and email alerts.' },
    { icon: Users, title: 'Community Driven', desc: 'Built by the community, for the community. Transparent and fair.' },
    { icon: BarChart, title: 'Analytics Dashboard', desc: 'Detailed insights and analytics for your campaigns.' },
    { icon: Heart, title: 'Easy Contributions', desc: 'Simple credit-based contribution system with quick checkout.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Campaign Creator', photo: 'SJ', comment: 'FundForge AI helped me raise $50,000 for my community project. The AI assistance was incredibly helpful!', rating: 5 },
    { name: 'Michael Chen', role: 'Supporter', photo: 'MC', comment: 'I love how easy it is to discover and contribute to meaningful campaigns. The platform is amazing.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'Creator', photo: 'ER', comment: 'The analytics and campaign management tools are top-notch. This is the future of crowdfunding.', rating: 5 },
    { name: 'David Kim', role: 'Supporter', photo: 'DK', comment: 'Secure, transparent, and community-focused. FundForge AI is everything I wanted in a crowdfunding platform.', rating: 4 },
  ];

  const [testiIdx, setTestiIdx] = useState(0);

  const impactStats = [
    { icon: Heart, value: '$2M+', label: 'Total Raised' },
    { icon: Users, value: '10K+', label: 'Active Supporters' },
    { icon: Rocket, value: '500+', label: 'Campaigns Launched' },
    { icon: Globe, value: '150+', label: 'Countries Reached' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Target, value: '24/7', label: 'AI Assistance' },
  ];

  const faqs = [
    { q: 'What is FundForge AI?', a: 'FundForge AI is a modern AI-powered crowdfunding platform that helps creators raise funds for their projects while providing supporters with a seamless contribution experience.' },
    { q: 'How does the credit system work?', a: 'Supporters purchase credits using Stripe (10 credits = $1). These credits are then used to contribute to campaigns. Creators can withdraw earned credits (20 credits = $1 withdrawal value).' },
    { q: 'How do I create a campaign?', a: 'Register as a Creator, then navigate to your dashboard and click "Add Campaign". Fill in your campaign details, story, and goals, then submit for admin approval.' },
    { q: 'How long does campaign approval take?', a: 'Campaigns are typically reviewed within 24-48 hours. You will receive a notification and email once your campaign is approved or rejected.' },
    { q: 'Can I edit my campaign after submission?', a: 'Yes, you can edit your campaign from your dashboard. However, edits will require re-approval from the admin team.' },
    { q: 'How do withdrawals work?', a: 'Creators can withdraw earned credits (minimum 200 credits) through various payment methods. Withdrawals require admin approval and are processed within 2-3 business days.' },
    { q: 'Is my contribution refundable?', a: 'If a contribution is rejected by the creator, credits are automatically refunded. If a campaign is deleted or suspended, all approved contributions are refunded.' },
    { q: 'How does the AI Assistant help?', a: 'Our AI Assistant helps you generate campaign titles, improve your story, suggest rewards, analyze your campaign, and answer platform questions.' },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Slider */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === heroIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className={`relative min-h-screen flex items-center bg-gradient-to-br ${slide.bg}`}>
              <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-secondary-300 dark:bg-secondary-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent-300 dark:bg-accent-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <motion.div
                  key={`content-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
                    <Rocket className="w-4 h-4" />
                    {slide.badge}
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                    {slide.title}{' '}
                    <span className="gradient-text">{slide.gradient}</span>
                    <br />
                    {slide.subtitle}
                  </h1>
                  <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-xl">
                    {slide.desc}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href={slide.ctaLink} className="btn-primary text-lg !py-4 !px-8">
                      {slide.cta} <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href={slide.secondaryLink} className="btn-secondary text-lg !py-4 !px-8">
                      <Search className="w-5 h-5" /> {slide.secondary}
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-lg">
                    {slide.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button onClick={prevHero} className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, idx) => (
              <button key={idx} onClick={() => setHeroIdx(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${idx === heroIdx ? 'w-8 gradient-primary' : 'bg-slate-300 dark:bg-slate-600'}`} />
            ))}
          </div>
          <button onClick={nextHero} className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Top Funded Campaigns */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="section-title mb-4">Top Funded Campaigns</h2>
            <p className="section-subtitle">Discover top campaigns making an impact right now</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.length > 0 ? featuredCampaigns.map((campaign, i) => (
              <motion.div key={campaign._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/campaigns/${campaign._id}`} className="card-hover block overflow-hidden group">
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30">
                    {campaign.image ? (
                      <Image src={campaign.image} alt={campaign.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
                        <span className="font-medium">{campaign.raisedAmount} credits</span>
                        <span className="text-slate-500">{campaign.goal} goal</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min((campaign.raisedAmount / campaign.goal) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{campaign.creatorName}</span>
                      <span className="text-xs text-slate-500">{campaign.totalSupporters} supporters</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton h-48 rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-2 w-full" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))
            )}
          </div>

          <motion.div className="text-center mt-10" {...fadeUp}>
            <Link href="/explore" className="btn-outline">
              View All Campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Platform Impact in Numbers */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary-600 to-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Platform Impact in Numbers</h2>
            <p className="text-lg text-primary-100">Our community is growing every day</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {impactStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-3xl"
                >
                  <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-primary-200">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="section-title mb-4">Explore by Category</h2>
            <p className="section-subtitle">Find campaigns that match your interests</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/explore?category=${cat.name}`} className="card-hover p-5 flex flex-col items-center text-center group">
                  <span className="text-3xl mb-3">{cat.icon}</span>
                  <h3 className="font-semibold mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle">Get started in four simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Rocket, title: 'Create Campaign', desc: 'Fill in your campaign details with AI-powered assistance.' },
              { step: '02', icon: HeartIcon, title: 'Share & Promote', desc: 'Share your campaign with your network and social media.' },
              { step: '03', icon: Users, title: 'Receive Contributions', desc: 'Supporters contribute credits to your campaign.' },
              { step: '04', icon: WalletIcon, title: 'Withdraw Earnings', desc: 'Withdraw your raised credits through various methods.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="w-16 h-16 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/25">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm text-primary-500 font-semibold mb-2 block">{item.step}</span>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="section-title mb-4">Why Choose FundForge AI?</h2>
            <p className="section-subtitle">We provide everything you need for successful crowdfunding</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card-hover p-6">
                  <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="section-title mb-4">What Our Users Say</h2>
            <p className="section-subtitle">Join thousands of satisfied creators and supporters</p>
          </motion.div>

          <div className="relative">
            <div className="flex gap-6 overflow-hidden">
              {testimonials.map((t, i) => {
                const offset = (i - testiIdx + testimonials.length) % testimonials.length;
                return (
                  <motion.div
                    key={t.name}
                    initial={false}
                    animate={{ x: `${-testiIdx * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0"
                  >
                    <div className="card-hover p-6 h-full">
                      <div className="flex mb-3">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">&ldquo;{t.comment}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {t.photo}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <p className="text-xs text-slate-500">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestiIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === testiIdx ? 'w-8 gradient-primary' : 'bg-slate-300 dark:bg-slate-600'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about FundForge AI</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full text-left p-5 rounded-3xl transition-all duration-200 ${
                    openFaq === i
                      ? 'glass shadow-lg'
                      : 'card hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-sm md:text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === i && (
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="glass-card rounded-4xl p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
              <Send className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Get the latest campaign updates, tips, and platform news delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="input-field flex-1" required />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary-600 to-secondary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who have already launched their campaigns.
              Start your journey today with AI-powered assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl">
                Start Your Campaign <ArrowRight className="w-5 h-5 inline ml-1" />
              </Link>
              <Link href="/explore" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl transition-all">
                Explore Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HeartIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>; }
function WalletIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>; }
