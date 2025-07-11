import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFuelReserveStatus, useDailyFuelMovement, useAddFuelReserveLog } from "@/hooks/useFuelCompliance";
import { useState } from "react";
import { Loader2, Fuel } from "lucide-react";
import { format } from "date-fns";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const FuelDashboard = () => {
  const { data: reserve, isLoading: loadingReserve } = useFuelReserveStatus();
  const { data: daily, isLoading: loadingDaily } = useDailyFuelMovement();
  const addLog = useAddFuelReserveLog();
  const [litres, setLitres] = useState(0);

  const handleDispense = (delta: number) => {
    if (delta === 0) return;
    addLog.mutate({ litres_delta: -Math.abs(delta), reason: "Dispensed to truck" });
    setLitres(0);
  };

  const handleRefill = (delta: number) => {
    if (delta === 0) return;
    addLog.mutate({ litres_delta: Math.abs(delta), reason: "Reserve refill" });
    setLitres(0);
  };

  if (loadingReserve) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const pct = reserve ? (reserve.current_litres / reserve.capacity_litres) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Fuel className="w-7 h-7" />
          <h1 className="text-2xl font-bold">Fuel Reserve</h1>
        </div>

        {/* Status */}
        <Card className="border-2 border-amber-400/60">
          <CardHeader>
            <CardTitle>Reserve Level</CardTitle>
            <CardDescription>
              {reserve?.current_litres.toLocaleString()} / {reserve?.capacity_litres.toLocaleString()} Litres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={pct} className="h-4" />
          </CardContent>
        </Card>

        {/* Quick dispense / refill */}
        <Card className="border-2 border-green-400/50">
          <CardHeader>
            <CardTitle>Update Reserve</CardTitle>
            <CardDescription>Record dispensed fuel or refills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="number"
                value={litres}
                onChange={(e) => setLitres(parseFloat(e.target.value))}
                placeholder="Litres"
                className="border rounded px-3 py-2 w-full sm:w-40"
              />
              <Button onClick={() => handleDispense(litres)} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                Dispense (-)
              </Button>
              <Button onClick={() => handleRefill(litres)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                Refill (+)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily chart */}
        <Card className="border-2 border-blue-400/50">
          <CardHeader>
            <CardTitle>Daily Fuel Movement</CardTitle>
            <CardDescription>Dispensed vs Refilled (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDaily ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={daily?.slice(-30)}>
                  <XAxis dataKey="day" tickFormatter={(d) => format(new Date(d), "MM-dd")} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="litres_dispensed" name="Dispensed" fill="#f87171" />
                  <Bar dataKey="litres_refilled" name="Refilled" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FuelDashboard;
