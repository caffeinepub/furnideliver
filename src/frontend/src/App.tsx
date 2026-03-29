import { Toaster } from "@/components/ui/sonner";
import {
  ArrowDownCircle,
  BarChart2,
  Box,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  ShoppingCart,
  Table2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAddIncomingStock,
  useCreateDelivery,
  useCreateProduct,
  useDeleteDelivery,
  useDeleteProduct,
  useGetDeliveries,
  useGetIncomingStock,
  useGetInventorySummary,
  useGetProducts,
  useGetSales,
  useRecordSale,
  useUpdateDelivery,
  useUpdateIncomingStockStatus,
  useUpdateProduct,
} from "./hooks/useQueries";
import { Dashboard } from "./pages/Dashboard";
import { DeliveryForm } from "./pages/DeliveryForm";
import { DeliveryList } from "./pages/DeliveryList";
import { IncomingStockPage } from "./pages/inventory/IncomingStockPage";
import { InventoryDashboard } from "./pages/inventory/InventoryDashboard";
import { InventoryTablePage } from "./pages/inventory/InventoryTablePage";
import { OutgoingSalesPage } from "./pages/inventory/OutgoingSalesPage";
import { ProductManagement } from "./pages/inventory/ProductManagement";
import { sampleDeliveries } from "./types/delivery";
import type { Delivery, DeliveryFormData } from "./types/delivery";
import {
  sampleIncomingStock,
  sampleInventorySummary,
  sampleProducts,
  sampleSales,
} from "./types/inventory";
import type {
  IncomingStock,
  InventorySummary,
  Product,
  Sale,
} from "./types/inventory";

type View =
  | "dashboard"
  | "deliveries"
  | "form"
  | "inv-dashboard"
  | "inv-products"
  | "inv-incoming"
  | "inv-sales"
  | "inv-table";

const DELIVERY_NAV = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "deliveries" as View, label: "Deliveries", icon: Package },
  { id: "form" as View, label: "Add Delivery", icon: PlusCircle },
];

const INVENTORY_NAV = [
  { id: "inv-dashboard" as View, label: "Overview", icon: BarChart2 },
  { id: "inv-products" as View, label: "Products", icon: Box },
  { id: "inv-incoming" as View, label: "Incoming", icon: ArrowDownCircle },
  { id: "inv-sales" as View, label: "Sales", icon: ShoppingCart },
  { id: "inv-table" as View, label: "Stock Table", icon: Table2 },
];

