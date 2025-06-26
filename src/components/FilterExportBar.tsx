
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Download, X, Calendar } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker";
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
  };
  showDateFilter?: boolean;
}

export const FilterExportBar: React.FC<FilterExportBarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterApply,
  onExport,
  filterOptions = {},
  showDateFilter = true
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const { toast } = useToast();

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const finalFilters = { ...filters };
    if (dateRange.from && dateRange.to) {
      finalFilters.dateRange = dateRange;
    }
    onFilterApply(finalFilters);
    setShowFilters(false);
    toast({
      title: "Filters Applied",
      description: "Data has been filtered according to your criteria.",
    });
  };

  const clearFilters = () => {
    setFilters({});
    setDateRange({ from: undefined, to: undefined });
    onFilterApply({});
    setShowFilters(false);
    toast({
      title: "Filters Cleared",
      description: "All filters have been removed.",
    });
  };

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
    // Simulate Excel export
    const csvContent = exportToCSV(data);
    toast({
      title: "Excel Export",
      description: "Excel export functionality would be implemented here with a proper Excel library.",
    });
  };

  const exportToPDF = (data: any[]) => {
    // Simulate PDF export
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
      {/* Search and Action Bar */}
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
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm whitespace-nowrap"
            size="sm"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
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

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Advanced Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              {filterOptions.status && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      {filterOptions.status.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Type Filter */}
              {filterOptions.types && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={filters.type || ''} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {filterOptions.types.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Location Filter */}
              {filterOptions.locations && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={filters.location || ''} onValueChange={(value) => handleFilterChange('location', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
                      {filterOptions.locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date Range Filter */}
              {showDateFilter && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters} size="sm" className="text-sm">
                Clear All
              </Button>
              <Button onClick={applyFilters} size="sm" className="text-sm">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
