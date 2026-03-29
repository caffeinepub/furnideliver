import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowDownCircle,
  BarChart2,
  Package,
  ShoppingCart,
} from "lucide-react";
import { getStockStatus } from "../../types/inventory";
import type { InventorySummary } from "../../types/inventory";

interface InventoryDashboardProps {
  summary: InventorySummary[];
  onNavigateToProducts: () => void;
}

export function InventoryDashboard({
  summary,
  onNavigateToProducts,
}: InventoryDashboardProps) {
  const totalStock = summary.reduce(
    (sum, s) => sum + Number(s.currentStock),
    0,
  );
  const lowStockItems = summary.filter((s) => {
    const status = getStockStatus(s.currentStock, s.lowStockThreshold);
    return status === "Low Stock" || status === "Out of Stock";
  });
  const incomingCount = summary.reduce(
    (sum, s) => sum + Number(s.incomingPending),
    0,
  );
  const soldCount = summary.reduce((sum, s) => sum + Number(s.soldQty), 0);

  const stats = [
    {
      label: "Total Items in Stock",
      value: totalStock,
      icon: Package,
      color: "#0F4F50",
    },
    {
      label: "Low Stock Alerts",
      value: lowStockItems.length,
      icon: AlertTriangle,
      color: "#D97706",
    },
    {
      label: "Incoming Stock",
      value: incomingCount,
      icon: ArrowDownCircle,
      color: "#2563EB",
    },
    {
      label: "Sold Items",
      value: soldCount,
      icon: ShoppingCart,
      color: "#7C3AED",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="inv_dashboard.section">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart2 size={20} className="text-[#0F4F50]" />
            Inventory Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track stock levels, incoming, and sales
          </p>
        </div>
        <Button
          onClick={onNavigateToProducts}
          className="bg-[#0F4F50] hover:bg-[#0d3e3f] text-white h-11 px-5 rounded-[8px] font-medium"
          data-ocid="inv_dashboard.add_product.button"
        >
          + Add Product
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className="rounded-[10px] border-border shadow-card"
            data-ocid={`inv_dashboard.stat.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-[8px] flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}18` }}
                >
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alerts */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-amber-600" />
          Low Stock &amp; Out of Stock Alerts
          {lowStockItems.length > 0 && (
            <span className="ml-1 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {lowStockItems.length}
            </span>
          )}
        </h2>

        {lowStockItems.length === 0 ? (
          <div
            className="rounded-[10px] border border-border bg-card p-6 text-center"
            data-ocid="inv_dashboard.alerts.empty_state"
          >
            <Package size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              All products are well-stocked!
            </p>
          </div>
        ) : (
          <div className="space-y-2" data-ocid="inv_dashboard.alerts.list">
            {lowStockItems.map((item, i) => {
              const status = getStockStatus(
                item.currentStock,
                item.lowStockThreshold,
              );
              return (
                <div
                  key={String(item.productId)}
                  className={`flex items-center justify-between p-3 rounded-[10px] border ${
                    status === "Out of Stock"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                  data-ocid={`inv_dashboard.alert.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-[6px] flex items-center justify-center ${
                        status === "Out of Stock"
                          ? "bg-red-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <Package
                        size={14}
                        className={
                          status === "Out of Stock"
                            ? "text-red-600"
                            : "text-amber-600"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.productCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground">
                      {String(item.currentStock)} units
                    </span>
                    <Badge
                      className={`text-xs rounded-full px-2.5 py-0.5 font-medium border-0 ${
                        status === "Out of Stock"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
