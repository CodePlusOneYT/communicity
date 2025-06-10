import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Sparkles, Home, Users, DollarSign, MessageSquare, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sparkCoins, setSparkCoins] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        toast({
          title: 'Error fetching session',
          description: sessionError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      setSession(session);

      if (session?.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('user_balances')
          .select('spark_coins')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching SparkCoins:', profileError);
          setSparkCoins(100); // Default value
        } else {
          setSparkCoins(userProfile?.spark_coins || 100);
        }
      }
      setLoading(false);
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from('user_balances')
          .select('spark_coins')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching SparkCoins on auth change:', error);
              setSparkCoins(100);
            } else {
              setSparkCoins(data?.spark_coins || 100);
            }
          });
      } else {
        setSparkCoins(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        <p className="ml-3 text-lg text-gray-300">Loading your universe...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 drop-shadow-lg mb-3">
          Welcome, {session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0]}!
        </h2>
        <p className="text-lg text-gray-300">
          Explore your virtual world and connect with others.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-yellow-300">Your SparkCoins</CardTitle>
            <DollarSign className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-300">
              {sparkCoins !== null ? sparkCoins : 'Loading...'}
            </div>
            <p className="text-xs text-gray-400 mt-1">Your virtual currency balance</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-yellow-300">Current Location</CardTitle>
            <Home className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-300">
              Not Selected Yet
            </div>
            <p className="text-xs text-gray-400 mt-1">
              <Link to="/selection/city" className="text-yellow-400 hover:underline">
                Select your City, Neighborhood, Apartment, and Floor
              </Link> to get started!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-yellow-300">Community Hub</CardTitle>
            <Users className="h-5 w-5 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-300">
              Connect & Chat
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Join discussions, meet new friends, and explore public spaces.
            </p>
            <Button asChild className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950">
              <Link to="/marketplace">Go to Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-yellow-300">Messages</CardTitle>
            <MessageSquare className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-300">
              No New Messages
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Stay tuned for updates and direct messages from your community.
            </p>
            <Button disabled className="mt-3 w-full bg-gray-700 text-gray-400 cursor-not-allowed">
              View Messages (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-yellow-300">Settings</CardTitle>
            <Settings className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-300">
              Personalize Your Experience
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Manage your profile, preferences, and security settings.
            </p>
            <Button disabled className="mt-3 w-full bg-gray-700 text-gray-400 cursor-not-allowed">
              Go to Settings (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;