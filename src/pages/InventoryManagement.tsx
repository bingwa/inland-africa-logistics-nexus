
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSpareParts } from "@/hooks/useSupabaseData";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: spareParts, isLoading, error } = useSpareParts();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Error loading inventory: {error.message}
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Low Stock": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Out of Stock": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return "Out of Stock";
    if (current <= minimum) return "Low Stock";
    return "In Stock";
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    return {
      percentage,
      color: current <= min ? 'bg-red-500' : current <= min * 1.5 ? 'bg-yellow-500' : 'bg-green-500'
    };
  };

  const filteredItems = spareParts?.filter(item =>
    item.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalItems = spareParts?.reduce((sum, part) => sum + part.quantity_in_stock, 0) || 0;
  const lowStockItems = spareParts?.filter(part => part.quantity_in_stock <= part.minimum_stock_level).length || 0;
  const outOfStockItems = spareParts?.filter(part => part.quantity_in_stock === 0).length || 0;
  const totalValue = spareParts?.reduce((sum, part) => sum + (part.quantity_in_stock * part.unit_price), 0) || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8" />
              Inventory & Spare Parts
            </h1>
            <p className="text-muted-foreground">Manage spare parts inventory and stock levels</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Inventory Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalItems.toLocaleString()}</p>
                </div>
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                </div>
                <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{outOfStockItems}</p>
                </div>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">KSh {totalValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Monitor and manage spare parts inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, part number, or category..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Filter by Category</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const stockLevel = getStockLevel(item.quantity_in_stock, item.minimum_stock_level, item.minimum_stock_level * 3);
                const status = getStockStatus(item.quantity_in_stock, item.minimum_stock_level);
                return (
                  <div key={item.id} className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{item.part_name}</h3>
                        <p className="text-sm text-muted-foreground">Part #: {item.part_number} | Category: {item.category}</p>
                      </div>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="font-bold text-xl sm:text-2xl text-foreground">{item.quantity_in_stock}</p>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${stockLevel.color}`}
                            style={{ width: `${Math.min(stockLevel.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Min: {item.minimum_stock_level}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Unit Price</p>
                        <p className="font-semibold text-lg">KSh {item.unit_price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Per unit</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="font-semibold text-lg">KSh {(item.quantity_in_stock * item.unit_price).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Current stock value</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Supplier</p>
                        <p className="font-medium">{item.supplier || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Rating: {item.supplier_rating || 'N/A'}/5</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        Edit
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none">
                        Restock
                      </Button>
                      {status === "Low Stock" && (
                        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300 flex-1 sm:flex-none">
                          Generate PO
                        </Button>
                      )}
                      {status === "Out of Stock" && (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300 flex-1 sm:flex-none">
                          Urgent Order
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Critical Stock Alerts
              </CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spareParts?.filter(item => item.quantity_in_stock <= item.minimum_stock_level).slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.part_name}</p>
                      <p className="text-sm text-muted-foreground">Stock: {item.quantity_in_stock} units</p>
                    </div>
                    <Badge className={getStatusColor(getStockStatus(item.quantity_in_stock, item.minimum_stock_level))}>
                      {getStockStatus(item.quantity_in_stock, item.minimum_stock_level)}
                    </Badge>
                  </div>
                )) || []}
                {(!spareParts || spareParts.filter(item => item.quantity_in_stock <= item.minimum_stock_level).length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">
                    No critical alerts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>Latest inventory transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "In", item: "Brake Pads", quantity: "+25", date: "2024-12-28", value: "KSh 312,500" },
                  { type: "Out", item: "Engine Oil Filter", quantity: "-12", date: "2024-12-28", value: "KSh 33,600" },
                  { type: "In", item: "Air Filters", quantity: "+30", date: "2024-12-27", value: "KSh 126,000" },
                  { type: "Out", item: "Tire", quantity: "-2", date: "2024-12-27", value: "KSh 70,000" },
                ].map((movement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{movement.item}</p>
                      <p className="text-sm text-muted-foreground">{movement.date}</p>
                      <p className="text-sm text-muted-foreground">{movement.value}</p>
                    </div>
                    <span className={`font-bold ${
                      movement.type === 'In' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryManagement;
