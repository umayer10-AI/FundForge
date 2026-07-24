import type { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { AIChatWrapper } from '@/components/AIChatWrapper';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FundForge AI - Forge Ideas. Fund Dreams. Empower Communities.',
    template: '%s | FundForge AI',
  },
  description:
    'FundForge AI is a modern AI-powered crowdfunding platform. Create campaigns, contribute to projects, and empower communities.',
  keywords: ['crowdfunding', 'fundraising', 'AI', 'campaign', 'donate'],
  openGraph: {
    title: 'FundForge AI',
    description: 'Forge Ideas. Fund Dreams. Empower Communities.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FundForge AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FundForge AI',
    description: 'Forge Ideas. Fund Dreams. Empower Communities.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                {children}
                <AIChatWrapper />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
