import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  AlertTriangle, 
  Send, 
  Trash, 
  Tag, 
  Filter, 
  Plus, 
  Mail, 
  Users, 
  ShoppingBag 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  count?: number;
  variant?: 'default' | 'warning' | 'success' | 'primary';
}

export default function Sidebar() {
  const [location] = useLocation();
  
  const mainItems: SidebarItem[] = [
    { 
      icon: <Inbox className="h-5 w-5" />,
      label: 'Inbox', 
      href: '/',
      count: 24,
      variant: 'primary'
    },
    { 
      icon: <AlertTriangle className="h-5 w-5" />,
      label: 'Suspicious', 
      href: '/?folder=suspicious',
      count: 3,
      variant: 'warning'
    },
    { 
      icon: <Send className="h-5 w-5" />,
      label: 'Sent', 
      href: '/?folder=sent'
    },
    { 
      icon: <Trash className="h-5 w-5" />,
      label: 'Trash', 
      href: '/?folder=trash'
    },
    { 
      icon: <Tag className="h-5 w-5" />,
      label: 'Spam', 
      href: '/?folder=spam'
    },
  ];
  
  const filterItems: SidebarItem[] = [
    { 
      icon: <Mail className="h-5 w-5" />,
      label: 'Newsletters', 
      href: '/?folder=newsletters',
      variant: 'success'
    },
    { 
      icon: <Users className="h-5 w-5" />,
      label: 'Social', 
      href: '/?folder=social',
      variant: 'primary'
    },
    { 
      icon: <ShoppingBag className="h-5 w-5" />,
      label: 'Promotions', 
      href: '/?folder=promotions',
      variant: 'warning'
    },
  ];

  const variantClasses = {
    primary: "text-primary",
    warning: "text-warning-dark",
    success: "text-success",
    default: "text-neutral-500 dark:text-neutral-400"
  };

  const badgeVariantClasses = {
    primary: "bg-primary",
    warning: "bg-warning",
    success: "bg-success",
    default: "bg-neutral-500"
  };

  return (
    <div className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-full overflow-y-auto">
      <div className="p-4">
        <Button className="w-full py-6 font-medium bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
          <Plus className="h-5 w-5 mr-2" />
          New Email
        </Button>
        
        <nav className="mt-6">
          <div className="space-y-1">
            {mainItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a 
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-lg",
                    location === item.href || (item.href === '/' && location === '')
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-neutral-900 dark:text-white border-l-4 border-purple-500"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-l-4 hover:border-purple-500/50"
                  )}
                >
                  <span className={cn("w-6", item.variant ? variantClasses[item.variant] : variantClasses.default)}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.count && (
                    <span 
                      className={cn(
                        "ml-auto text-xs py-0.5 px-2 rounded-full text-white",
                        item.variant ? badgeVariantClasses[item.variant] : badgeVariantClasses.default
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </a>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              FILTERS
            </h3>
            
            <div className="mt-2 space-y-1">
              {filterItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-lg",
                      location === item.href
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-neutral-900 dark:text-white border-l-4 border-purple-500"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-l-4 hover:border-purple-500/50"
                    )}
                  >
                    <span className={cn("w-6", item.variant ? variantClasses[item.variant] : variantClasses.default)}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </a>
                </Link>
              ))}
              
              <Button variant="ghost" className="mt-2 px-2 py-2 text-sm font-medium justify-start w-full bg-gradient-to-r from-purple-500/10 to-blue-400/5 hover:from-purple-500/20 hover:to-blue-400/10 border-l-4 border-purple-400/50">
                <Filter className="h-5 w-5 mr-2 text-purple-500" />
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent font-medium">Add Filter</span>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
