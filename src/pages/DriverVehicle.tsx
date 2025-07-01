
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, CheckCircle, AlertTriangle, Fuel, Gauge, Wrench, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  checked: boolean;
  required: boolean;
}

const DriverVehicle = () => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Engine & Mechanical
    { id: '1', category: 'Engine & Mechanical', item: 'Engine oil level', checked: false, required: true },
    { id: '2', category: 'Engine & Mechanical', item: 'Coolant level', checked: false, required: true },
    { id: '3', category: 'Engine & Mechanical', item: 'Brake fluid level', checked: false, required: true },
    { id: '4', category: 'Engine & Mechanical', item: 'Power steering fluid', checked: false, required: false },
    { id: '5', category: 'Engine & Mechanical', item: 'Air filter condition', checked: false, required: false },
    
    // Tires & Wheels
    { id: '6', category: 'Tires & Wheels', item: 'Tire pressure (all tires)', checked: false, required: true },
    { id: '7', category: 'Tires & Wheels', item: 'Tire tread depth', checked: false, required: true },
    { id: '8', category: 'Tires & Wheels', item: 'Spare tire condition', checked: false, required: true },
    { id: '9', category: 'Tires & Wheels', item: 'Wheel nuts tightness', checked: false, required: true },
    
    // Lights & Electrical
    { id: '10', category: 'Lights & Electrical', item: 'Headlights (high/low beam)', checked: false, required: true },
    { id: '11', category: 'Lights & Electrical', item: 'Tail lights', checked: false, required: true },
    { id: '12', category: 'Lights & Electrical', item: 'Brake lights', checked: false, required: true },
    { id: '13', category: 'Lights & Electrical', item: 'Turn signals', checked: false, required: true },
    { id: '14', category: 'Lights & Electrical', item: 'Hazard lights', checked: false, required: true },
    
    // Safety & Documents
    { id: '15', category: 'Safety & Documents', item: 'Driver\'s license', checked: false, required: true },
    { id: '16', category: 'Safety & Documents', item: 'Vehicle registration', checked: false, required: true },
    { id: '17', category: 'Safety & Documents', item: 'Insurance documents', checked: false, required: true },
    { id: '18', category: 'Safety & Documents', item: 'First aid kit', checked: false, required: true },
    { id: '19', category: 'Safety & Documents', item: 'Fire extinguisher', checked: false, required: true },
    { id: '20', category: 'Safety & Documents', item: 'Emergency triangles', checked: false, required: true },
  ]);

  const [vehicleInfo] = useState({
    truckNumber: 'TRK-001',
    make: 'Mercedes-Benz',
    model: 'Actros',
    mileage: '145,230 km',
    lastService: '2024-06-15',
    nextService: '2024-08-15',
    fuelLevel: 75,
    batteryLevel: 85,
  });

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const getCompletionStats = () => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.checked).length;
    const required = checklist.filter(item => item.required).length;
    const requiredCompleted = checklist.filter(item => item.required && item.checked).length;
    
    return {
      total,
      completed,
      required,
      requiredCompleted,
      percentage: Math.round((completed / total) * 100),
      requiredPercentage: Math.round((requiredCompleted / required) * 100)
    };
  };

  const submitInspection = () => {
    const stats = getCompletionStats();
    if (stats.requiredCompleted === stats.required) {
      toast({
        title: "Vehicle inspection completed",
        description: "Your vehicle is ready for trips. All required checks passed.",
      });
    } else {
      toast({
        title: "Inspection incomplete",
        description: `Please complete all required checks (${stats.requiredCompleted}/${stats.required} completed).`,
        variant: "destructive",
      });
    }
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const stats = getCompletionStats();

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Vehicle Inspection
            </h1>
            <p className="text-muted-foreground">Pre-trip safety check for your assigned vehicle</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Truck className="w-5 h-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-blue-700">Truck Number</p>
                <p className="font-semibold text-blue-900">{vehicleInfo.truckNumber}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Make & Model</p>
                <p className="font-semibold text-blue-900">{vehicleInfo.make} {vehicleInfo.model}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Mileage</p>
                <p className="font-semibold text-blue-900">{vehicleInfo.mileage}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Next Service</p>
                <p className="font-semibold text-blue-900">{new Date(vehicleInfo.nextService).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Fuel Level</p>
                  <p className="text-xl font-bold text-green-600">{vehicleInfo.fuelLevel}%</p>
                </div>
                <Fuel className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Battery</p>
                  <p className="text-xl font-bold text-blue-600">{vehicleInfo.batteryLevel}%</p>
                </div>
                <Gauge className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Inspection</p>
                  <p className="text-xl font-bold text-orange-600">{stats.percentage}%</p>
                </div>
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inspection Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inspection Progress</span>
              <Badge variant={stats.requiredPercentage === 100 ? 'default' : 'secondary'}>
                {stats.requiredCompleted}/{stats.required} Required Items
              </Badge>
            </CardTitle>
            <CardDescription>
              Complete all required checks before starting your trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedChecklist).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {category === 'Engine & Mechanical' && <Wrench className="w-5 h-5" />}
                    {category === 'Tires & Wheels' && <Truck className="w-5 h-5" />}
                    {category === 'Lights & Electrical' && <Gauge className="w-5 h-5" />}
                    {category === 'Safety & Documents' && <Shield className="w-5 h-5" />}
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 text-sm ${
                            item.checked ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {item.item}
                          {item.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {item.checked && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {item.required && !item.checked && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Complete Inspection</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.requiredPercentage === 100 
                    ? "All required checks completed. Vehicle is ready for operation."
                    : `${stats.required - stats.requiredCompleted} required items remaining.`
                  }
                </p>
              </div>
              <Button 
                onClick={submitInspection}
                className={`${
                  stats.requiredPercentage === 100 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 hover:bg-gray-500'
                } text-white`}
              >
                {stats.requiredPercentage === 100 ? 'Submit Inspection' : 'Complete Required Items'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  );
};

export default DriverVehicle;
