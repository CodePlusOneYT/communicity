import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Globe, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 text-center">
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Sparkles className="h-20 w-20 text-yellow-400 animate-pulse" />
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 drop-shadow-lg">
            CommuniCity
          </h1>
        </div>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light text-gray-200">
          Dive into CommuniCity, an AI-powered social universe where you can connect, create, and thrive in vibrant virtual communities. Explore cities, build your dream house, and earn SparkCoins!
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-bold text-lg py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link to="/signup">Join CommuniCity <Zap className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-purple-950 font-bold text-lg py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link to="/login">Login <Users className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-purple-950/60 p-8 rounded-xl shadow-xl border border-purple-800 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <Globe className="h-16 w-16 text-pink-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-yellow-300">Explore Cities</h3>
            <p className="text-gray-300 text-lg">Discover diverse virtual cities, each with unique cultures and communities waiting for you.</p>
          </div>
          <div className="bg-purple-950/60 p-8 rounded-xl shadow-xl border border-purple-800 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-pink-300">AI-Powered Creation</h3>
            <p className="text-gray-300 text-lg">Unleash your creativity with integrated AI tools to build, design, and personalize your virtual spaces.</p>
          </div>
          <div className="bg-purple-950/60 p-8 rounded-xl shadow-xl border border-purple-800 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <Users className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-green-300">Connect & Socialize</h3>
            <p className="text-gray-300 text-lg">Join neighborhoods, apartments, and houses to connect with like-minded individuals and build lasting friendships.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
