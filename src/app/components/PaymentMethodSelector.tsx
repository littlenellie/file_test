import { Building2, CreditCard, Landmark } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/components/ui/utils";

export type PaymentMethod = "bank" | "debit" | "credit";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const paymentMethods = [
  {
    id: "bank" as PaymentMethod,
    label: "Pay by Bank",
    description: "Direct bank transfer",
    icon: Landmark,
  },
  {
    id: "debit" as PaymentMethod,
    label: "Debit Card",
    description: "Pay with debit card",
    icon: Building2,
  },
  {
    id: "credit" as PaymentMethod,
    label: "Credit Card",
    description: "Pay with credit card",
    icon: CreditCard,
  },
];

export function PaymentMethodSelector({ selectedMethod, onMethodChange, disabled }: PaymentMethodSelectorProps) {
  return (
    <RadioGroup value={selectedMethod} onValueChange={onMethodChange} disabled={disabled}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div key={method.id}>
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
                disabled={disabled}
              />
              <Label
                htmlFor={method.id}
                className={cn(
                  "flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all",
                  "hover:border-primary hover:bg-muted/50",
                  isSelected && "border-primary bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon className={cn("w-8 h-8 mb-3", isSelected && "text-primary")} />
                <span className="text-base mb-1">{method.label}</span>
                <span className="text-sm text-muted-foreground">{method.description}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
}
