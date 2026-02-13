import {
  Check,
  Clock,
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import * as React from "react";

export type PaymentStatus =
  | "start"
  | "authorising"
  | "authorised"
  | "executed"
  | "settled";

interface PaymentStatusFlowProps {
  currentStatus: PaymentStatus;
  showDelayMessage: boolean;
  onAbortPayment: () => void;
  onWaitPayment: () => void;
}

interface StatusStep {
  id: PaymentStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const statusSteps: StatusStep[] = [
  { id: "start", label: "Start", icon: Clock },
  { id: "authorising", label: "Authorising", icon: Loader2 },
  { id: "authorised", label: "Authorised", icon: Check },
  { id: "executed", label: "Processing", icon: Send },
  { id: "settled", label: "Paid", icon: CheckCircle2 },
];

export function PaymentStatusFlow({
  currentStatus,
  showDelayMessage,
  onAbortPayment,
  onWaitPayment,
}: PaymentStatusFlowProps) {
  const currentIndex = statusSteps.findIndex(
    (step) => step.id === currentStatus,
  );

  // Keep the toast mounted and only toggle classes for animation
  const show = showDelayMessage && currentStatus === "executed";

  return (
    <div className="w-full space-y-6">
      {/* Progress + Steps */}
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5 bg-border"
          style={{ zIndex: 0 }}
        >
          <div
            className="h-full bg-primary transition-all duration-1000"
            style={{
              width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Status steps */}
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative"
              style={{ zIndex: 1 }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isActive &&
                    "bg-primary border-primary text-primary-foreground animate-pulse",
                  isPending &&
                    "bg-background border-border text-muted-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive &&
                      step.id === "authorising" &&
                      "animate-spin",
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2 text-sm whitespace-nowrap",
                  isActive && "text-primary",
                  isCompleted && "text-foreground",
                  isPending && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Delay Message Toast (always mounted, animated via classes) */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "overflow-hidden rounded-lg border-2 border-[rgb(255,68,12)] bg-orange-50 transition-all duration-300 ease-out",
          // Hidden (initial/collapsed) state
          !show &&
            "opacity-0 -translate-y-2 max-h-0 pointer-events-none",
          // Visible (expanded) state
          show && "opacity-100 translate-y-0 max-h-[300px]",
        )}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[rgb(255,68,12)] flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-800">
                There has been a bank delay processing your
                transaction; it may take up to two hours to
                complete. Click the{" "}
                <strong>Pay Another Way</strong> button to abort
                and choose a different payment method, or click{" "}
                <strong>I&apos;ll Wait</strong> to wait for the
                processing to complete.
              </p>

              {/* Buttons */}
              <div className="mt-2 flex gap-2">
                {onAbortPayment && (
                  <Button
                    onClick={onAbortPayment}
                    variant="outline"
                    size="sm"
                    className="border-[rgb(255,68,12)] text-[rgb(255,68,12)] hover:bg-orange-50"
                  >
                    Pay Another Way
                  </Button>
                )}

                {onWaitPayment && (
                  <Button
                    onClick={onWaitPayment}
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    I&apos;ll Wait
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}