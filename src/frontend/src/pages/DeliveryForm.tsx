import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { STATUSES } from "../types/delivery";
import type { Delivery, DeliveryFormData } from "../types/delivery";

const PRODUCTS = [
  "Sofa",
  "3-Seater Leather Sofa",
  "L-Shaped Sofa",
  "Bed Frame",
  "Queen Bed Frame & Mattress",
  "King Bed Frame & Mattress",
  "Dining Table Set",
  "8-Seat Dining Table Set",
  "Coffee Table",
  "TV Cabinet",
  "TV Cabinet & Bookshelf",
  "Wardrobe",
  "Study Desk",
  "Office Chair",
  "Bookshelf",
  "Other",
];

const DRIVERS = ["Ali Hassan", "Raju Selvam", "Farid Othman", "Siva Kumar"];

interface DeliveryFormProps {
  editingDelivery?: Delivery | null;
  isSaving: boolean;
  onSubmit: (data: DeliveryFormData) => void;
  onBack: () => void;
}

export function DeliveryForm({
  editingDelivery,
  isSaving,
  onSubmit,
  onBack,
}: DeliveryFormProps) {
  const isEdit = !!editingDelivery;

  const [form, setForm] = useState<DeliveryFormData>({
    customerName: "",
    phone: "",
    address: "",
    productName: "",
    deliveryDate: new Date().toISOString().split("T")[0],
    driverName: "",
    notes: "",
    status: "Pending",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryFormData, string>>
  >({});

  useEffect(() => {
    if (editingDelivery) {
      setForm({
        customerName: editingDelivery.customerName,
        phone: editingDelivery.phone,
        address: editingDelivery.address,
        productName: editingDelivery.productName,
        deliveryDate: editingDelivery.deliveryDate,
        driverName: editingDelivery.driverName,
        notes: editingDelivery.notes,
        status: editingDelivery.status as
          | "Pending"
          | "Out for Delivery"
          | "Delivered",
      });
    }
  }, [editingDelivery]);

  function validate(): boolean {
    const errs: Partial<Record<keyof DeliveryFormData, string>> = {};
    if (!form.customerName.trim()) errs.customerName = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.productName) errs.productName = "Required";
    if (!form.deliveryDate) errs.deliveryDate = "Required";
    if (!form.driverName) errs.driverName = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  function field(key: keyof DeliveryFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      data-ocid="delivery_form.page"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-[8px] hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          data-ocid="delivery_form.secondary_button"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Edit Delivery" : "Add New Delivery"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate data-ocid="delivery_form.panel">
        <div className="bg-card border border-border rounded-[10px] shadow-card p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  Customer Name *
                </Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) => field("customerName", e.target.value)}
                  placeholder="e.g. Ahmad bin Ali"
                  className="h-11 rounded-[8px]"
                  data-ocid="delivery_form.input"
                />
                {errors.customerName && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="delivery_form.error_state"
                  >
                    {errors.customerName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => field("phone", e.target.value)}
                  placeholder="e.g. 601234567890"
                  className="h-11 rounded-[8px]"
                  data-ocid="delivery_form.input"
                />
                {errors.phone && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="delivery_form.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium">
                Delivery Address *
              </Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => field("address", e.target.value)}
                placeholder="Full delivery address..."
                rows={2}
                className="rounded-[8px] resize-none"
                data-ocid="delivery_form.textarea"
              />
              {errors.address && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="delivery_form.error_state"
                >
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Delivery Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Delivery Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Product *</Label>
                <Select
                  value={form.productName}
                  onValueChange={(v) => field("productName", v)}
                >
                  <SelectTrigger
                    className="h-11 rounded-[8px]"
                    data-ocid="delivery_form.select"
                  >
                    <SelectValue placeholder="Select product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productName && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="delivery_form.error_state"
                  >
                    {errors.productName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deliveryDate" className="text-sm font-medium">
                  Delivery Date *
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => field("deliveryDate", e.target.value)}
                  className="h-11 rounded-[8px]"
                  data-ocid="delivery_form.input"
                />
                {errors.deliveryDate && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="delivery_form.error_state"
                  >
                    {errors.deliveryDate}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Assigned Driver *</Label>
                <Select
                  value={form.driverName}
                  onValueChange={(v) => field("driverName", v)}
                >
                  <SelectTrigger
                    className="h-11 rounded-[8px]"
                    data-ocid="delivery_form.select"
                  >
                    <SelectValue placeholder="Select driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVERS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.driverName && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="delivery_form.error_state"
                  >
                    {errors.driverName}
                  </p>
                )}
              </div>
              {isEdit && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => field("status", v)}
                  >
                    <SelectTrigger
                      className="h-11 rounded-[8px]"
                      data-ocid="delivery_form.select"
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
                </div>
              )}
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => field("notes", e.target.value)}
                placeholder="Any special instructions..."
                rows={3}
                className="rounded-[8px] resize-none"
                data-ocid="delivery_form.textarea"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#0F4F50] hover:bg-[#0a3a3b] text-white rounded-[10px] h-12 px-8 text-sm font-semibold flex items-center gap-2"
            data-ocid="delivery_form.submit_button"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Add Delivery"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 px-6 rounded-[10px] text-sm"
            data-ocid="delivery_form.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
