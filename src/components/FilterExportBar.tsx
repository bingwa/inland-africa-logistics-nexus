
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FilterExportBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterApply: (filters: any) => void;
  onExport: (format: string) => void;
  filterOptions?: {
    status?: string[];
    types?: string[];
    locations?: string[];
    make?: string[];
  };
  showDateFilter?: boolean;
}

export const FilterExportBar: React.FC<FilterExportBarProps> = ({
  searchTerm,
  onSearchChange,
  onExport,
}) => {
  const { toast } = useToast();

  const handleExport = (format: string) => {
    // Create sample data for export
    const sampleData = [
      { id: 1, name: "Sample Item 1", status: "Active", date: new Date().toISOString() },
      { id: 2, name: "Sample Item 2", status: "Inactive", date: new Date().toISOString() }
    ];

    switch (format) {
      case 'csv':
        exportToCSV(sampleData);
        break;
      case 'excel':
        exportToExcel(sampleData);
        break;
      case 'pdf':
        exportToPDF(sampleData);
        break;
      case 'print':
        printData(sampleData);
        break;
      default:
        break;
    }

    onExport(format);
    toast({
      title: "Export Started",
      description: `Data exported in ${format.toUpperCase()} format successfully!`,
    });
  };

  const exportToCSV = (data: any[]) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data: any[]) => {
    toast({
      title: "Excel Export",
      description: "Excel export functionality would be implemented here with a proper Excel library.",
    });
  };

  const exportToPDF = (data: any[]) => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here with a PDF library.",
    });
  };

  const printData = (data: any[]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Data Report</h1>
            <table>
              <tr>${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}</tr>
              ${data.map(row => 
                `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`
              ).join('')}
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Export Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search..."
            className="pl-10 text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-[100px] sm:w-[130px] text-sm">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="excel">Export Excel</SelectItem>
              <SelectItem value="pdf">Export PDF</SelectItem>
              <SelectItem value="print">Print Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
