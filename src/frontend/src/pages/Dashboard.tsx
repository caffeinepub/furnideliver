import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Package, Plus, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { StatusPill } from "../components/StatusPill";
import type { Delivery } from "../types/delivery";

interface DashboardProps {
  deliveries: Delivery[];
  isLoading: boolean;
  onAddDelivery: () => void;
  onEditDelivery: (d: Delivery) => void;
  onNavigateToDeliveries: () => void;
}

const SKELETON_ROWS = ["sk-r-1", "sk-r-2", "sk-r-3"];
const SKELETON_COLS = ["sk-c-1", "sk-c-2", "sk-c-3", "sk-c-4", "sk-c-5"];

export function Dashboard({
  deliveries,
  isLoading,
  onAddDelivery,
  onEditDelivery,
  onNavigateToDeliveries,
}: DashboardProps) {
  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    const todayDeliveries = deliveries.filter((d) => d.deliveryDate === today);
    return {
      totalToday: todayDeliveries.length,
      pending: deliveries.filter((d) => d.status === "Pending").length,
      outForDelivery: deliveries.filter((d) => d.status === "Out for Delivery")
        .length,
      delivered: deliveries.filter((d) => d.status === "Delivered").length,
    };
  }, [deliveries, today]);

  const recentDeliveries = useMemo(
    () =>
      [...deliveries]
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 5),
    [deliveries],
  );

  const kpiCards = [
    {
      label: "Total Today",
      value: stats.totalToday,
      icon: Package,
      color: "text-[#0F4F50]",
      bg: "bg-[#0F4F50]/10",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-[#4a3a0a]",
      bg: "bg-[#F6D77A]/40",
    },
    {
      label: "Out for Delivery",
      value: stats.outForDelivery,
      icon: Truck,
      color: "text-[#4a2a0a]",
      bg: "bg-[#E7B27A]/40",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      color: "text-[#0a3a1a]",
      bg: "bg-[#B9E0C0]/40",
    },
  ];

  return (
    <div className="animate-fade-in" data-ocid="dashboard.page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Delivery Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-MY", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button
          onClick={onAddDelivery}
          className="bg-[#0F4F50] hover:bg-[#0a3a3b] text-white rounded-[10px] h-11 px-5 hidden sm:flex items-center gap-2"
          data-ocid="dashboard.primary_button"
        >
          <Plus size={16} />
          Add Delivery
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="bg-card rounded-[10px] border border-border shadow-card p-5"
            data-ocid="dashboard.card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}
              >
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            {isLoading ? (
              <div className="h-9 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-[32px] font-bold text-foreground leading-none">
                {card.value}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Deliveries */}
      <div
        className="bg-card rounded-[10px] border border-border shadow-card"
        data-ocid="dashboard.table"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Deliveries</h2>
          <button
            type="button"
            onClick={onNavigateToDeliveries}
            className="text-sm text-[#0F4F50] hover:underline font-medium"
            data-ocid="dashboard.link"
          >
            View all
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
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
                <th className="px-5 py-3" />
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
                : recentDeliveries.map((d, idx) => (
                    <tr
                      key={String(d.id)}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid={`dashboard.row.item.${idx + 1}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">
                          {d.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.phone}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-foreground">
                        {d.productName}
                      </td>
                      <td className="px-5 py-3.5 text-foreground">
                        {d.driverName}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {d.deliveryDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={d.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => onEditDelivery(d)}
                          className="text-xs text-[#0F4F50] hover:underline font-medium"
                          data-ocid={`dashboard.edit_button.${idx + 1}`}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && recentDeliveries.length === 0 && (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="dashboard.empty_state"
            >
              No deliveries yet. Add your first delivery!
            </div>
          )}
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-border">
          {isLoading
            ? SKELETON_ROWS.map((key) => (
                <div key={key} className="p-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-32 mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-20" />
                </div>
              ))
            : recentDeliveries.map((d, idx) => (
                <div
                  key={String(d.id)}
                  className="p-4"
                  data-ocid={`dashboard.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {d.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.productName}
                      </p>
                    </div>
                    <StatusPill status={d.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {d.deliveryDate} · {d.driverName}
                    </p>
                    <button
                      type="button"
                      onClick={() => onEditDelivery(d)}
                      className="text-xs text-[#0F4F50] font-medium"
                      data-ocid={`dashboard.edit_button.${idx + 1}`}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
          {!isLoading && recentDeliveries.length === 0 && (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="dashboard.empty_state"
            >
              No deliveries yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