const INV_VIEWS: View[] = [
  "inv-dashboard",
  "inv-products",
  "inv-incoming",
  "inv-sales",
  "inv-table",
];

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [localDeliveries, setLocalDeliveries] =
    useState<Delivery[]>(sampleDeliveries);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Inventory local state
  const [localProducts, setLocalProducts] = useState<Product[]>(sampleProducts);
  const [localIncoming, setLocalIncoming] =
    useState<IncomingStock[]>(sampleIncomingStock);
  const [localSales, setLocalSales] = useState<Sale[]>(sampleSales);
  const [localSummary, setLocalSummary] = useState<InventorySummary[]>(
    sampleInventorySummary,
  );

  const { data: backendDeliveries, isLoading } = useGetDeliveries();
  const { data: backendProducts } = useGetProducts();
  const { data: backendIncoming } = useGetIncomingStock();
  const { data: backendSales } = useGetSales();
  const { data: backendSummary } = useGetInventorySummary();

  const createMutation = useCreateDelivery();
  const updateMutation = useUpdateDelivery();
  const deleteMutation = useDeleteDelivery();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const addIncomingMutation = useAddIncomingStock();
  const updateIncomingStatusMutation = useUpdateIncomingStockStatus();
  const recordSaleMutation = useRecordSale();

  useEffect(() => {
    if (backendDeliveries && backendDeliveries.length > 0)
      setLocalDeliveries(backendDeliveries);
  }, [backendDeliveries]);

  useEffect(() => {
    if (backendProducts && backendProducts.length > 0)
      setLocalProducts(backendProducts);
  }, [backendProducts]);

  useEffect(() => {
    if (backendIncoming && backendIncoming.length > 0)
      setLocalIncoming(backendIncoming);
  }, [backendIncoming]);

  useEffect(() => {
    if (backendSales && backendSales.length > 0) setLocalSales(backendSales);
  }, [backendSales]);

  useEffect(() => {
    if (backendSummary && backendSummary.length > 0)
      setLocalSummary(backendSummary);
  }, [backendSummary]);

  const navigate = useCallback((v: View, delivery?: Delivery | null) => {
    setEditingDelivery(delivery ?? null);
    setView(v);
    setSidebarOpen(false);
  }, []);

  const isInventoryView = INV_VIEWS.includes(view);

  // ─── Delivery handlers ────────────────────────────────────────────────────

  async function handleFormSubmit(data: DeliveryFormData) {
    if (editingDelivery) {
      const optimistic: Delivery = { ...editingDelivery, ...data };
      setLocalDeliveries((prev) =>
        prev.map((d) => (d.id === editingDelivery.id ? optimistic : d)),
      );
      navigate("deliveries");
      try {
        await updateMutation.mutateAsync({ id: editingDelivery.id, ...data });
        toast.success("Delivery updated successfully");
      } catch {
        toast.error("Failed to update delivery on backend");
      }
    } else {
      const tempId = BigInt(Date.now());
      const newDelivery: Delivery = {
        id: tempId,
        ...data,
        createdAt: BigInt(Date.now()),
      };
      setLocalDeliveries((prev) => [newDelivery, ...prev]);
      navigate("deliveries");
      try {
        const created = await createMutation.mutateAsync(data);
        setLocalDeliveries((prev) =>
          prev.map((d) => (d.id === tempId ? (created as Delivery) : d)),
        );
        toast.success("Delivery added successfully");
      } catch {
        toast.error("Failed to save delivery to backend");
      }
    }
  }

  async function handleStatusChange(id: bigint, status: string) {
    const delivery = localDeliveries.find((d) => d.id === id);
    if (!delivery) return;
    setLocalDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d)),
    );
    try {
      await updateMutation.mutateAsync({ ...delivery, status });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function handleDelete(id: bigint) {
    setLocalDeliveries((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Delivery deleted");
    } catch {
      toast.error("Failed to delete delivery");
    }
  }

  // ─── Inventory handlers ───────────────────────────────────────────────────

  async function handleCreateProduct(data: Omit<Product, "id">) {
    const tempId = BigInt(Date.now());
    const optimistic: Product = { id: tempId, ...data };
    setLocalProducts((prev) => [...prev, optimistic]);
    try {
      const created = await createProductMutation.mutateAsync(data);
      setLocalProducts((prev) =>
        prev.map((p) => (p.id === tempId ? (created as Product) : p)),
      );
    } catch {
      toast.error("Backend sync failed");
    }
  }

  async function handleUpdateProduct(data: Product) {
    setLocalProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    try {
      await updateProductMutation.mutateAsync(data);
    } catch {
      toast.error("Backend sync failed");
    }
  }

  async function handleDeleteProduct(id: bigint) {
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    setLocalSummary((prev) => prev.filter((s) => s.productId !== id));
    try {
      await deleteProductMutation.mutateAsync(id);
    } catch {
      toast.error("Backend sync failed");
    }
  }

  async function handleAddIncoming(data: Omit<IncomingStock, "id" | "status">) {
    const tempId = BigInt(Date.now());
    const optimistic: IncomingStock = {
      id: tempId,
      status: "Ordered",
      ...data,
    };
    setLocalIncoming((prev) => [...prev, optimistic]);
    // Update summary pending
    setLocalSummary((prev) =>
      prev.map((s) =>
        s.productId === data.productId
          ? { ...s, incomingPending: s.incomingPending + data.quantity }
          : s,
      ),
    );
    try {
      const created = await addIncomingMutation.mutateAsync(data);
      setLocalIncoming((prev) =>
        prev.map((i) => (i.id === tempId ? (created as IncomingStock) : i)),
      );
    } catch {
      toast.error("Backend sync failed");
    }
  }

  async function handleMarkReceived(id: bigint) {
    const entry = localIncoming.find((i) => i.id === id);
    if (!entry) return;
    setLocalIncoming((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Received" } : i)),
    );
    // Update summary: add qty to stock, remove from pending
    setLocalSummary((prev) =>
      prev.map((s) =>
        s.productId === entry.productId
          ? {
              ...s,
              currentStock: s.currentStock + entry.quantity,
              incomingPending:
                s.incomingPending >= entry.quantity
                  ? s.incomingPending - entry.quantity
                  : 0n,
            }
          : s,
      ),
    );
    try {
      await updateIncomingStatusMutation.mutateAsync({
        id,
        status: "Received",
      });
    } catch {
      toast.error("Backend sync failed");
    }
  }

  async function handleRecordSale(data: Omit<Sale, "id">) {
    const tempId = BigInt(Date.now());
    const optimistic: Sale = { id: tempId, ...data };
    setLocalSales((prev) => [optimistic, ...prev]);
    // Update summary: reduce stock, increase sold qty
    setLocalSummary((prev) =>
      prev.map((s) =>
        s.productId === data.productId
          ? {
              ...s,
              currentStock:
                s.currentStock >= data.quantity
                  ? s.currentStock - data.quantity
                  : 0n,
              soldQty: s.soldQty + data.quantity,
            }
          : s,
      ),
    );
    try {
      await recordSaleMutation.mutateAsync(data);
    } catch {
      toast.error("Backend sync failed");
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster richColors position="top-right" />

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#EEE6D6] border-b border-border h-14 flex items-center px-4 sm:px-6">
        <button
          type="button"
          className="sm:hidden mr-3 p-1.5 rounded-md hover:bg-accent transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-ocid="nav.toggle"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#0F4F50] rounded-[6px] flex items-center justify-center">
            <Package size={14} className="text-white" />
          </div>
          <span className="font-bold text-foreground text-[15px] tracking-tight">
            FurniDeliver
          </span>
        </div>

        <nav
          className="hidden sm:flex items-center gap-1 mx-auto"
          data-ocid="nav.panel"
        >
          {DELIVERY_NAV.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`px-3.5 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                view === item.id
                  ? "bg-[#0F4F50] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              data-ocid={`nav.${item.id}.link`}
            >
              {item.label}
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {INVENTORY_NAV.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`px-3.5 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                view === item.id
                  ? "bg-[#0F4F50] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              data-ocid={`nav.${item.id}.link`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto hidden sm:flex items-center gap-2 bg-card border border-border rounded-full pl-1 pr-3 py-1">
          <div className="w-7 h-7 rounded-full bg-[#0F4F50] flex items-center justify-center text-white text-xs font-bold">
            SJ
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-foreground">Sarah Jones</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
          <ChevronDown size={12} className="text-muted-foreground" />
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Desktop Sidebar */}
        <aside className="hidden sm:flex flex-col w-52 fixed top-14 bottom-0 bg-[#EEE6D6] border-r border-border py-5 px-3">
          <nav className="space-y-1" data-ocid="sidebar.panel">
            <p className="text-[10px] text-muted-foreground px-3 mb-1 uppercase tracking-wider">
              Delivery
            </p>
            {DELIVERY_NAV.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors text-left ${
                  view === item.id
                    ? "bg-[#0F4F50] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-ocid={`sidebar.${item.id}.link`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}

            <div className="pt-3">
              <p className="text-[10px] text-muted-foreground px-3 mb-1 uppercase tracking-wider">
                Inventory
              </p>
              {INVENTORY_NAV.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors text-left ${
                    view === item.id
                      ? "bg-[#0F4F50] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  data-ocid={`sidebar.${item.id}.link`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-auto">
            <p className="text-[10px] text-muted-foreground px-3 mb-1 uppercase tracking-wider">
              Quick Stats
            </p>
            <div className="px-3 py-2 rounded-[8px] bg-card border border-border">
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
              <p className="text-lg font-bold text-foreground">
                {localDeliveries.length}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sm:hidden fixed inset-0 z-30 bg-black/30"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="sm:hidden fixed top-14 bottom-16 left-0 z-40 w-56 bg-[#EEE6D6] border-r border-border py-4 px-3 overflow-y-auto"
              >
                <nav className="space-y-1">
                  <p className="text-[10px] text-muted-foreground px-3 mb-1 uppercase tracking-wider">
                    Delivery
                  </p>
                  {DELIVERY_NAV.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-[8px] text-sm font-medium transition-colors text-left ${
                        view === item.id
                          ? "bg-[#0F4F50] text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      data-ocid={`sidebar.mobile.${item.id}.link`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-2">
                    <p className="text-[10px] text-muted-foreground px-3 mb-1 uppercase tracking-wider">
                      Inventory
                    </p>
                    {INVENTORY_NAV.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => navigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-[8px] text-sm font-medium transition-colors text-left ${
                          view === item.id
                            ? "bg-[#0F4F50] text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        data-ocid={`sidebar.mobile.${item.id}.link`}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 sm:ml-52 min-h-[calc(100vh-3.5rem)] flex flex-col">
          {/* Inventory sub-nav on mobile */}
          {isInventoryView && (
            <div className="sm:hidden flex gap-1 overflow-x-auto px-4 pt-3 pb-1 bg-background border-b border-border">
              {INVENTORY_NAV.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    view === item.id
                      ? "bg-[#0F4F50] text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`inv.mobile.${item.id}.tab`}
                >
                  <item.icon size={12} />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 px-4 sm:px-8 py-6 max-w-5xl w-full mx-auto">
            <AnimatePresence mode="wait">
              {view === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Dashboard
                    deliveries={localDeliveries}
                    isLoading={isLoading}
                    onAddDelivery={() => navigate("form")}
                    onEditDelivery={(d) => navigate("form", d)}
                    onNavigateToDeliveries={() => navigate("deliveries")}
                  />
                </motion.div>
              )}
              {view === "deliveries" && (
                <motion.div
                  key="deliveries"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <DeliveryList
                    deliveries={localDeliveries}
                    isLoading={isLoading}
                    onAddDelivery={() => navigate("form")}
                    onEditDelivery={(d) => navigate("form", d)}
                    onDeleteDelivery={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                </motion.div>
              )}
              {view === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <DeliveryForm
                    editingDelivery={editingDelivery}
                    isSaving={isSaving}
                    onSubmit={handleFormSubmit}
                    onBack={() => navigate("deliveries")}
                  />
                </motion.div>
              )}
              {view === "inv-dashboard" && (
                <motion.div
                  key="inv-dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <InventoryDashboard
                    summary={localSummary}
                    onNavigateToProducts={() => navigate("inv-products")}
                  />
                </motion.div>
              )}
              {view === "inv-products" && (
                <motion.div
                  key="inv-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ProductManagement
                    products={localProducts}
                    onCreate={handleCreateProduct}
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                  />
                </motion.div>
              )}
              {view === "inv-incoming" && (
                <motion.div
                  key="inv-incoming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <IncomingStockPage
                    incomingStock={localIncoming}
                    products={localProducts}
                    onAdd={handleAddIncoming}
                    onMarkReceived={handleMarkReceived}
                  />
                </motion.div>
              )}
              {view === "inv-sales" && (
                <motion.div
                  key="inv-sales"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <OutgoingSalesPage
                    sales={localSales}
                    products={localProducts}
                    summary={localSummary}
                    onRecord={handleRecordSale}
                  />
                </motion.div>
              )}
              {view === "inv-table" && (
                <motion.div
                  key="inv-table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <InventoryTablePage summary={localSummary} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="bg-footer mt-auto">
            <div className="px-4 sm:px-8 py-4 text-center">
              <p className="text-sm text-footer-foreground">
                © {new Date().getFullYear()}. Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-80 font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Nav — 4 tabs */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#EEE6D6] border-t border-border flex"
        data-ocid="mobile.nav.panel"
      >
        {DELIVERY_NAV.slice(0, 2).map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
              view === item.id ? "text-[#0F4F50]" : "text-muted-foreground"
            }`}
            data-ocid={`mobile.nav.${item.id}.link`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate("form")}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
            view === "form" ? "text-[#0F4F50]" : "text-muted-foreground"
          }`}
          data-ocid="mobile.nav.form.link"
        >
          <PlusCircle size={18} />
          Add
        </button>
        <button
          type="button"
          onClick={() => navigate("inv-dashboard")}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
            isInventoryView ? "text-[#0F4F50]" : "text-muted-foreground"
          }`}
          data-ocid="mobile.nav.inventory.link"
        >
          <BarChart2 size={18} />
          Inventory
        </button>
      </nav>

      <div className="sm:hidden h-16" />
    </div>
  );
}
