import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Neighborhood } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Home, Building2 } from 'lucide-react';
import SelectionLayout from '@/components/layout/SelectionLayout';
import { toast } from '@/hooks/use-toast';

const NeighborhoodSelectionPage = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('cityId');

  useEffect(() => {
    if (!cityId) {
      setError('City ID is missing. Please go back and select a city.');
      setLoading(false);
      return;
    }

    const fetchNeighborhoods = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('city_id', cityId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching neighborhoods:', error);
        setError('Failed to load neighborhoods. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load neighborhoods. Please try again.',
          variant: 'destructive',
        });
      } else {
        setNeighborhoods(data || []);
      }
      setLoading(false);
    };

    fetchNeighborhoods();
  }, [cityId]);

  const handleSelectNeighborhood = (neighborhoodId: string) => {
    navigate(`/selection/city/neighborhood/apartment?cityId=${cityId}&neighborhoodId=${neighborhoodId}`);
  };

  if (loading) {
    return (
      <SelectionLayout title="Select Your Neighborhood">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
          <p className="text-xl text-gray-300">Loading neighborhoods...</p>
        </div>
      </SelectionLayout>
    );
  }

  if (error) {
    return (
      <SelectionLayout title="Select Your Neighborhood">
        <div className="text-center text-red-400 text-lg">{error}</div>
        <Button onClick={() => navigate('/selection/city')} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-purple-950">
          Go back to Cities
        </Button>
      </SelectionLayout>
    );
  }

  if (neighborhoods.length === 0) {
    return (
      <SelectionLayout title="Select Your Neighborhood">
        <div className="text-center text-gray-300 text-lg">No neighborhoods available in this city yet.</div>
      </SelectionLayout>
    );
  }

  return (
    <SelectionLayout title="Select Your Neighborhood">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
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
              <CardTitle className="text-3xl font-bold text-yellow-300 flex items-center">
                <Building2 className="mr-2 h-6 w-6 text-pink-400" />
                {neighborhood.name}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm mt-1">
                Part of City ID: {neighborhood.city_id.substring(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-gray-200 text-base line-clamp-3">{neighborhood.description || 'A friendly and welcoming neighborhood.'}</p>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={() => handleSelectNeighborhood(neighborhood.id)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-semibold text-lg py-2 rounded-lg transition-all duration-300"
              >
                View Apartments
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SelectionLayout>
  );
};

export default NeighborhoodSelectionPage;
