
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Settings, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminAccessControlProps {
  userRole?: string;
  children: React.ReactNode;
  requiredRole?: string;
  showAlternative?: boolean;
}

export const AdminAccessControl: React.FC<AdminAccessControlProps> = ({
  userRole = 'user',
  children,
  requiredRole = 'admin',
  showAlternative = true
}) => {
  const [showContent, setShowContent] = useState(false);
  const { toast } = useToast();

  // Check if user has required access level
  const hasAccess = () => {
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'manager': 2,
      'user': 1
    };
    
    return (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >= 
           (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0);
  };

  const requestAccess = () => {
    toast({
      title: "Access Request Sent",
      description: "Your request for elevated access has been submitted to administrators.",
    });
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  if (!showAlternative) {
    return null;
  }

  return (
    <Card className="border-2 border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-lg">Restricted Access</CardTitle>
          </div>
          <Badge variant="outline" className="border-yellow-600 text-yellow-700">
            {requiredRole.replace('_', ' ').toUpperCase()} Required
          </Badge>
        </div>
        <CardDescription>
          This section requires {requiredRole.replace('_', ' ')} privileges to access.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          <span>Your current role: <strong>{userRole.replace('_', ' ')}</strong></span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={requestAccess}>
            <Users className="w-4 h-4 mr-2" />
            Request Access
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowContent(!showContent)}
            className="flex items-center gap-2"
          >
            {showContent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showContent ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        {showContent && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border-2 border-dashed">
            <div className="opacity-50 pointer-events-none">
              {children}
            </div>
            <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
              <Badge className="bg-yellow-600 text-white">
                <Shield className="w-4 h-4 mr-2" />
                Preview Mode
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
