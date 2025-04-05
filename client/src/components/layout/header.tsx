import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Mail, Search, Settings, LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchValue);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const initials = user?.username 
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-purple-600/50 rounded-full blur-md purple-aura"></div>
                <Mail className="h-6 w-6 text-white relative z-10 bg-gradient-to-r from-purple-600 to-purple-500 p-1 rounded-full" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent ml-2">QMail</span>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search emails..."
                className="w-64 pl-9 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
            </form>
            
            {/* System Buttons */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Email Providers</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Filter Rules</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Security Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile_image_url || ""} alt={user?.username || "User"} />
                      <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.username && (
                        <p className="font-medium">{user.username}</p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-neutral-600 dark:text-neutral-400">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
