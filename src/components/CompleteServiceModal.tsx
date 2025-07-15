import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export function CompleteServiceModal({
  isOpen,
  onClose,
  onComplete,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { actualCompletionDate: Date; notes: string; finalCost: number }) => void;
  isLoading: boolean;
}) {
  const [actualCompletionDate, setActualCompletionDate] = useState<Date>(new Date());
  const [finalCost, setFinalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [costError, setCostError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const costValue = parseFloat(finalCost);
    if (isNaN(costValue) || costValue < 0) {
      setCostError("Please enter a valid cost");
      return;
    }
    
    onComplete({
      actualCompletionDate,
      notes,
      finalCost: costValue
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Service</DialogTitle>
          <DialogDescription>
            Add completion details for this service record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="completionDate">Completion Date</Label>
            <div className="border rounded-md p-2">
              <Calendar
                mode="single"
                selected={actualCompletionDate}
                onSelect={(date) => date && setActualCompletionDate(date)}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="finalCost">Final Cost (KSh)</Label>
            <Input
              id="finalCost"
              type="number"
              min="0"
              step="0.01"
              value={finalCost}
              onChange={(e) => {
                setFinalCost(e.target.value);
                setCostError("");
              }}
              placeholder="Enter final cost"
            />
            {costError && <p className="text-sm text-red-500">{costError}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Service Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the service"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                "Complete Service"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
