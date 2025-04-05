import { useState } from 'react';
import { useEmails } from '@/hooks/use-emails';
import EmailItem from '@/components/email/email-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Filter, ArrowDownUp, Search } from 'lucide-react';
import { useLocation } from 'wouter';

export default function EmailList() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract folder from the location
  let folder = undefined;
  const folderMatch = location.match(/folder=([^&]+)/);
  if (folderMatch) {
    folder = folderMatch[1];
  }
  
  const { data: emails = [], isLoading, error, refetch } = useEmails(folder);
  
  const handleRefresh = () => {
    refetch();
  };
  
  if (isLoading) {
    return <EmailListSkeleton />;
  }
  
  if (error) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{folder ? capitalizeFirstLetter(folder) : 'Inbox'}</h2>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
          Failed to load emails. Please try again later.
        </div>
      </div>
    );
  }
  
  // Filter emails by search term
  const filteredEmails = !searchTerm 
    ? emails 
    : (emails as any[]).filter((email) => {
        if (!email) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
          (email.subject ? email.subject.toLowerCase().includes(searchLower) : false) ||
          (email.from ? email.from.toLowerCase().includes(searchLower) : false) ||
          (email.body ? email.body.toLowerCase().includes(searchLower) : false)
        );
      });
    
  return (
    <div className="flex flex-col h-full">
      {/* Purple gradient header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-white">{folder ? capitalizeFirstLetter(folder) : 'Inbox'}</h2>
          
          <div className="flex items-center space-x-2">
            <div className="relative bg-white/20 rounded-md border border-white/30 focus-within:bg-white/30 md:hidden">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 h-9 bg-transparent border-none text-white placeholder:text-white/70 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-white hover:bg-white/20">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowDownUp className="h-4 w-4" />
              <span className="sr-only">Sort</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Email list */}
      <div className="p-4">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">No emails found</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {filteredEmails.map((email: any) => (
              <EmailItem key={email.id} email={email} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmailListSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Purple gradient header skeleton */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-4 mb-4 relative">
        <div className="relative z-10 flex justify-between items-center">
          <Skeleton className="h-7 w-32 bg-white/30" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9 rounded-md bg-white/30" />
            <Skeleton className="h-9 w-9 rounded-md bg-white/30" />
            <Skeleton className="h-9 w-9 rounded-md bg-white/30" />
          </div>
        </div>
      </div>
      
      {/* Email list skeleton */}
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-60 mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}