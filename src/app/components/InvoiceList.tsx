import { Checkbox } from "@/app/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  dateDue: string;
  amount: number;
}

interface InvoiceListProps {
  invoices: Invoice[];
  selectedInvoiceIds: string[];
  onToggleInvoice: (id: string) => void;
  onToggleAll: () => void;
}

export function InvoiceList({ invoices, selectedInvoiceIds, onToggleInvoice, onToggleAll }: InvoiceListProps) {
  const allSelected = invoices.length > 0 && selectedInvoiceIds.length === invoices.length;
  const someSelected = selectedInvoiceIds.length > 0 && !allSelected;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="Select all invoices"
              />
            </TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date Due</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const isSelected = selectedInvoiceIds.includes(invoice.id);
            const isPastDue = new Date(invoice.dateDue) < new Date();
            
            return (
              <TableRow
                key={invoice.id}
                className={isSelected ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleInvoice(invoice.id)}
                    aria-label={`Select invoice ${invoice.invoiceNumber}`}
                  />
                </TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  <span className={isPastDue ? "text-red-600" : ""}>
                    {formatDate(invoice.dateDue)}
                    {isPastDue && " (Overdue)"}
                  </span>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}