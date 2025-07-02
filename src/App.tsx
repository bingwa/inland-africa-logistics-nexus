
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FleetManagement from "./pages/FleetManagement";
import ServiceManagement from "./pages/ServiceManagement";
import TripManagement from "./pages/TripManagement";
import InventoryManagement from "./pages/InventoryManagement";
import CargoManagement from "./pages/CargoManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import DriverDashboard from "./pages/DriverDashboard";
import DriverTrips from "./pages/DriverTrips";
import DriverSchedule from "./pages/DriverSchedule";
import DriverVehicle from "./pages/DriverVehicle";
import DriverDeliveries from "./pages/DriverDeliveries";
import DriverNavigation from "./pages/DriverNavigation";
import DriverHours from "./pages/DriverHours";
import DriverDocuments from "./pages/DriverDocuments";
import DriverNotifications from "./pages/DriverNotifications";
import DriverProfile from "./pages/DriverProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
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
              
              {/* Regular System Routes */}
              <Route path="/fleet" element={
                <ProtectedRoute>
                  <FleetManagement />
                </ProtectedRoute>
              } />
              <Route path="/service" element={
                <ProtectedRoute>
                  <ServiceManagement />
                </ProtectedRoute>
              } />
              <Route path="/trips" element={
                <ProtectedRoute>
                  <TripManagement />
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <InventoryManagement />
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
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
