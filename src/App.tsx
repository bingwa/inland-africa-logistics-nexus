import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FleetManagement from './pages/FleetManagement';
import TripManagement from './pages/TripManagement';
import CargoManagement from './pages/CargoManagement';
import Reports from './pages/Reports';
import InventoryManagement from './pages/InventoryManagement';
import ServiceManagement from './pages/ServiceManagement';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import DriverDashboard from './pages/DriverDashboard';
import DriverTrips from './pages/DriverTrips';
import DriverSchedule from './pages/DriverSchedule';
import DriverVehicle from './pages/DriverVehicle';
import DriverDeliveries from './pages/DriverDeliveries';
import DriverNavigation from './pages/DriverNavigation';
import DriverHours from './pages/DriverHours';
import DriverDocuments from './pages/DriverDocuments';
import DriverNotifications from './pages/DriverNotifications';
import DriverProfile from './pages/DriverProfile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/fleet" element={
            <ProtectedRoute>
              <FleetManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/trips" element={
            <ProtectedRoute>
              <TripManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/cargo" element={
            <ProtectedRoute>
              <CargoManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/inventory" element={
            <ProtectedRoute>
              <InventoryManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/services" element={
            <ProtectedRoute>
              <ServiceManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Driver Routes */}
          <Route path="/driver-dashboard" element={
            <ProtectedRoute>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-trips" element={
            <ProtectedRoute>
              <DriverTrips />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-schedule" element={
            <ProtectedRoute>
              <DriverSchedule />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-vehicle" element={
            <ProtectedRoute>
              <DriverVehicle />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-deliveries" element={
            <ProtectedRoute>
              <DriverDeliveries />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-navigation" element={
            <ProtectedRoute>
              <DriverNavigation />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-hours" element={
            <ProtectedRoute>
              <DriverHours />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-documents" element={
            <ProtectedRoute>
              <DriverDocuments />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-notifications" element={
            <ProtectedRoute>
              <DriverNotifications />
            </ProtectedRoute>
          } />
          
          <Route path="/driver-profile" element={
            <ProtectedRoute>
              <DriverProfile />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
