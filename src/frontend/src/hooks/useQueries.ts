import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Delivery } from "../types/delivery";
import type {
  IncomingStock,
  InventorySummary,
  Product,
  Sale,
} from "../types/inventory";
import { useActor } from "./useActor";

export function useGetDeliveries() {
  const { actor, isFetching } = useActor();
  return useQuery<Delivery[]>({
    queryKey: ["deliveries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDeliveries() as Promise<Delivery[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDelivery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      phone: string;
      address: string;
      productName: string;
      deliveryDate: string;
      driverName: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createDelivery(
        data.customerName,
        data.phone,
        data.address,
        data.productName,
        data.deliveryDate,
        data.driverName,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

export function useUpdateDelivery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      customerName: string;
      phone: string;
      address: string;
      productName: string;
      deliveryDate: string;
      driverName: string;
      notes: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateDelivery(
        data.id,
        data.customerName,
        data.phone,
        data.address,
        data.productName,
        data.deliveryDate,
        data.driverName,
        data.notes,
        data.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

export function useDeleteDelivery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteDelivery(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

// ─── Inventory Hooks ──────────────────────────────────────────────────────────

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts() as Promise<Product[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      code: string;
      category: string;
      costPrice: number;
      sellingPrice: number;
      lowStockThreshold: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createProduct(
        data.name,
        data.code,
        data.category,
        data.costPrice,
        data.sellingPrice,
        data.lowStockThreshold,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      code: string;
      category: string;
      costPrice: number;
      sellingPrice: number;
      lowStockThreshold: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(
        data.id,
        data.name,
        data.code,
        data.category,
        data.costPrice,
        data.sellingPrice,
        data.lowStockThreshold,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    },
  });
}

export function useGetIncomingStock() {
  const { actor, isFetching } = useActor();
  return useQuery<IncomingStock[]>({
    queryKey: ["incoming-stock"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncomingStock() as Promise<IncomingStock[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddIncomingStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      productId: bigint;
      productName: string;
      quantity: bigint;
      supplierName: string;
      expectedDate: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addIncomingStock(
        data.productId,
        data.productName,
        data.quantity,
        data.supplierName,
        data.expectedDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    },
  });
}

export function useUpdateIncomingStockStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateIncomingStockStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    },
  });
}

export function useGetSales() {
  const { actor, isFetching } = useActor();
  return useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSales() as Promise<Sale[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordSale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      productId: bigint;
      productName: string;
      quantity: bigint;
      customerName: string;
      saleDate: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordSale(
        data.productId,
        data.productName,
        data.quantity,
        data.customerName,
        data.saleDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
    },
  });
}

export function useGetInventorySummary() {
  const { actor, isFetching } = useActor();
  return useQuery<InventorySummary[]>({
    queryKey: ["inventory-summary"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInventorySummary() as Promise<InventorySummary[]>;
    },
    enabled: !!actor && !isFetching,
  });
}
