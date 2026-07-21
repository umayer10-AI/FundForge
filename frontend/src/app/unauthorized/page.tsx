import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold gradient-text mb-4">403</h1>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          You do not have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/login" className="btn-secondary">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
