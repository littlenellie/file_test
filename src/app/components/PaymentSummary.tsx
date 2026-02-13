import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { CheckCircle } from "lucide-react";
import type { PaymentStatus } from "./PaymentStatusFlow";
import type { PaymentMethod } from "./PaymentMethodSelector";
import { QRCodeSVG } from "qrcode.react";

interface PaymentSummaryProps {
  selectedCount: number;
  totalAmount: number;
  onProceedToPayment: () => void;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export function PaymentSummary({ selectedCount, totalAmount, onProceedToPayment, paymentStatus, paymentMethod }: PaymentSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const isPaymentInProgress = paymentStatus !== "start";
  const isPaymentComplete = paymentStatus === "settled";

  // Calculate 1% rebate for Pay by Bank
  const rebateAmount = totalAmount * 0.01;

  // Generate a payment URL for the QR code (this would be a real payment URL in production)
  const paymentUrl = `https://pay.booker.co.uk/invoice?amount=${totalAmount}&currency=GBP&ref=${Date.now()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Selected Invoices</span>
            <span>{selectedCount}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="text-2xl">{formatCurrency(totalAmount)}</span>
          </div>
          {paymentMethod === "bank" && selectedCount > 0 && (
            <div className="flex justify-between text-sm pt-2 text-green-700">
              <span>Incentive Rebate (1%)</span>
              <span>{formatCurrency(rebateAmount)}</span>
            </div>
          )}
          {paymentMethod === "bank" && selectedCount > 0 && (
            <p className="text-xs text-muted-foreground pt-1">
              * Rebate will be applied to future purchases
            </p>
          )}
        </div>

        {isPaymentComplete ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span>Payment Completed Successfully</span>
          </div>
        ) : (
          <>
            <Button
              className="w-full"
              size="lg"
              onClick={onProceedToPayment}
              disabled={selectedCount === 0 || isPaymentInProgress}
              style={{ backgroundColor: 'rgb(31, 206, 181)', color: 'white' }}
            >
              {isPaymentInProgress ? "Processing..." : `Pay ${formatCurrency(totalAmount)}`}
            </Button>
            {paymentMethod === "bank" && !isPaymentInProgress && selectedCount > 0 && (
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground">Click the Pay button to continue online</p>
            </div>)}
            {/* Show QR Code when Pay by Bank is selected and payment hasn't started */}
            {paymentMethod === "bank" && !isPaymentInProgress && selectedCount > 0 && (
              
              <div className="flex flex-col items-center gap-3 p-4 bg-white border rounded-lg">
                <QRCodeSVG value={paymentUrl} size={180} level="H" />
                <p className="text-xs text-muted-foreground text-center">
                  Scan to pay with your mobile banking app
                </p>
              </div>
            )}
          </>
        )}

        {selectedCount === 0 && !isPaymentInProgress && (
          <p className="text-sm text-muted-foreground text-center">
            Select invoices to proceed with payment
          </p>
        )}
      </CardContent>
    </Card>
  );
}