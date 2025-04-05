import { Card, CardContent } from '@/components/ui/card';
import { Shield, CircleX, Lock } from 'lucide-react';
import { useSecurityStats } from '@/hooks/use-emails';
import { Skeleton } from '@/components/ui/skeleton';

export default function SecurityStats() {
  const { data: stats, isLoading, error } = useSecurityStats();

  if (isLoading) {
    return <SecurityStatsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Security Dashboard</h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
          Failed to load security stats. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-400/10 to-purple-600/5"></div>
      <div className="relative z-10">
        <h2 className="text-lg font-semibold mb-4">Security Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scam Attempts Blocked */}
          <Card className="bg-neutral-50 dark:bg-neutral-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Scam Attempts Blocked</p>
                  <p className="text-2xl font-bold text-red-500">{stats?.scamBlocked || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                <span className="text-red-500">
                  <svg className="inline-block h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                  24%
                </span> from last week
              </div>
            </CardContent>
          </Card>
          
          {/* Unsubscribe Requests */}
          <Card className="bg-neutral-50 dark:bg-neutral-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Unsubscribe Requests</p>
                  <p className="text-2xl font-bold text-primary">{stats?.unsubscribeCount || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CircleX className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                <span className="text-green-500">
                  <svg className="inline-block h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  12%
                </span> from last week
              </div>
            </CardContent>
          </Card>
          
          {/* Encrypted Messages */}
          <Card className="bg-neutral-50 dark:bg-neutral-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Encrypted Messages</p>
                  <p className="text-2xl font-bold text-green-500">{stats?.encrypted || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                <span className="text-green-500">
                  <svg className="inline-block h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  9%
                </span> from last week
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SecurityStatsSkeleton() {
  return (
    <div className="relative bg-white dark:bg-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-400/10 to-purple-600/5"></div>
      <div className="relative z-10">
        <h2 className="text-lg font-semibold mb-4">Security Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="bg-neutral-50 dark:bg-neutral-800 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
