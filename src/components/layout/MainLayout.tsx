import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Home, Building, Store, LogOut, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const MainLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
        navigate('/login');
      } else if (session && (location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/signup'))) {
        navigate('/home');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Logout Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="text-2xl font-bold animate-pulse">Loading CommuniCity...</div>
      </div>
    );
  }

  if (!session) {
    if (location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
      navigate('/login');
      return null;
    }
    return <Outlet />;
  }

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Cities', path: '/selection/city', icon: Building },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
  ];

  const isSelectionPath = location.pathname.startsWith('/selection/city');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <header className="flex items-center justify-between px-4 py-3 bg-purple-950 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            CommuniCity
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "text-base font-semibold transition-all duration-300 hover:scale-105",
                location.pathname === item.path || (item.path === '/selection/city' && isSelectionPath)
                  ? "text-yellow-300 border-b-2 border-yellow-300"
                  : "text-white hover:text-yellow-200"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user?.email}`} alt="User Avatar" />
                <AvatarFallback>{session.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user?.user_metadata?.username || session.user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="px-4 py-2 bg-purple-950 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} CommuniCity. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;