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

      // Filter maintenance records with spares/items purchased
      const filteredMaintenance = maintenance?.filter(m => {
        const itemDate = new Date(m.service_date);
        const matchesDate = itemDate >= dateRange.from! && itemDate <= dateRange.to!;
        const matchesTruck = selectedTruck === 'all' || m.truck_id === selectedTruck;
        const hasItems = m.items_purchased && m.items_purchased.trim() !== '' && m.items_purchased.toLowerCase() !== 'none';
        return matchesDate && matchesTruck && hasItems;
      }) || [];

      // Group spares by truck
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
        
        // Parse items purchased - support multiple formats
        // Format 1: "Engine oil (Qty: 1, Cost: KSh 650000)"
        // Format 2: "Oil filter x2, Brake pads x1"
        const items = maintenance.items_purchased.split(',').map(item => item.trim()).filter(item => item);
        
        items.forEach(item => {
          let itemName = item;
          let quantity = 1;
          let itemCost = 0;
          
          // Try to parse new format: "Engine oil (Qty: 1, Cost: KSh 650000)"
          const newFormatMatch = item.match(/(.+?)\s*\(Qty:\s*(\d+),\s*Cost:\s*KSh\s*([\d,]+)\)/i);
          if (newFormatMatch) {
            itemName = newFormatMatch[1].trim();
            quantity = parseInt(newFormatMatch[2]);
            itemCost = parseFloat(newFormatMatch[3].replace(/,/g, ''));
          } else {
            // Try old format: "Oil filter x2"
            const quantityMatch = item.match(/(.+?)\s*x(\d+)$/i);
            if (quantityMatch) {
              itemName = quantityMatch[1].trim();
              quantity = parseInt(quantityMatch[2]);
            }
            // Estimate cost if not provided (divide maintenance cost by number of different items)
            itemCost = (maintenance.cost || 0) / items.length * quantity;
          }
          
          truckData.spares.push({
            date: maintenance.service_date,
            itemName,
            quantity,
            estimatedCost: itemCost,
            maintenanceType: maintenance.maintenance_type,
            serviceProvider: maintenance.service_provider || 'N/A'
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

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Truck Spares Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 20px; 
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
            }
            .report-title {
              font-size: 20px;
              color: #2563eb;
              margin-bottom: 15px;
            }
            .summary { 
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 8px;
              border-left: 4px solid #10b981;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }
            .summary-item {
              background: white;
              padding: 15px;
              border-radius: 6px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .summary-item .label {
              font-weight: bold;
              color: #6b7280;
              display: block;
              margin-bottom: 5px;
            }
            .summary-item .value {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .truck-section {
              margin: 30px 0;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .truck-header {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 15px 20px;
              font-weight: bold;
              font-size: 16px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 0;
            }
            th, td { 
              border: 1px solid #d1d5db; 
              padding: 12px 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f9fafb; 
              font-weight: bold;
              color: #374151;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb; 
            }
            tr:hover {
              background-color: #f3f4f6;
            }
            .cost-cell {
              text-align: right;
              font-weight: bold;
              color: #059669;
            }
            .quantity-cell {
              text-align: center;
              font-weight: bold;
              color: #2563eb;
            }
            .no-print { 
              margin: 20px 0; 
              padding: 12px 24px; 
              background: #2563eb; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 16px;
            }
            .no-print:hover {
              background: #1d4ed8;
            }
            .truck-summary {
              background: #fef3c7;
              padding: 10px 15px;
              font-weight: bold;
              color: #92400e;
            }
            @media print { 
              .no-print { display: none; }
              body { margin: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Approved Logistics Limited</div>
            <div class="report-title">${data.type}</div>
            <p><strong>Period:</strong> ${data.period}</p>
            <p><strong>Trucks:</strong> ${data.truckFilter}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="summary">
            <h3>Report Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="label">Trucks with Spares:</span>
                <span class="value">${data.summary.totalTrucks}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Items Purchased:</span>
                <span class="value">${data.summary.totalSpares}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Cost:</span>
                <span class="value">KSh ${Math.round(data.summary.totalCost).toLocaleString()}</span>
              </div>
              <div class="summary-item">
                <span class="label">Maintenance Records:</span>
                <span class="value">${data.summary.totalMaintenanceRecords}</span>
              </div>
            </div>
          </div>

          ${data.sparesByTruck.map((truckData: any) => `
            <div class="truck-section">
              <div class="truck-header">
                <span>${truckData.truck.truck_number} - ${truckData.truck.make} ${truckData.truck.model}</span>
                <span style="float: right;">Total Items: ${truckData.totalItems} | Cost: KSh ${Math.round(truckData.totalCost).toLocaleString()}</span>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Date Purchased</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Cost (KSh)</th>
                    <th>Maintenance Type</th>
                    <th>Service Provider</th>
                  </tr>
                </thead>
                <tbody>
                  ${truckData.spares.map((spare: any) => `
                    <tr>
                      <td>${new Date(spare.date).toLocaleDateString()}</td>
                      <td>${spare.itemName}</td>
                      <td class="quantity-cell">${spare.quantity}</td>
                      <td class="cost-cell">${Math.round(spare.estimatedCost).toLocaleString()}</td>
                      <td>${spare.maintenanceType}</td>
                      <td>${spare.serviceProvider}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}

          ${data.sparesByTruck.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
              <h3>No spares data found for the selected period and trucks.</h3>
              <p>This could be because:</p>
              <ul style="text-align: left; display: inline-block; margin-top: 10px;">
                <li>No maintenance records contain items purchased information</li>
                <li>The selected date range has no maintenance activities</li>
                <li>Items purchased fields are empty or marked as "None"</li>
              </ul>
            </div>
          ` : ''}

          <button class="no-print" onclick="window.print()">Print Report</button>
        </body>
      </html>
    `;

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
        {/* Date Range Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Report Period</label>
          <DatePickerWithRange 
            date={dateRange}
            setDate={setDateRange}
          />
        </div>

        {/* Truck Selection */}
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

        {/* Key Metrics Preview */}
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

        {/* Action Buttons */}
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