
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Truck, Mail, Lock, Shield, Users, BarChart3, Package, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged into Inland Africa Logistics System",
      });
    }
    setIsLoading(false);
  };

  const features = [
    { icon: Truck, title: "Fleet Management", desc: "Track and manage your vehicle fleet" },
    { icon: Package, title: "Cargo Handling", desc: "Efficient cargo and shipment tracking" },
    { icon: BarChart3, title: "Analytics", desc: "Real-time insights and reporting" },
    { icon: Users, title: "Team Management", desc: "Manage drivers and staff" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-yellow-500/90 dark:from-orange-600/90 dark:to-yellow-600/90" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Inland Africa</h1>
                <p className="text-xl opacity-90">Logistics System</p>
              </div>
            </div>
            <p className="text-lg opacity-90 leading-relaxed">
              Streamline your logistics operations with our comprehensive management platform. 
              Built for efficiency, designed for growth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
                <feature.icon className="w-8 h-8 mb-3 text-white" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-80">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4">
            <Shield className="w-5 h-5" />
            <span className="text-sm opacity-90">Enterprise-grade security & reliability</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inland Africa Logistics</h1>
            <p className="text-gray-600 dark:text-gray-400">Professional logistics management</p>
          </div>

          <Card className="border-2 border-orange-100 dark:border-orange-900/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Lock className="w-6 h-6 text-orange-500" />
                Sign In
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Access your logistics management dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your work email"
                      className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 rounded-xl p-5 border border-orange-200/50 dark:border-orange-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    <Shield className="w-3 h-3 mr-1" />
                    Demo Access
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">New to the system?</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create your account using the registration form to get started with our logistics management platform.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30"
                    onClick={() => window.location.href = '/auth'}
                  >
                    Create New Account
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2024 Inland Africa Logistics. Enterprise logistics solution.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
