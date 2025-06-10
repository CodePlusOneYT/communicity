import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface SelectionLayoutProps {
  title: string;
  children?: ReactNode;
}

const SelectionLayout = ({ title, children }: SelectionLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-purple-800 transition-colors duration-300"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 drop-shadow-md">
          {title}
        </h2>
        <div className="w-10"></div> {/* Placeholder for alignment */}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default SelectionLayout;
