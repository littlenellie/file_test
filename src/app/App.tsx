import { useState } from "react";
import { InvoiceList, type Invoice } from "@/app/components/InvoiceList";
import { PaymentStatusFlow, type PaymentStatus } from "@/app/components/PaymentStatusFlow";
import { PaymentMethodSelector, type PaymentMethod } from "@/app/components/PaymentMethodSelector";
import { PaymentSummary } from "@/app/components/PaymentSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import bookerLogo from "@/assets/booker.svg";

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    dateDue: "2024-01-15",
    amount: 1250.00,
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    dateDue: "2026-02-10",
    amount: 3420.50,
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    dateDue: "2026-02-20",
    amount: 875.25,
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    dateDue: "2026-02-28",
    amount: 2100.00,
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    dateDue: "2026-03-05",
    amount: 1650.75,
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-006",
    dateDue: "2026-03-15",
    amount: 4200.00,
  },
];

export default function App() {
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("start");
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  const handleToggleInvoice = (id: string) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((invoiceId) => invoiceId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedInvoiceIds.length === mockInvoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(mockInvoices.map((invoice) => invoice.id));
    }
  };

  const calculateTotal = () => {
    return mockInvoices
      .filter((invoice) => selectedInvoiceIds.includes(invoice.id))
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

 /* const handleProceedToPayment = () => {
    // Simulate payment flow
    const statusSequence: PaymentStatus[] = ["authorising", "authorised", "executed", "settled"];
    let currentStep = 0;

    setPaymentStatus("authorising");
    setShowDelayMessage(false);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statusSequence.length) {
        setPaymentStatus(statusSequence[currentStep]);
        
        // Show delay message when reaching "executed" status
        if (statusSequence[currentStep] === "executed") {
          setTimeout(() => {
            setShowDelayMessage(true);
          }, 3000); // Show delay message after 3 seconds in "Processing" state
        }
      } else {
        clearInterval(interval);
      }
    }, 2000); // 2 seconds between each status
  };*/
   const handleProceedToPayment = () => {
    // Simulate payment flow
    const statusSequence: PaymentStatus[] = ["authorising", "authorised", "executed"];
    let currentStep = 0;

    setPaymentStatus("authorising");
    setShowDelayMessage(false);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statusSequence.length) {
        setPaymentStatus(statusSequence[currentStep]);
        
        // Show delay message when reaching "executed" status
        if (statusSequence[currentStep] === "executed") {
          setTimeout(() => {
            setShowDelayMessage(true);
          }, 3000); // Show delay message after 3 seconds in "Processing" state
        }
      } else {
        clearInterval(interval);
      }
    }, 2000); // 2 seconds between each status
  };

  const handleAbortPayment = () => {
    setPaymentStatus("start");
    setShowDelayMessage(false);
  };
  const handleWaitPayment = () => {
    setPaymentStatus("start");
    setShowDelayMessage(false);
  };

  const handleReset = () => {
    setSelectedInvoiceIds([]);
    setPaymentStatus("start");
    setPaymentMethod("bank");
    setShowDelayMessage(false);
  };

  return (
    <div className="min-h-screen bg-[rgb(250,250,245)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-6">
          <img src={bookerLogo} alt="Booker" className="h-10" />
          <div className="flex-1 text-center">
            <span className="text-4xl tracking-tight">Outstanding Invoices Dashboard</span>
            <p className="text-lg text-muted-foreground">
              Manage and pay your outstanding invoices
            </p>
          </div>
        </div>

        {/* Payment Status Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Track your payment authorisation progress</CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <PaymentStatusFlow 
              currentStatus={paymentStatus} 
              showDelayMessage={showDelayMessage}
              onAbortPayment={handleAbortPayment}
              onWaitPayment={handleWaitPayment}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice List */}
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Invoices</CardTitle>
                <CardDescription>
                  Select invoices to include in your payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceList
                  invoices={mockInvoices}
                  selectedInvoiceIds={selectedInvoiceIds}
                  onToggleInvoice={handleToggleInvoice}
                  onToggleAll={handleToggleAll}
                />
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you would like to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  disabled={paymentStatus !== "start"}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PaymentSummary
              selectedCount={selectedInvoiceIds.length}
              totalAmount={calculateTotal()}
              onProceedToPayment={handleProceedToPayment}
              paymentStatus={paymentStatus}
              paymentMethod={paymentMethod}
            />

            {paymentStatus === "settled" && (
              <Card style={{ backgroundColor: 'rgb(31, 206, 181)', color: 'white' }}>
                <CardContent className="pt-6 text-center space-y-4">
                  <p className="text-sm">Payment completed successfully!</p>
                  <button
                    onClick={handleReset}
                    className="text-sm underline hover:no-underline"
                  >
                    Process another payment
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
