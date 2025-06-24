
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const inventoryItems = [
    {
      id: "INV-001",
      name: "Brake Pads",
      category: "Brakes",
      sku: "BP-HD-001",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unitPrice: 85,
      supplier: "AutoParts Nigeria",
      lastRestocked: "2024-06-15",
      status: "In Stock",
    },
    {
      id: "INV-002",
      name: "Engine Oil (15W-40)",
      category: "Fluids",
      sku: "EO-15W40-5L",
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unitPrice: 45,
      supplier: "Mobil Nigeria",
      lastRestocked: "2024-06-10",
      status: "Low Stock",
    },
    {
      id: "INV-003",
      name: "Air Filter",
      category: "Filters",
      sku: "AF-HD-003",
      currentStock: 0,
      minStock: 10,
      maxStock: 30,
      unitPrice: 25,
      supplier: "FilterTech Lagos",
      lastRestocked: "2024-05-20",
      status: "Out of Stock",
    },
    {
      id: "INV-004",
      name: "Hydraulic Hose",
      category: "Hydraulics",
      sku: "HH-20M-001",
      currentStock: 25,
      minStock: 10,
      maxStock: 40,
      unitPrice: 120,
      supplier: "HydraulicPro",
      lastRestocked: "2024-06-20",
      status: "In Stock",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-800";
      case "Low Stock": return "bg-yellow-100 text-yellow-800";
      case "Out of Stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    return {
      percentage,
      color: current <= min ? 'bg-red-500' : current <= min * 1.5 ? 'bg-yellow-500' : 'bg-green-500'
    };
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-logistics-primary flex items-center gap-3">
              <Package className="w-8 h-8" />
              Inventory & Spare Parts
            </h1>
            <p className="text-gray-600">Manage spare parts inventory and stock levels</p>
          </div>
          <Button className="bg-logistics-primary hover:bg-logistics-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Inventory Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-logistics-primary">2,350</p>
                </div>
                <Package className="w-8 h-8 text-logistics-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-yellow-600">23</p>
                </div>
                <TrendingDown className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">₦2.4M</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Monitor and manage spare parts inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter by Category</Button>
              <Button variant="outline">Export</Button>
            </div>

            {/* Inventory Table */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock);
                return (
                  <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-logistics-primary text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.sku} | Category: {item.category}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="font-bold text-2xl text-logistics-primary">{item.currentStock}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${stockLevel.color}`}
                            style={{ width: `${Math.min(stockLevel.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Unit Price</p>
                        <p className="font-semibold text-lg">₦{item.unitPrice}</p>
                        <p className="text-sm text-gray-500">Per unit</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="font-semibold text-lg">₦{(item.currentStock * item.unitPrice).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Current stock value</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Supplier</p>
                        <p className="font-medium">{item.supplier}</p>
                        <p className="text-sm text-gray-500">Last: {item.lastRestocked}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" className="bg-logistics-primary hover:bg-logistics-secondary">
                        Restock
                      </Button>
                      {item.status === "Low Stock" && (
                        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300">
                          Generate PO
                        </Button>
                      )}
                      {item.status === "Out of Stock" && (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Critical Stock Alerts
              </CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryItems.filter(item => item.status !== "In Stock").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Stock: {item.currentStock} units</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>Latest inventory transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "In", item: "Brake Pads", quantity: "+25", date: "2024-06-28" },
                  { type: "Out", item: "Engine Oil", quantity: "-12", date: "2024-06-28" },
                  { type: "In", item: "Air Filters", quantity: "+30", date: "2024-06-27" },
                  { type: "Out", item: "Hydraulic Hose", quantity: "-5", date: "2024-06-27" },
                ].map((movement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{movement.item}</p>
                      <p className="text-sm text-gray-600">{movement.date}</p>
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
