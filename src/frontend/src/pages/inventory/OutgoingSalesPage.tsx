import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { InventorySummary, Product, Sale } from "../../types/inventory";

interface OutgoingSalesPageProps {
  sales: Sale[];
  products: Product[];
  summary: InventorySummary[];
  onRecord: (data: Omit<Sale, "id">) => Promise<void>;
}

const emptyForm = {
  productId: "",
  quantity: "",
  customerName: "",
  saleDate: new Date().toISOString().split("T")[0],
};

export function OutgoingSalesPage({
  sales,
  products,
  summary,
  onRecord,
}: OutgoingSalesPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const selectedProduct = products.find((p) => String(p.id) === form.productId);
  const selectedSummary = summary.find(
    (s) => String(s.productId) === form.productId,
  );
  const currentStock = selectedSummary
    ? Number(selectedSummary.currentStock)
    : 0;
  const requestedQty = Number.parseInt(form.quantity) || 0;
  const stockWarning =
    selectedProduct && requestedQty > 0 && requestedQty > currentStock;

  async function handleSubmit() {
    if (
      !form.productId ||
      !form.quantity ||
      !form.customerName ||
      !form.saleDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (stockWarning) {
      toast.error(`Not enough stock. Only ${currentStock} units available.`);
      return;
    }
    const product = selectedProduct;
    if (!product) return;
    setSaving(true);
    try {
      await onRecord({
        productId: product.id,
        productName: product.name,
        quantity: BigInt(form.quantity),
        customerName: form.customerName,
        saleDate: form.saleDate,
      });
      toast.success("Sale recorded");
      setDialogOpen(false);
      setForm(emptyForm);
    } catch {
      toast.error("Failed to record sale");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5" data-ocid="sales.section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Sales / Outgoing</h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 px-5 rounded-[8px] font-medium"
          data-ocid="sales.record_sale.button"
        >
          <Plus size={16} className="mr-1.5" /> Record Sale
        </Button>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden sm:block rounded-[10px] border border-border bg-card overflow-hidden shadow-card"
        data-ocid="sales.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty Sold</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Sale Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="sales.empty_state"
                >
                  No sales recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale, i) => (
                <TableRow
                  key={String(sale.id)}
                  data-ocid={`sales.item.${i + 1}`}
                >
                  <TableCell className="font-medium">
                    {sale.productName}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-purple-100 text-purple-700 rounded-full px-2.5 text-xs border-0">
                      {String(sale.quantity)} units
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.saleDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {sales.length === 0 ? (
          <div
            className="rounded-[10px] border border-border bg-card p-6 text-center text-sm text-muted-foreground"
            data-ocid="sales.empty_state"
          >
            No sales recorded yet.
          </div>
        ) : (
          sales.map((sale, i) => (
            <div
              key={String(sale.id)}
              className="rounded-[10px] border border-border bg-card p-4"
              data-ocid={`sales.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-sm">{sale.productName}</p>
                <Badge className="bg-purple-100 text-purple-700 rounded-full px-2.5 text-xs border-0">
                  {String(sale.quantity)} sold
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  Customer:{" "}
                  <span className="text-foreground font-medium">
                    {sale.customerName}
                  </span>
                </span>
                <span>{sale.saleDate}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="rounded-[12px] max-w-md"
          data-ocid="sales.dialog"
        >
          <DialogHeader>
            <DialogTitle>Record Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Product *</Label>
              <Select
                value={form.productId}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, productId: v, quantity: "" }))
                }
              >
                <SelectTrigger
                  className="mt-1 h-11 rounded-[8px]"
                  data-ocid="sales.product.select"
                >
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => {
                    const s = summary.find((sm) => sm.productId === prod.id);
                    return (
                      <SelectItem key={String(prod.id)} value={String(prod.id)}>
                        {prod.name} —{" "}
                        {s ? `${String(s.currentStock)} in stock` : "N/A"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <p className="text-xs text-muted-foreground mt-1">
                  Current stock:{" "}
                  <span className="font-semibold text-foreground">
                    {currentStock} units
                  </span>
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Quantity *</Label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quantity: e.target.value }))
                }
                placeholder="1"
                min="1"
                className={`mt-1 h-11 rounded-[8px] ${stockWarning ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                data-ocid="sales.quantity.input"
              />
              {stockWarning && (
                <p
                  className="text-xs text-red-600 mt-1 flex items-center gap-1"
                  data-ocid="sales.stock_warning.error_state"
                >
                  <AlertTriangle size={12} /> Only {currentStock} units
                  available
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Customer Name *</Label>
              <Input
                value={form.customerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerName: e.target.value }))
                }
                placeholder="Marcus Thompson"
                className="mt-1 h-11 rounded-[8px]"
                data-ocid="sales.customer.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Sale Date *</Label>
              <Input
                type="date"
                value={form.saleDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, saleDate: e.target.value }))
                }
                className="mt-1 h-11 rounded-[8px]"
                data-ocid="sales.date.input"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="h-11 rounded-[8px]"
              data-ocid="sales.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !!stockWarning}
              className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 rounded-[8px]"
              data-ocid="sales.submit_button"
            >
              {saving ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : null}
              {saving ? "Recording..." : "Record Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
