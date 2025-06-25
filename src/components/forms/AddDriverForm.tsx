
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDriver } from "@/hooks/useSupabaseData";
import { X } from "lucide-react";

interface AddDriverFormProps {
  onClose: () => void;
}

interface DriverFormData {
  employee_id: string;
  full_name: string;
  license_number: string;
  license_expiry: string;
  phone: string;
  email?: string;
  hire_date: string;
  address?: string;
}

export const AddDriverForm = ({ onClose }: AddDriverFormProps) => {
  const { register, handleSubmit, setValue, reset } = useForm<DriverFormData>();
  const createDriver = useCreateDriver();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: DriverFormData) => {
    setIsLoading(true);
    try {
      await createDriver.mutateAsync({
        employee_id: data.employee_id,
        full_name: data.full_name,
        license_number: data.license_number,
        license_expiry: data.license_expiry,
        phone: data.phone,
        email: data.email,
        hire_date: data.hire_date,
        address: data.address,
        status: 'active',
        compliance_score: 100,
        hours_of_service_today: 0
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating driver:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Add New Driver</CardTitle>
            <CardDescription>Enter driver details to add to your team</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  {...register("employee_id", { required: true })}
                  placeholder="e.g., EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  {...register("full_name", { required: true })}
                  placeholder="e.g., John Mwangi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number *</Label>
                <Input
                  id="license_number"
                  {...register("license_number", { required: true })}
                  placeholder="e.g., DL001234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_expiry">License Expiry *</Label>
                <Input
                  id="license_expiry"
                  type="date"
                  {...register("license_expiry", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...register("phone", { required: true })}
                  placeholder="e.g., +254712345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="e.g., john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date *</Label>
                <Input
                  id="hire_date"
                  type="date"
                  {...register("hire_date", { required: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Enter driver's address"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Driver"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
