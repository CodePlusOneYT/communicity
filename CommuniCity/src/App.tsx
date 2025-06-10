import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CitySelectionPage from '@/pages/CitySelectionPage';
import NeighborhoodSelectionPage from '@/pages/NeighborhoodSelectionPage';
import ApartmentSelectionPage from '@/pages/ApartmentSelectionPage';
import FloorSelectionPage from '@/pages/FloorSelectionPage';
import HomePage from '@/pages/HomePage';
import MarketplacePage from '@/pages/MarketplacePage';
import CityDetailPage from '@/pages/CityDetailPage';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import SelectionLayout from '@/components/layout/SelectionLayout'; // Import SelectionLayout

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Authenticated Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/city/:cityId" element={<CityDetailPage />} />

          {/* Selection Routes with SelectionLayout */}
          <Route element={<SelectionLayout title="Selection" />}> {/* Title will be overridden by child pages */}
            <Route path="/selection/city" element={<CitySelectionPage />} />
            <Route path="/selection/city/neighborhood" element={<NeighborhoodSelectionPage />} />
            <Route path="/selection/city/neighborhood/apartment" element={<ApartmentSelectionPage />} />
            <Route path="/selection/city/neighborhood/apartment/floor" element={<FloorSelectionPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
