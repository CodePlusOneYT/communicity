import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Floor } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Layers, Home } from 'lucide-react';
import SelectionLayout from '@/components/layout/SelectionLayout';
import { toast } from '@/hooks/use-toast';

const FloorSelectionPage = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('cityId');
  const neighborhoodId = searchParams.get('neighborhoodId');
  const apartmentId = searchParams.get('apartmentId');

  useEffect(() => {
    if (!cityId || !neighborhoodId || !apartmentId) {
      setError('Missing required IDs. Please go back and select them.');
      setLoading(false);
      return;
    }

    const fetchFloors = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('floors')
        .select('*')
        .eq('apartment_id', apartmentId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching floors:', error);
        setError('Failed to load floors. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load floors. Please try again.',
          variant: 'destructive',
        });
      } else {
        setFloors(data || []);
      }
      setLoading(false);
    };

    fetchFloors();
  }, [cityId, neighborhoodId, apartmentId]);

  const handleSelectFloor = (floorId: string) => {
    // This is a placeholder. The user will provide the next path later.
    // For now, navigate to the home page or a confirmation.
    toast({
      title: 'Floor Selected!',
      description: `You've selected Floor ID: ${floorId.substring(0, 8)}...`,
    });
    navigate('/home'); // Temporary navigation
  };

  if (loading) {
    return (
      <SelectionLayout title="Select Your Floor">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
          <p className="text-xl text-gray-300">Loading floors...</p>
        </div>
      </SelectionLayout>
    );
  }

  if (error) {
    return (
      <SelectionLayout title="Select Your Floor">
        <div className="text-center text-red-400 text-lg">{error}</div>
        <Button onClick={() => navigate(`/selection/city/neighborhood/apartment?cityId=${cityId}&neighborhoodId=${neighborhoodId}`)} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-purple-950">
          Go back to Apartments
        </Button>
      </SelectionLayout>
    );
  }

  if (floors.length === 0) {
    return (
      <SelectionLayout title="Select Your Floor">
        <div className="text-center text-gray-300 text-lg">No floors available in this apartment yet.</div>
      </SelectionLayout>
    );
  }

  return (
    <SelectionLayout title="Select Your Floor">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {floors.map((floor) => (
          <Card
            key={floor.id}
            className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
          >
            <CardHeader className="pb-2">
              <img
                src={floor.image_url || `https://source.unsplash.com/random/400x200/?floor,${floor.name}`}
                alt={floor.name}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <CardTitle className="text-3xl font-bold text-yellow-300 flex items-center">
                <Layers className="mr-2 h-6 w-6 text-pink-400" />
                {floor.name}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm mt-1">
                Part of Apartment ID: {floor.apartment_id.substring(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-gray-200 text-base line-clamp-3">{floor.description || 'A floor with various virtual properties.'}</p>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={() => handleSelectFloor(floor.id)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-semibold text-lg py-2 rounded-lg transition-all duration-300"
              >
                Select This Floor
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SelectionLayout>
  );
};

export default FloorSelectionPage;
