import Link from 'next/link';
import { Github, Linkedin, Twitter, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-xl gradient-text">FundForge AI</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Forge Ideas. Fund Dreams. Empower Communities. 
              The AI-powered crowdfunding platform that brings your projects to life.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: '#', name: 'github' },
                { icon: Twitter, href: '#', name: 'twitter' },
                { icon: Linkedin, href: '#', name: 'linkedin' },
                { icon: Facebook, href: '#', name: 'facebook' },
              ].map(({ icon: Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Quick Links',
              links: [
                { label: 'Home', href: '/' },
                { label: 'Explore', href: '/explore' },
                { label: 'Start Campaign', href: '/register' },
                { label: 'How It Works', href: '#how-it-works' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Help Center', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'FAQ', href: '#faq' },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} FundForge AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Mail className="w-4 h-4" />
            <a href="mailto:support@fundforge.ai" className="hover:text-primary-600 dark:hover:text-primary-400">support@fundforge.ai</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
