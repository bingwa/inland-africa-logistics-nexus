
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface TripActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'start' | 'complete';
  tripNumber: string;
  isLoading?: boolean;
}

export const TripActionDialog: React.FC<TripActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  tripNumber,
  isLoading = false
}) => {
  const isStartAction = action === 'start';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isStartAction ? (
              <CheckCircle className="w-5 h-5 text-blue-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-green-600" />
            )}
            {isStartAction ? 'Start Trip' : 'Complete Trip'}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {isStartAction ? 'start' : 'complete'} trip{' '}
            <span className="font-semibold">{tripNumber}</span>?
            {isStartAction && (
              <div className="mt-2 text-sm text-muted-foreground">
                This will mark the trip as "In Progress" and set the actual departure time.
              </div>
            )}
            {!isStartAction && (
              <div className="mt-2 text-sm text-muted-foreground">
                This will mark the trip as "Completed" and set the actual arrival time.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={isStartAction ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {isStartAction ? 'Starting...' : 'Completing...'}
              </>
            ) : (
              <>
                {isStartAction ? 'Start Trip' : 'Complete Trip'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
