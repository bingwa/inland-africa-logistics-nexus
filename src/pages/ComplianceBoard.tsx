import { useState } from "react";
import { useTruckCompliance, useUpsertCompliance } from "@/hooks/useFuelCompliance";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import { toast } from "@/components/ui/sonner";

const daysBeforeAlert = 30;

const ComplianceBoard = () => {
  const { data, isLoading } = useTruckCompliance();
  const upsert = useUpsertCompliance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const today = new Date();

  const getColour = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isBefore(date, today)) return "text-red-600";
    if (isBefore(date, addDays(today, daysBeforeAlert))) return "text-amber-500";
    return "text-green-600";
  };

  const startEdit = (row: any) => {
    setEditingId(row.truck_id);
    setForm({ ...row });
  };

  const save = async () => {
    await upsert.mutateAsync(form);
    toast.success("Saved");
    setEditingId(null);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-7 h-7" />
          <h1 className="text-2xl font-bold">Compliance Board</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Truck Compliance</CardTitle>
            <CardDescription>
              Upcoming expiries highlighted ({daysBeforeAlert} days alert window)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Truck</th>
                    <th className="py-2 pr-4">NTSA (Renewal)</th>
                    <th className="py-2 pr-4">NTSA (Expiry)</th>
                    <th className="py-2 pr-4">Insurance (Renewal)</th>
                    <th className="py-2 pr-4">Insurance (Expiry)</th>
                    <th className="py-2 pr-4">TGL (Renewal)</th>
                    <th className="py-2 pr-4">TGL (Expiry)</th>
                    <th className="py-2 pr-4" />
                  </tr>
                </thead>
                <tbody>
                  {data?.map((row) => (
                    <tr key={row.truck_id} className="border-b hover:bg-muted/20">
                      <td className="py-2 pr-4 font-medium">{row.trucks?.truck_number ?? row.truck_id}</td>
                      {["ntsa_renewal", "ntsa_expiry", "insurance_renewal", "insurance_expiry", "tgl_renewal", "tgl_expiry"].map((field) => (
                        <td key={field} className="py-2 pr-4">
                          {editingId === row.truck_id ? (
                            <input
                              type="date"
                              value={form[field]?.substring(0, 10) ?? ""}
                              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                              className="border px-2 py-1 rounded"
                            />
                          ) : (
                            <span className={getColour((row as any)[field])}>{format(new Date((row as any)[field]), "yyyy-MM-dd")}</span>
                          )}
                        </td>
                      ))}
                      <td className="py-2 pr-4">
                        {editingId === row.truck_id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={save} disabled={upsert.isPending}>Save</Button>
                            <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => startEdit(row)}>Edit</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ComplianceBoard;
