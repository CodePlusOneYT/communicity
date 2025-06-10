import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          spark_coins: 100, // Initial SparkCoins for new users
        },
      },
    });

    if (error) {
      toast({
        title: 'Signup Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signup Successful',
        description: 'Your account has been created! Please log in.',
      });
      navigate('/login'); // Redirect to login page after successful signup
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-purple-950/80 text-white border border-purple-800 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            Join CommuniCity!
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            Create your account and start exploring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 bg-purple-800/50 border-purple-700 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-lg text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 bg-purple-800/50 border-purple-700 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-bold text-lg py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
