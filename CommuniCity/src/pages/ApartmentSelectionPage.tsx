import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Apartment } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Building, Home } from 'lucide-react';
import SelectionLayout from '@/components/layout/SelectionLayout';
import { toast } from '@/hooks/use-toast';

const ApartmentSelectionPage = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('cityId');
  const neighborhoodId = searchParams.get('neighborhoodId');

  useEffect(() => {
    if (!cityId || !neighborhoodId) {
      setError('City ID or Neighborhood ID is missing. Please go back and select them.');
      setLoading(false);
      return;
    }

    const fetchApartments = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('neighborhood_id', neighborhoodId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching apartments:', error);
        setError('Failed to load apartments. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load apartments. Please try again.',
          variant: 'destructive',
        });
      } else {
        setApartments(data || []);
      }
      setLoading(false);
    };

    fetchApartments();
  }, [cityId, neighborhoodId]);

  const handleSelectApartment = (apartmentId: string) => {
    navigate(`/selection/city/neighborhood/apartment/floor?cityId=${cityId}&neighborhoodId=${neighborhoodId}&apartmentId=${apartmentId}`);
  };

  if (loading) {
    return (
      <SelectionLayout title="Select Your Apartment">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
          <p className="text-xl text-gray-300">Loading apartments...</p>
        </div>
      </SelectionLayout>
    );
  }

  if (error) {
    return (
      <SelectionLayout title="Select Your Apartment">
        <div className="text-center text-red-400 text-lg">{error}</div>
        <Button onClick={() => navigate(`/selection/city/neighborhood?cityId=${cityId}`)} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-purple-950">
          Go back to Neighborhoods
        </Button>
      </SelectionLayout>
    );
  }

  if (apartments.length === 0) {
    return (
      <SelectionLayout title="Select Your Apartment">
        <div className="text-center text-gray-300 text-lg">No apartments available in this neighborhood yet.</div>
      </SelectionLayout>
    );
  }

  return (
    <SelectionLayout title="Select Your Apartment">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {apartments.map((apartment) => (
          <Card
            key={apartment.id}
            className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
          >
            <CardHeader className="pb-2">
              <img
                src={apartment.image_url || `https://source.unsplash.com/random/400x200/?apartment,${apartment.name}`}
                alt={apartment.name}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <CardTitle className="text-3xl font-bold text-yellow-300 flex items-center">
                <Building className="mr-2 h-6 w-6 text-pink-400" />
                {apartment.name}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm mt-1">
                Part of Neighborhood ID: {apartment.neighborhood_id.substring(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-gray-200 text-base line-clamp-3">{apartment.description || 'A modern and spacious apartment building.'}</p>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={() => handleSelectApartment(apartment.id)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-semibold text-lg py-2 rounded-lg transition-all duration-300"
              >
                Choose Your Floor
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SelectionLayout>
  );
};

export default ApartmentSelectionPage;
