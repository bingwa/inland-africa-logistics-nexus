import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Fuel } from "lucide-react";

const FuelDashboard = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Fuel className="w-7 h-7" />
          <h1 className="text-2xl font-bold">Fuel Dashboard</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fuel management features will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FuelDashboard;