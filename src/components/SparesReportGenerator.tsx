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
        const hasItems =
          m.items_purchased &&
          m.items_purchased.trim() !== '' &&
          m.items_purchased.toLowerCase() !== 'none' &&
          m.items_purchased.toLowerCase() !== 'null';

        return matchesDate && matchesTruck && hasItems;
      }) || [];

      // Group spares per truck and spare part, aggregate quantity and cost, keep relevant fields
      type SpareRow = {
        truck_number: string;
        spare: string;
        quantity: number;
        price_per_unit: number;
        total_cost: number;
        maintenance_category: string;
        service_type: string;
        route: string;
        service_description: string;
        date: string;
      };

      // We'll keep a Map<truckNumber, Map<spare+category+type+route+desc+date, SpareRow>>
      const truckMap: Map<string, Map<string, SpareRow>> = new Map();
      // For stats
      const truckStats: Record<string, { truck_number: string; total_cost: number; total_quantity: number }> = {};

      filteredMaintenance.forEach(maint => {
        const truck = trucks?.find(t => t.id === maint.truck_id);
        if (!truck) return;
        const truckNumber = truck.truck_number;
        if (!truckStats[truckNumber]) {
          truckStats[truckNumber] = { truck_number: truckNumber, total_cost: 0, total_quantity: 0 };
        }

        // This is the **actual description** field from the record
        const actualDescription = maint.description || maint.service_provider || maint.service_type || '';

        const items = maint.items_purchased.split(',').map(item => item.trim()).filter(Boolean);

        items.forEach(item => {
          let itemName = item;
          let quantity = 1;
          let pricePerUnit = 0;
          let totalCost = 0;

          // Format: "Brake Pads (Qty: 2, Cost: KSh 3000)"
          const newFormatMatch = item.match(/(.+?)\s*\(Qty:\s*(\d+),\s*Cost:\s*KSh\s*([\d,]+)\)/i);
          if (newFormatMatch) {
            itemName = newFormatMatch[1].trim();
            quantity = parseInt(newFormatMatch[2]);
            totalCost = parseFloat(newFormatMatch[3].replace(/,/g, ''));
            pricePerUnit = totalCost / quantity;
          } else {
            // Format: "Brake Pads x2"
            const quantityMatch = item.match(/(.+?)\s*x(\d+)$/i);
            if (quantityMatch) {
              itemName = quantityMatch[1].trim();
              quantity = parseInt(quantityMatch[2]);
            }
            // Legacy fallback: split cost equally
            totalCost = (maint.cost || 0) / items.length;
            pricePerUnit = totalCost / quantity;
          }

          // Compose a unique key for grouping: spare+maintenance_category+service_type+route+desc+date
          const key = `${itemName}|${maint.maintenance_type}|${maint.service_type || 'N/A'}|${maint.route_taken || 'N/A'}|${actualDescription}|${new Date(maint.service_date).toLocaleDateString()}`;
          if (!truckMap.has(truckNumber)) truckMap.set(truckNumber, new Map());
          const spareMap = truckMap.get(truckNumber)!;
          if (spareMap.has(key)) {
            // Update existing
            const row = spareMap.get(key)!;
            row.quantity += quantity;
            row.total_cost += totalCost;
            row.price_per_unit = row.total_cost / row.quantity;
          } else {
            spareMap.set(key, {
              truck_number: truckNumber,
              spare: itemName,
              quantity,
              price_per_unit: pricePerUnit,
              total_cost: totalCost,
              maintenance_category: maint.maintenance_type,
              service_type: maint.service_type || 'N/A',
              route: maint.route_taken || 'N/A',
              service_description: actualDescription,
              date: new Date(maint.service_date).toLocaleDateString(),
            });
          }

          truckStats[truckNumber].total_cost += totalCost;
          truckStats[truckNumber].total_quantity += quantity;
        });
      });

      const reportRows: SpareRow[] = [];
      // Flatten truckMap to an array
      for (const [, spareMap] of truckMap.entries()) {
        for (const [, row] of spareMap.entries()) {
          reportRows.push(row);
        }
      }

      // Sort rows for uniformity
      reportRows.sort((a, b) => a.truck_number.localeCompare(b.truck_number) || a.spare.localeCompare(b.spare));

      // Prepare stats sorted by spend
      const statsRows = Object.values(truckStats).sort((a, b) => b.total_cost - a.total_cost);

      generateDetailedSparesReport({
        type: 'Truck Spares Report',
        period: `${dateRange.from!.toLocaleDateString()} - ${dateRange.to!.toLocaleDateString()}`,
        truckFilter: selectedTruck === 'all' ? 'All Trucks' : trucks?.find(t => t.id === selectedTruck)?.truck_number || 'Unknown Truck',
        rows: reportRows,
        stats: statsRows,
      });

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

  // Report HTML design emulates the first uploaded PDF version, with a classic, bordered, boxy look and no Print button in print.
  const generateDetailedSparesReport = (data: any) => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    // Build HTML table rows
    const tableRows = data.rows.map((row: any, idx: number) => `
      <tr>
        <td class="cell">${row.truck_number}</td>
        <td class="cell">${row.spare}</td>
        <td class="cell" style="text-align:right">${row.quantity}</td>
        <td class="cell" style="text-align:right">KSh ${row.price_per_unit.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
        <td class="cell" style="text-align:right">KSh ${row.total_cost.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
        <td class="cell">${row.maintenance_category}</td>
        <td class="cell">${row.service_type}</td>
        <td class="cell">${row.route}</td>
        <td class="cell">${row.service_description}</td>
        <td class="cell">${row.date}</td>
      </tr>
    `).join('');

    const statsTableRows = data.stats.map((stat: any, idx: number) => `
      <tr>
        <td class="cell">${stat.truck_number}</td>
        <td class="cell" style="text-align:right">KSh ${stat.total_cost.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
        <td class="cell" style="text-align:right">${stat.total_quantity}</td>
      </tr>
    `).join('');

    const reportHtml = `
      <html>
      <head>
        <title>${data.type}</title>
        <style>
          body {
            font-family: 'Roboto', Arial, sans-serif;
            background: #f2f2f2;
            margin: 0;
            padding: 0;
          }
          .report-container {
            box-sizing: border-box;
            background: #fff;
            margin: 32px auto;
            max-width: 1100px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 8px rgba(40,40,40,0.07);
            border-radius: 10px;
            padding: 36px 32px 42px 32px;
          }
          .report-header {
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 12px;
            margin-bottom: 24px;
          }
          .report-title {
            color: #2c3e50;
            font-size: 2.3rem;
            font-weight: 700;
            margin: 0;
          }
          .report-meta {
            font-size: 1rem;
            color: #555;
            margin-top: 6px;
            margin-bottom: 4px;
            font-weight: 500;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
            background: #fafafa;
          }
          th {
            font-size: 1rem;
            font-weight: 600;
            background: #f5f5f5;
            color: #212121;
            padding: 10px 6px;
            border: 1px solid #d9d9d9;
            text-align: left;
          }
          .cell, td {
            border: 1px solid #e0e0e0;
            padding: 11px 8px;
            font-size: 0.97rem;
            vertical-align: top;
            background: #fff;
          }
          tr:nth-child(even) {
            background: #f3f6fa;
          }
          .stats-header {
            color: #2c3e50;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5em;
            margin-top: 0;
          }
          .stats-table {
            width: 100%;
            border-collapse: collapse;
            background: #f8f8f8;
          }
          .stats-table th, .stats-table td {
            border: 1px solid #e0e0e0;
            padding: 10px 7px;
          }
          @media print {
            .print-btn { display: none !important; }
            body {
              background: #fff !important;
            }
            .report-container {
              box-shadow: none !important;
              margin: 0 !important;
              border-radius: 0 !important;
              padding: 0 !important;
              border: none !important;
              max-width: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <div class="report-title">${data.type}</div>
            <div class="report-meta">Period: ${data.period}</div>
            <div class="report-meta">Truck: ${data.truckFilter}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Truck Name</th>
                <th>Spare Part</th>
                <th>Quantity</th>
                <th>Price Per Unit</th>
                <th>Total Cost</th>
                <th>Maintenance Category</th>
                <th>Service Type</th>
                <th>Route</th>
                <th>Service Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="stats-header">Truck Spares Statistics</div>
          <table class="stats-table">
            <thead>
              <tr>
                <th>Truck Name</th>
                <th>Total Spares Spend</th>
                <th>Total Quantity Bought</th>
              </tr>
            </thead>
            <tbody>
              ${statsTableRows}
            </tbody>
          </table>
          <br>
          <button class="print-btn" onclick="window.print()">Print Report</button>
        </div>
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
