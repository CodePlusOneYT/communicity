import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

const AuthLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If already logged in, redirect to home
        navigate('/home');
      }
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && (location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/signup'))) {
        navigate('/home');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="text-2xl font-bold animate-pulse">Loading CommuniCity...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="h-12 w-12 text-yellow-400" />
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
          CommuniCity
        </h1>
      </div>
      <div className="w-full max-w-md bg-purple-950/70 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-800 animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
