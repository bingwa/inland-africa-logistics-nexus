
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged into Inland Africa Logistics System",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use admin/password for demo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen logistics-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-logistics-accent rounded-full flex items-center justify-center">
            <Truck className="w-8 h-8 text-logistics-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-logistics-primary">
            Inland Africa Logistics
          </CardTitle>
          <CardDescription>
            Sign in to access your logistics management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-logistics-primary hover:bg-logistics-secondary"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">Demo Credentials:</p>
            <p className="text-sm text-gray-600">Username: admin</p>
            <p className="text-sm text-gray-600">Password: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
