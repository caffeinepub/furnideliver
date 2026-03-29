import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";
import {
  CATEGORIES,
  STOCK_STATUSES,
  getStockStatus,
} from "../../types/inventory";
import type { InventorySummary } from "../../types/inventory";

interface InventoryTablePageProps {
  summary: InventorySummary[];
}

export function InventoryTablePage({ summary }: InventoryTablePageProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = summary.filter((item) => {
    const status = getStockStatus(item.currentStock, item.lowStockThreshold);
    const matchCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchStatus = statusFilter === "all" || status === statusFilter;
    return matchCategory && matchStatus;
  });

  function statusBadge(currentStock: bigint, threshold: bigint) {
    const status = getStockStatus(currentStock, threshold);
    if (status === "Out of Stock")
      return (
        <Badge className="bg-red-100 text-red-700 rounded-full px-2.5 text-xs border-0">
          Out of Stock
        </Badge>
      );
    if (status === "Low Stock")
      return (
        <Badge className="bg-amber-100 text-amber-700 rounded-full px-2.5 text-xs border-0">
          Low Stock
        </Badge>
      );
    return (
      <Badge className="bg-green-100 text-green-700 rounded-full px-2.5 text-xs border-0">
        In Stock
      </Badge>
    );
  }

  function rowClass(currentStock: bigint, threshold: bigint) {
    const status = getStockStatus(currentStock, threshold);
    if (status === "Out of Stock") return "bg-red-50/60";
    if (status === "Low Stock") return "bg-amber-50/60";
    return "";
  }

  return (
    <div className="space-y-5" data-ocid="inv_table.section">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h2 className="text-lg font-bold text-foreground">Stock Table</h2>
        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              className="h-10 w-36 rounded-[8px] text-sm"
              data-ocid="inv_table.category.select"
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="h-10 w-36 rounded-[8px] text-sm"
              data-ocid="inv_table.status.select"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STOCK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden sm:block rounded-[10px] border border-border bg-card overflow-hidden shadow-card"
        data-ocid="inv_table.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Incoming</TableHead>
              <TableHead className="text-right">Sold Qty</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="inv_table.empty_state"
                >
                  No products match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, i) => (
                <TableRow
                  key={String(item.productId)}
                  className={rowClass(
                    item.currentStock,
                    item.lowStockThreshold,
                  )}
                  data-ocid={`inv_table.item.${i + 1}`}
                >
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.productCode}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right font-bold">
                    {String(item.currentStock)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600 font-medium">
                    {String(item.incomingPending)}
                  </TableCell>
                  <TableCell className="text-right text-purple-600 font-medium">
                    {String(item.soldQty)}
                  </TableCell>
                  <TableCell>
                    {statusBadge(item.currentStock, item.lowStockThreshold)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {filtered.length === 0 ? (
          <div
            className="rounded-[10px] border border-border bg-card p-6 text-center text-sm text-muted-foreground"
            data-ocid="inv_table.empty_state"
          >
            No products match filters.
          </div>
        ) : (
          filtered.map((item, i) => {
            const statusClass =
              getStockStatus(item.currentStock, item.lowStockThreshold) ===
              "Out of Stock"
                ? "border-red-200 bg-red-50"
                : getStockStatus(item.currentStock, item.lowStockThreshold) ===
                    "Low Stock"
                  ? "border-amber-200 bg-amber-50"
                  : "border-border bg-card";
            return (
              <div
                key={String(item.productId)}
                className={`rounded-[10px] border p-4 ${statusClass}`}
                data-ocid={`inv_table.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {item.productCode} · {item.category}
                    </p>
                  </div>
                  {statusBadge(item.currentStock, item.lowStockThreshold)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">In Stock</p>
                    <p className="font-bold text-base">
                      {String(item.currentStock)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Incoming</p>
                    <p className="font-bold text-base text-blue-600">
                      {String(item.incomingPending)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sold</p>
                    <p className="font-bold text-base text-purple-600">
                      {String(item.soldQty)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
