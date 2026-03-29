import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { StatusPill } from "../components/StatusPill";
import { STATUSES } from "../types/delivery";
import type { Delivery } from "../types/delivery";

interface DeliveryListProps {
  deliveries: Delivery[];
  isLoading: boolean;
  onAddDelivery: () => void;
  onEditDelivery: (d: Delivery) => void;
  onDeleteDelivery: (id: bigint) => void;
  onStatusChange: (id: bigint, status: string) => void;
}

const SKELETON_ROWS = ["sk-r-1", "sk-r-2", "sk-r-3", "sk-r-4"];
const SKELETON_COLS = [
  "sk-c-1",
  "sk-c-2",
  "sk-c-3",
  "sk-c-4",
  "sk-c-5",
  "sk-c-6",
];
const SKELETON_MOBILE = ["sk-m-1", "sk-m-2", "sk-m-3"];

export function DeliveryList({
  deliveries,
  isLoading,
  onAddDelivery,
  onEditDelivery,
  onDeleteDelivery,
  onStatusChange,
}: DeliveryListProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || d.customerName.toLowerCase().includes(q) || d.phone.includes(q);
      const matchStatus = filterStatus === "all" || d.status === filterStatus;
      const matchDate = !filterDate || d.deliveryDate === filterDate;
      return matchSearch && matchStatus && matchDate;
    });
  }, [deliveries, search, filterStatus, filterDate]);

  function buildWhatsAppUrl(d: Delivery) {
    const msg = `Hi ${d.customerName}, your ${d.productName} delivery is ${d.status}. Thank you!`;
    return `https://wa.me/${d.phone}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="animate-fade-in" data-ocid="deliveries.page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Deliveries</h1>
        <Button
          onClick={onAddDelivery}
          className="bg-[#0F4F50] hover:bg-[#0a3a3b] text-white rounded-[10px] h-11 px-5 flex items-center gap-2"
          data-ocid="deliveries.primary_button"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Delivery</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-[10px] shadow-card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search customer or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-background border-border rounded-[8px]"
              data-ocid="deliveries.search_input"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              className="w-full sm:w-44 h-11 rounded-[8px]"
              data-ocid="deliveries.select"
            >
              <Filter size={14} className="mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-44 h-11 rounded-[8px] bg-background border-border"
            data-ocid="deliveries.input"
          />
        </div>
        {(search || filterStatus !== "all" || filterDate) && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
                setFilterDate("");
              }}
              className="text-xs text-[#0F4F50] hover:underline"
              data-ocid="deliveries.secondary_button"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div
        className="bg-card border border-border rounded-[10px] shadow-card hidden sm:block overflow-x-auto"
        data-ocid="deliveries.table"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Customer
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Product
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Driver
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? SKELETON_ROWS.map((rowKey) => (
                  <tr key={rowKey} className="border-b border-border">
                    {SKELETON_COLS.map((colKey) => (
                      <td key={colKey} className="px-5 py-3.5">
                        <div className="h-4 bg-muted animate-pulse rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.map((d, idx) => (
                  <motion.tr
                    key={String(d.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    data-ocid={`deliveries.row.item.${idx + 1}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">
                        {d.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">{d.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      {d.productName}
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      {d.driverName}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      {d.deliveryDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <Select
                        value={d.status}
                        onValueChange={(val) => onStatusChange(d.id, val)}
                      >
                        <SelectTrigger
                          className="w-40 h-8 text-xs border-0 p-0 shadow-none focus:ring-0"
                          data-ocid={`deliveries.select.${idx + 1}`}
                        >
                          <StatusPill status={d.status} size="sm" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEditDelivery(d)}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                          data-ocid={`deliveries.edit_button.${idx + 1}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <a
                          href={buildWhatsAppUrl(d)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-[#B9E0C0]/40 transition-colors text-[#25D366] hover:text-[#128C7E]"
                          title="WhatsApp customer"
                          data-ocid={`deliveries.secondary_button.${idx + 1}`}
                        >
                          <MessageCircle size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => onDeleteDelivery(d.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          title="Delete"
                          data-ocid={`deliveries.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="deliveries.empty_state"
          >
            <Package size={32} className="mx-auto mb-2 opacity-40" />
            No deliveries match your filters.
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-3">
        {isLoading
          ? SKELETON_MOBILE.map((key) => (
              <div
                key={key}
                className="bg-card border border-border rounded-[10px] p-4"
              >
                <div className="h-4 bg-muted animate-pulse rounded w-32 mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-24" />
              </div>
            ))
          : filtered.map((d, idx) => (
              <motion.div
                key={String(d.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-[10px] shadow-card p-4"
                data-ocid={`deliveries.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {d.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.phone}</p>
                  </div>
                  <StatusPill status={d.status} size="sm" />
                </div>
                <p className="text-sm text-foreground mb-1">{d.productName}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  {d.deliveryDate} · {d.driverName}
                </p>

                <Select
                  value={d.status}
                  onValueChange={(val) => onStatusChange(d.id, val)}
                >
                  <SelectTrigger
                    className="w-full h-10 rounded-[8px] text-sm mb-3"
                    data-ocid={`deliveries.select.${idx + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditDelivery(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-[8px] bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                    data-ocid={`deliveries.edit_button.${idx + 1}`}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <a
                    href={buildWhatsAppUrl(d)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-[8px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-sm font-medium text-[#128C7E] transition-colors"
                    data-ocid={`deliveries.secondary_button.${idx + 1}`}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => onDeleteDelivery(d.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-[8px] hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    data-ocid={`deliveries.delete_button.${idx + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
        {!isLoading && filtered.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="deliveries.empty_state"
          >
            No deliveries match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
