'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">500</h1>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
