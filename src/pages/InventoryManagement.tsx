
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, AlertTriangle, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSpareParts } from "@/hooks/useSupabaseData";
import { AddInventoryForm } from "@/components/forms/AddInventoryForm";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400' };
    if (currentStock <= minStock) return { status: 'low_stock', color: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400' };
    return { status: 'in_stock', color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400' };
  };

  const filteredParts = spareParts?.filter(part => {
    const matchesSearch = part.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const totalItems = spareParts?.reduce((sum, part) => sum + part.quantity_in_stock, 0) || 0;
  const lowStockItems = spareParts?.filter(part => part.quantity_in_stock <= part.minimum_stock_level && part.quantity_in_stock > 0).length || 0;
  const outOfStockItems = spareParts?.filter(part => part.quantity_in_stock === 0).length || 0;
  const totalValue = spareParts?.reduce((sum, part) => sum + (part.quantity_in_stock * part.unit_price * 130), 0) || 0;

  const categories = ['all', 'engine', 'brakes', 'transmission', 'electrical', 'suspension', 'tires', 'filters', 'oils', 'body', 'other'];

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
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setShowAddForm(true)}
          >
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
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{lowStockItems}</p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
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
                  <p className="text-xl sm:text-2xl font-bold text-green-600">KSh {Math.round(totalValue / 1000000 * 10) / 10}M</p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Overview */}
        <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Monitor and manage spare parts inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  className="pl-10 border-yellow-300 focus:border-yellow-500 dark:border-yellow-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-yellow-400 rounded-md bg-background text-foreground"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Button variant="outline" className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20">Export</Button>
              </div>
            </div>

            {/* Inventory Items */}
            <div className="space-y-4">
              {filteredParts.map((part) => {
                const stockStatus = getStockStatus(part.quantity_in_stock, part.minimum_stock_level);
                
                return (
                  <Card key={part.id} className="hover:shadow-md transition-shadow border-2 border-yellow-300/50 dark:border-yellow-600/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-foreground">{part.part_name}</h3>
                            <Badge className={stockStatus.color + " border"}>
                              {stockStatus.status === 'in_stock' ? 'In Stock' : 
                               stockStatus.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                            <div className="text-muted-foreground">
                              <span className="font-medium">SKU:</span> {part.part_number}
                            </div>
                            <div className="text-muted-foreground">
                              <span className="font-medium">Category:</span> {part.category}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Stock</p>
                            <p className="font-medium text-foreground">{part.quantity_in_stock}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Unit Price</p>
                            <p className="font-medium text-foreground">KSh {Math.round(part.unit_price * 130).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="font-medium text-foreground">KSh {Math.round(part.quantity_in_stock * part.unit_price * 130).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Supplier</p>
                            <p className="font-medium text-foreground">{part.supplier || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {part.description && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground">{part.description}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
                        <Button size="sm" variant="outline" className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-400 text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          Update Stock
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-400 text-foreground hover:bg-green-50 dark:hover:bg-green-900/20">
                          Reorder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {(!spareParts || spareParts.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No inventory items found. Add your first item to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <AddInventoryForm onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </Layout>
  );
};

export default InventoryManagement;
