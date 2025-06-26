
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterExportBar } from "@/components/FilterExportBar";
import { Package, Plus, AlertTriangle, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSpareParts } from "@/hooks/useSupabaseData";
import { AddInventoryForm } from "@/components/forms/AddInventoryForm";
import { EditInventoryModal } from "@/components/modals/EditInventoryModal";
import { UpdateStockModal } from "@/components/modals/UpdateStockModal";
import { ReorderModal } from "@/components/modals/ReorderModal";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [updatingStockItem, setUpdatingStockItem] = useState(null);
  const [reorderingItem, setReorderingItem] = useState(null);
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
    return matchesSearch;
  }) || [];

  const totalItems = spareParts?.reduce((sum, part) => sum + part.quantity_in_stock, 0) || 0;
  const lowStockItems = spareParts?.filter(part => part.quantity_in_stock <= part.minimum_stock_level && part.quantity_in_stock > 0).length || 0;
  const outOfStockItems = spareParts?.filter(part => part.quantity_in_stock === 0).length || 0;
  const totalValue = spareParts?.reduce((sum, part) => sum + (part.quantity_in_stock * part.unit_price * 130), 0) || 0;

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters:', filters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting inventory in ${format} format`);
  };

  const handleEditItem = (updatedItem: any) => {
    console.log('Updating item:', updatedItem);
    // Here you would call the update mutation
  };

  const handleUpdateStock = (itemId: string, newQuantity: number, operation: 'add' | 'remove' | 'set') => {
    console.log(`Updating stock for ${itemId}: ${operation} ${newQuantity}`);
    // Here you would call the stock update mutation
  };

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
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['in_stock', 'low_stock', 'out_of_stock'],
                types: ['engine', 'brakes', 'transmission', 'electrical', 'suspension', 'tires', 'filters', 'oils', 'body', 'other']
              }}
            />

            {/* Inventory Items */}
            <div className="space-y-4 mt-6">
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          onClick={() => setEditingItem(part)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-400 text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => setUpdatingStockItem(part)}
                        >
                          Update Stock
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-400 text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => setReorderingItem(part)}
                        >
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

        {/* Modals */}
        {showAddForm && (
          <AddInventoryForm onClose={() => setShowAddForm(false)} />
        )}

        {editingItem && (
          <EditInventoryModal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            item={editingItem}
            onSave={handleEditItem}
          />
        )}

        {updatingStockItem && (
          <UpdateStockModal
            isOpen={!!updatingStockItem}
            onClose={() => setUpdatingStockItem(null)}
            item={updatingStockItem}
            onUpdate={handleUpdateStock}
          />
        )}

        {reorderingItem && (
          <ReorderModal
            isOpen={!!reorderingItem}
            onClose={() => setReorderingItem(null)}
            item={reorderingItem}
          />
        )}
      </div>
    </Layout>
  );
};

export default InventoryManagement;
