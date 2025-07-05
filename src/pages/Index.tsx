
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Route, Settings, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Truck,
      title: "Fleet Management",
      description: "Monitor and manage your entire truck fleet in real-time",
      path: "/fleet"
    },
    {
      icon: Route,
      title: "Trip Management", 
      description: "Plan, track and optimize delivery routes and schedules",
      path: "/trips"
    },
    {
      icon: Settings,
      title: "Service Management",
      description: "Keep track of maintenance schedules and service history",
      path: "/service"
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Manage spare parts and inventory across all locations",
      path: "/inventory"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Approved Logistics Limited</h1>
            </div>
            
            <div className="space-x-4">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Streamline Your
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {" "}Logistics
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Complete fleet management solution for modern logistics companies. 
              Track vehicles, manage maintenance, optimize routes, and control inventory all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Start Managing Your Fleet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools to manage every aspect of your logistics operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-sm border-orange-400/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Operations?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join hundreds of logistics companies already using our platform
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Index;
