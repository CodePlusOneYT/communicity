import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { City } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import SelectionLayout from '@/components/layout/SelectionLayout';
import { toast } from '@/hooks/use-toast';

const CitySelectionPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching cities:', error);
        setError('Failed to load cities. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load cities. Please try again.',
          variant: 'destructive',
        });
      } else {
        setCities(data || []);
      }
      setLoading(false);
    };

    fetchCities();
  }, []);

  const handleSelectCity = (cityId: string) => {
    navigate(`/selection/city/neighborhood?cityId=${cityId}`);
  };

  if (loading) {
    return (
      <SelectionLayout title="Select Your City">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mb-3" />
          <p className="text-lg text-gray-300">Loading cities...</p>
        </div>
      </SelectionLayout>
    );
  }

  if (error) {
    return (
      <SelectionLayout title="Select Your City">
        <div className="text-center text-red-400 text-lg">{error}</div>
        <Button onClick={() => window.location.reload()} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-purple-950">
          Retry
        </Button>
      </SelectionLayout>
    );
  }

  if (cities.length === 0) {
    return (
      <SelectionLayout title="Select Your City">
        <div className="text-center text-gray-300 text-lg">No cities available yet. Check back later!</div>
      </SelectionLayout>
    );
  }

  return (
    <SelectionLayout title="Select Your City">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {cities.map((city) => (
          <Card
            key={city.id}
            className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
          >
            <CardHeader className="pb-2">
              <img
                src={city.image_url || `https://source.unsplash.com/random/400x200/?city,${city.name}`}
                alt={city.name}
                className="w-full h-32 object-cover rounded-t-lg mb-3"
              />
              <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-pink-400" />
                {city.name}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm mt-1">
                Established: {new Date(city.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-gray-200 text-sm line-clamp-3">{city.description || 'A vibrant and bustling virtual city.'}</p>
            </CardContent>
            <CardFooter className="pt-3">
              <Button
                onClick={() => handleSelectCity(city.id)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-semibold text-base py-2 rounded-lg transition-all duration-300"
              >
                Explore Neighborhoods
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SelectionLayout>
  );
};

export default CitySelectionPage;