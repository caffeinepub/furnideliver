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
import { CheckCircle, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { IncomingStock, Product } from "../../types/inventory";

interface IncomingStockPageProps {
  incomingStock: IncomingStock[];
  products: Product[];
  onAdd: (data: Omit<IncomingStock, "id" | "status">) => Promise<void>;
  onMarkReceived: (id: bigint) => Promise<void>;
}

const emptyForm = {
  productId: "",
  quantity: "",
  supplierName: "",
  expectedDate: new Date().toISOString().split("T")[0],
};

export function IncomingStockPage({
  incomingStock,
  products,
  onAdd,
  onMarkReceived,
}: IncomingStockPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [receivingId, setReceivingId] = useState<bigint | null>(null);

  async function handleSubmit() {
    if (
      !form.productId ||
      !form.quantity ||
      !form.supplierName ||
      !form.expectedDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    const product = products.find((p) => String(p.id) === form.productId);
    if (!product) return;
    setSaving(true);
    try {
      await onAdd({
        productId: product.id,
        productName: product.name,
        quantity: BigInt(form.quantity),
        supplierName: form.supplierName,
        expectedDate: form.expectedDate,
      });
      toast.success("Incoming stock added");
      setDialogOpen(false);
      setForm(emptyForm);
    } catch {
      toast.error("Failed to add incoming stock");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkReceived(id: bigint) {
    setReceivingId(id);
    try {
      await onMarkReceived(id);
      toast.success("Marked as Received");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setReceivingId(null);
    }
  }

  return (
    <div className="space-y-5" data-ocid="incoming.section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Incoming Stock</h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 px-5 rounded-[8px] font-medium"
          data-ocid="incoming.add_button"
        >
          <Plus size={16} className="mr-1.5" /> Add Incoming
        </Button>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden sm:block rounded-[10px] border border-border bg-card overflow-hidden shadow-card"
        data-ocid="incoming.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expected Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomingStock.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="incoming.empty_state"
                >
                  No incoming stock entries yet.
                </TableCell>
              </TableRow>
            ) : (
              incomingStock.map((item, i) => (
                <TableRow
                  key={String(item.id)}
                  data-ocid={`incoming.item.${i + 1}`}
                >
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {String(item.quantity)}
                  </TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{item.expectedDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 ${
                        item.status === "Received"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === "Ordered" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkReceived(item.id)}
                        disabled={receivingId === item.id}
                        className="h-8 px-3 rounded-[6px] text-green-700 border-green-300 hover:bg-green-50"
                        data-ocid={`incoming.mark_received.button.${i + 1}`}
                      >
                        {receivingId === item.id ? (
                          <Loader2 size={13} className="animate-spin mr-1" />
                        ) : (
                          <CheckCircle size={13} className="mr-1" />
                        )}
                        Received
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {incomingStock.length === 0 ? (
          <div
            className="rounded-[10px] border border-border bg-card p-6 text-center text-sm text-muted-foreground"
            data-ocid="incoming.empty_state"
          >
            No incoming stock entries yet.
          </div>
        ) : (
          incomingStock.map((item, i) => (
            <div
              key={String(item.id)}
              className="rounded-[10px] border border-border bg-card p-4"
              data-ocid={`incoming.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.supplierName}
                  </p>
                </div>
                <Badge
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 ${
                    item.status === "Received"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs">
                  <span>
                    <span className="text-muted-foreground">Qty: </span>
                    <span className="font-bold">{String(item.quantity)}</span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">Expected: </span>
                    {item.expectedDate}
                  </span>
                </div>
                {item.status === "Ordered" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkReceived(item.id)}
                    disabled={receivingId === item.id}
                    className="h-8 px-3 rounded-[6px] text-green-700 border-green-300 hover:bg-green-50 text-xs"
                    data-ocid={`incoming.mark_received.button.${i + 1}`}
                  >
                    {receivingId === item.id ? (
                      <Loader2 size={12} className="animate-spin mr-1" />
                    ) : (
                      <CheckCircle size={12} className="mr-1" />
                    )}
                    Mark Received
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="rounded-[12px] max-w-md"
          data-ocid="incoming.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Incoming Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Product *</Label>
              <Select
                value={form.productId}
                onValueChange={(v) => setForm((p) => ({ ...p, productId: v }))}
              >
                <SelectTrigger
                  className="mt-1 h-11 rounded-[8px]"
                  data-ocid="incoming.product.select"
                >
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => (
                    <SelectItem key={String(prod.id)} value={String(prod.id)}>
                      {prod.name} ({prod.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Quantity *</Label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  placeholder="10"
                  className="mt-1 h-11 rounded-[8px]"
                  data-ocid="incoming.quantity.input"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Expected Date *</Label>
                <Input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, expectedDate: e.target.value }))
                  }
                  className="mt-1 h-11 rounded-[8px]"
                  data-ocid="incoming.expected_date.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Supplier Name *</Label>
              <Input
                value={form.supplierName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, supplierName: e.target.value }))
                }
                placeholder="Kota Furniture Co."
                className="mt-1 h-11 rounded-[8px]"
                data-ocid="incoming.supplier.input"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="h-11 rounded-[8px]"
              data-ocid="incoming.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 rounded-[8px]"
              data-ocid="incoming.submit_button"
            >
              {saving ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : null}
              {saving ? "Adding..." : "Add Incoming"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
