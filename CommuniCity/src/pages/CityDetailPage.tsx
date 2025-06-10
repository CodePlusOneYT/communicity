import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { City, Neighborhood } from '@/types';
import { Loader2, MapPin, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const CityDetailPage = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const [city, setCity] = useState<City | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!cityId) {
        setError('City ID is missing.');
        setLoading(false);
        return;
      }

      // Fetch city details
      const { data: cityData, error: cityError } = await supabase
        .from('cities')
        .select('*')
        .eq('id', cityId)
        .single();

      if (cityError) {
        console.error('Error fetching city:', cityError);
        setError('Failed to load city details. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load city details. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      setCity(cityData);

      // Fetch neighborhoods for the city
      const { data: neighborhoodsData, error: neighborhoodsError } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('city_id', cityId)
        .order('name', { ascending: true });

      if (neighborhoodsError) {
        console.error('Error fetching neighborhoods:', neighborhoodsError);
        setError('Failed to load neighborhoods. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load neighborhoods. Please try again.',
          variant: 'destructive',
        });
      } else {
        setNeighborhoods(neighborhoodsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [cityId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
        <p className="text-xl text-gray-300">Loading city details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 text-lg min-h-[calc(100vh-160px)] flex flex-col items-center justify-center">
        {error}
        <Button asChild className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-purple-950">
          <Link to="/home">Go to Home</Link>
        </Button>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="text-center text-gray-300 text-lg min-h-[calc(100vh-160px)] flex flex-col items-center justify-center">
        City not found.
        <Button asChild className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-purple-950">
          <Link to="/home">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" size="icon" className="text-white hover:bg-purple-800 transition-colors duration-300">
          <Link to="/home">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 drop-shadow-lg text-center flex-1">
          {city.name}
        </h2>
        <div className="w-10"></div> {/* Placeholder for alignment */}
      </div>

      <div className="bg-purple-950/70 border border-purple-800 rounded-xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={city.image_url || `https://source.unsplash.com/random/600x400/?city,${city.name}`}
          alt={city.name}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-lg shadow-lg"
        />
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-200 text-lg leading-relaxed">
            {city.description || `Explore the vibrant virtual city of ${city.name}. A hub of innovation and community.`}
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Established: {new Date(city.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h3 className="text-4xl font-bold text-yellow-300 mt-12 mb-6 text-center">
        Neighborhoods in {city.name}
      </h3>

      {neighborhoods.length === 0 ? (
        <div className="text-center text-gray-300 text-lg">
          No neighborhoods found in this city yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood) => (
            <Card
              key={neighborhood.id}
              className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
            >
              <CardHeader className="pb-2">
                <img
                  src={neighborhood.image_url || `https://source.unsplash.com/random/400x200/?neighborhood,${neighborhood.name}`}
                  alt={neighborhood.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-pink-400" />
                  {neighborhood.name}
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm mt-1">
                  Part of {city.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-200 text-base line-clamp-3">{neighborhood.description || 'A friendly and welcoming neighborhood.'}</p>
              </CardContent>
              <CardFooter className="pt-4">
                <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-semibold text-lg py-2 rounded-lg transition-all duration-300">
                  <Link to={`/city/${cityId}/neighborhood/${neighborhood.id}`}>
                    Explore Neighborhood
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityDetailPage;
