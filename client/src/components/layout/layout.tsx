import { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from '@/components/sidebar/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Close sidebar when transitioning from mobile to desktop
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}
        
        {/* Mobile Sidebar */}
        {isMobile && (
          <div className="block md:hidden absolute left-4 top-4 z-20">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col bg-neutral-50 dark:bg-neutral-950">
          {children}
        </main>
      </div>
    </div>
  );
}
