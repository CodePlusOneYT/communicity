import { ShoppingCart, Tag, Search, Filter, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Virtual Garden Plot',
    description: 'A small plot of land to grow virtual plants and earn SparkCoins.',
    price: 50,
    imageUrl: 'https://source.unsplash.com/random/400x300/?garden,virtual',
    category: 'Land',
  },
  {
    id: '2',
    name: 'AI Companion Bot',
    description: 'A friendly AI bot to assist you in your virtual home.',
    price: 150,
    imageUrl: 'https://source.unsplash.com/random/400x300/?robot,ai',
    category: 'Companions',
  },
  {
    id: '3',
    name: 'Luxury Apartment Decor Pack',
    description: 'Elevate your apartment with exclusive furniture and decorations.',
    price: 100,
    imageUrl: 'https://source.unsplash.com/random/400x300/?luxury,interior',
    category: 'Decor',
  },
  {
    id: '4',
    name: 'SparkCoin Mining Rig (Virtual)',
    description: 'Boost your SparkCoin earnings with this virtual mining rig.',
    price: 200,
    imageUrl: 'https://source.unsplash.com/random/400x300/?mining,computer',
    category: 'Tools',
  },
  {
    id: '5',
    name: 'Customizable Avatar Outfit',
    description: 'Stand out with a unique, customizable outfit for your avatar.',
    price: 75,
    imageUrl: 'https://source.unsplash.com/random/400x300/?fashion,avatar',
    category: 'Avatar',
  },
  {
    id: '6',
    name: 'Pet Dragon Egg',
    description: 'Hatch your very own virtual pet dragon!',
    price: 300,
    imageUrl: 'https://source.unsplash.com/random/400x300/?dragon,egg',
    category: 'Pets',
  },
];

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Land', 'Companions', 'Decor', 'Tools', 'Avatar', 'Pets'];

  const filteredProducts = dummyProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuy = (productName: string, price: number) => {
    setLoading(true);
    setTimeout(() => {
      alert(`You attempted to buy "${productName}" for ${price} SparkCoins! (Feature coming soon)`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 drop-shadow-lg mb-3">
          CommuniCity Marketplace
        </h2>
        <p className="text-lg text-gray-300">
          Discover unique items, properties, and services to enhance your virtual life.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-purple-800/50 border-purple-700 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400 rounded-lg shadow-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={filterCategory === category ? 'default' : 'outline'}
              onClick={() => setFilterCategory(category)}
              className={`
                ${filterCategory === category
                  ? 'bg-yellow-500 text-purple-950 hover:bg-yellow-600'
                  : 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-950'}
                font-semibold transition-all duration-200 rounded-full px-3 py-1 text-sm
              `}
            >
              <Filter className="mr-1 h-3 w-3" />
              {category}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mb-3" />
          <p className="text-lg text-gray-300">Loading marketplace items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-300 text-lg min-h-[300px] flex items-center justify-center">
          No items found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-purple-950/70 border border-purple-800 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
            >
              <CardHeader className="pb-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-3"
                />
                <CardTitle className="text-lg font-bold text-yellow-300 flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-pink-400" />
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm mt-1">
                  Category: {product.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-200 text-sm line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="pt-3 flex justify-between items-center">
                <span className="text-2xl font-extrabold text-green-300 flex items-center">
                  {product.price} <Sparkles className="ml-1 h-5 w-5 text-yellow-400" />
                </span>
                <Button
                  onClick={() => handleBuy(product.name, product.price)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-purple-950 font-semibold text-sm py-1 px-3 rounded-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buy Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;