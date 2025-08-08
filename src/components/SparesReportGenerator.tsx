import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Wrench, Download, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrucks, useMaintenance } from "@/hooks/useSupabaseData";

interface SparesReportGeneratorProps {
  onClose: () => void;
}

export const SparesReportGenerator: React.FC<SparesReportGeneratorProps> = ({ onClose }) => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [selectedTruck, setSelectedTruck] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: trucks } = useTrucks();
  const { data: maintenance } = useMaintenance();
  const { toast } = useToast();

  const generateSparesReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Missing Date Range",
        description: "Please select a date range for the report.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const filteredMaintenance = maintenance?.filter(m => {
        const itemDate = new Date(m.service_date);
        const matchesDate = itemDate >= dateRange.from! && itemDate <= dateRange.to!;
        const matchesTruck = selectedTruck === 'all' || m.truck_id === selectedTruck;
        const hasItems = m.items_purchased && 
                        m.items_purchased.trim() !== '' && 
                        m.items_purchased.toLowerCase() !== 'none' &&
                        m.items_purchased.toLowerCase() !== 'null';
        
        console.log('Filtering maintenance record:', {
          id: m.id,
          truck_id: m.truck_id,
          items_purchased: m.items_purchased,
          hasItems,
          matchesDate,
          matchesTruck
        });
        
        return matchesDate && matchesTruck && hasItems;
      }) || [];

      console.log('Total maintenance records:', maintenance?.length);
      console.log('Filtered maintenance records:', filteredMaintenance.length);

      const sparesByTruck = new Map();
      
      filteredMaintenance.forEach(maintenance => {
        const truckId = maintenance.truck_id;
        const truck = trucks?.find(t => t.id === truckId);
        
        if (!truck) return;
        
        if (!sparesByTruck.has(truckId)) {
          sparesByTruck.set(truckId, {
            truck,
            spares: [],
            totalCost: 0,
            totalItems: 0
          });
        }
        
        const truckData = sparesByTruck.get(truckId);
        
        const items = maintenance.items_purchased.split(',').map(item => item.trim()).filter(item => item);
        
        items.forEach(item => {
          let itemName = item;
          let quantity = 1;
          let itemCost = 0;
          
          console.log('Processing item:', item);
          
          const newFormatMatch = item.match(/(.+?)\s*\(Qty:\s*(\d+),\s*Cost:\s*KSh\s*([\d,]+)\)/i);
          if (newFormatMatch) {
            itemName = newFormatMatch[1].trim();
            quantity = parseInt(newFormatMatch[2]);
            itemCost = parseFloat(newFormatMatch[3].replace(/,/g, ''));
            console.log('Parsed new format:', { itemName, quantity, itemCost });
          } else {
            const quantityMatch = item.match(/(.+?)\s*x(\d+)$/i);
            if (quantityMatch) {
              itemName = quantityMatch[1].trim();
              quantity = parseInt(quantityMatch[2]);
              console.log('Parsed old format:', { itemName, quantity });
            }
            itemCost = (maintenance.cost || 0) / items.length;
            console.log('Calculated cost:', itemCost);
          }
          
          truckData.spares.push({
            date: maintenance.service_date,
            itemName,
            quantity,
            estimatedCost: itemCost,
            maintenanceType: maintenance.maintenance_type,
            serviceProvider: maintenance.service_provider || 'N/A',
            serviceType: maintenance.service_type || 'N/A',
            routeTaken: maintenance.route_taken || 'N/A'
          });
          
          truckData.totalCost += itemCost;
          truckData.totalItems += quantity;
        });
      });

      const reportData = {
        type: 'Truck Spares Report',
        period: `${dateRange.from!.toLocaleDateString()} - ${dateRange.to!.toLocaleDateString()}`,
        truckFilter: selectedTruck === 'all' ? 'All Trucks' : trucks?.find(t => t.id === selectedTruck)?.truck_number || 'Unknown Truck',
        sparesByTruck: Array.from(sparesByTruck.values()),
        summary: {
          totalTrucks: sparesByTruck.size,
          totalSpares: Array.from(sparesByTruck.values()).reduce((sum, truck) => sum + truck.totalItems, 0),
          totalCost: Array.from(sparesByTruck.values()).reduce((sum, truck) => sum + truck.totalCost, 0),
          totalMaintenanceRecords: filteredMaintenance.length
        }
      };

      generateDetailedSparesReport(reportData);
      
      toast({
        title: "Spares Report Generated Successfully",
        description: "Your detailed spares report is ready for viewing and printing.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate the spares report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDetailedSparesReport = (data: any) => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const reportHtml = `...`; // (truncated for brevity, this part remains unchanged from your original code)

    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  };

  const getReportTitle = () => "Truck Spares Report";
  const getReportDescription = () => "Generate detailed reports showing spare parts purchased for each truck during maintenance services.";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          {getReportTitle()}
        </CardTitle>
        <CardDescription>{getReportDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Report Period</label>
          <DatePickerWithRange 
            date={dateRange}
            setDate={setDateRange}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Select Truck</label>
          <Select value={selectedTruck} onValueChange={setSelectedTruck}>
            <SelectTrigger>
              <SelectValue placeholder="Choose truck" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trucks</SelectItem>
              {trucks?.map(truck => (
                <SelectItem key={truck.id} value={truck.id}>
                  {truck.truck_number} - {truck.make} {truck.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-muted-foreground">Estimated Cost Range</p>
            <p className="font-semibold">KSh 50K - 500K</p>
          </div>
          <div className="text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">Items Tracked</p>
            <p className="font-semibold">Parts & Components</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={generateSparesReport}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Spares Report
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
