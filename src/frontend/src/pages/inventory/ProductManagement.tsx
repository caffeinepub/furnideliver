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
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "../../types/inventory";
import type { Product } from "../../types/inventory";

interface ProductManagementProps {
  products: Product[];
  onCreate: (data: Omit<Product, "id">) => Promise<void>;
  onUpdate: (data: Product) => Promise<void>;
  onDelete: (id: bigint) => Promise<void>;
}

const emptyForm = {
  name: "",
  code: "",
  category: "Sofa",
  costPrice: "",
  sellingPrice: "",
  lowStockThreshold: "5",
};

export function ProductManagement({
  products,
  onCreate,
  onUpdate,
  onDelete,
}: ProductManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  function openAdd() {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      code: product.code,
      category: product.category,
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice),
      lowStockThreshold: String(product.lowStockThreshold),
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name || !form.code || !form.costPrice || !form.sellingPrice) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: form.name,
        code: form.code,
        category: form.category,
        costPrice: Number.parseFloat(form.costPrice),
        sellingPrice: Number.parseFloat(form.sellingPrice),
        lowStockThreshold: BigInt(form.lowStockThreshold || "5"),
      };
      if (editingProduct) {
        await onUpdate({ ...data, id: editingProduct.id });
        toast.success("Product updated");
      } else {
        await onCreate(data);
        toast.success("Product added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: bigint) {
    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5" data-ocid="products.section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Products</h2>
        <Button
          onClick={openAdd}
          className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 px-5 rounded-[8px] font-medium"
          data-ocid="products.add_product.button"
        >
          <Plus size={16} className="mr-1.5" /> Add Product
        </Button>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden sm:block rounded-[10px] border border-border bg-card overflow-hidden shadow-card"
        data-ocid="products.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Low Stock At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="products.empty_state"
                >
                  No products yet. Add your first product.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, i) => (
                <TableRow
                  key={String(product.id)}
                  data-ocid={`products.item.${i + 1}`}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {product.code}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    RM {product.costPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-[#0F4F50]">
                    RM {product.sellingPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {String(product.lowStockThreshold)} units
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(product)}
                        className="h-8 px-3 rounded-[6px]"
                        data-ocid={`products.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="h-8 px-3 rounded-[6px] text-red-600 border-red-200 hover:bg-red-50"
                        data-ocid={`products.delete_button.${i + 1}`}
                      >
                        {deletingId === product.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {products.length === 0 ? (
          <div
            className="rounded-[10px] border border-border bg-card p-6 text-center text-sm text-muted-foreground"
            data-ocid="products.empty_state"
          >
            No products yet.
          </div>
        ) : (
          products.map((product, i) => (
            <div
              key={String(product.id)}
              className="rounded-[10px] border border-border bg-card p-4"
              data-ocid={`products.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {product.code} · {product.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(product)}
                    className="h-8 w-8 p-0 rounded-[6px]"
                    data-ocid={`products.edit_button.${i + 1}`}
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="h-8 w-8 p-0 rounded-[6px] text-red-600 border-red-200 hover:bg-red-50"
                    data-ocid={`products.delete_button.${i + 1}`}
                  >
                    {deletingId === product.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Cost</p>
                  <p className="font-medium">
                    RM {product.costPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium text-[#0F4F50]">
                    RM {product.sellingPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Low Stock At</p>
                  <p className="font-medium">
                    {String(product.lowStockThreshold)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="rounded-[12px] max-w-md"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. 3-Seater Leather Sofa"
                className="mt-1 h-11 rounded-[8px]"
                data-ocid="products.name.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Product Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, code: e.target.value }))
                  }
                  placeholder="SOFA-001"
                  className="mt-1 h-11 rounded-[8px] font-mono"
                  data-ocid="products.code.input"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger
                    className="mt-1 h-11 rounded-[8px]"
                    data-ocid="products.category.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Cost Price (RM) *</Label>
                <Input
                  type="number"
                  value={form.costPrice}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, costPrice: e.target.value }))
                  }
                  placeholder="1200"
                  className="mt-1 h-11 rounded-[8px]"
                  data-ocid="products.cost_price.input"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Selling Price (RM) *
                </Label>
                <Input
                  type="number"
                  value={form.sellingPrice}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sellingPrice: e.target.value }))
                  }
                  placeholder="1800"
                  className="mt-1 h-11 rounded-[8px]"
                  data-ocid="products.selling_price.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">
                Low Stock Threshold (units)
              </Label>
              <Input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lowStockThreshold: e.target.value }))
                }
                placeholder="5"
                className="mt-1 h-11 rounded-[8px]"
                data-ocid="products.low_stock_threshold.input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Alert when stock falls at or below this number
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="h-11 rounded-[8px]"
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 rounded-[8px]"
              data-ocid="products.save_button"
            >
              {saving ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : null}
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
