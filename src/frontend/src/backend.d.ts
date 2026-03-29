import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Delivery {
    id: bigint;
    customerName: string;
    status: string;
    createdAt: bigint;
    deliveryDate: string;
    productName: string;
    address: string;
    notes: string;
    phone: string;
    driverName: string;
}
export interface Sale {
    id: bigint;
    customerName: string;
    productId: bigint;
    productName: string;
    quantity: bigint;
    saleDate: string;
}
export interface InventorySummary {
    lowStockThreshold: bigint;
    productCode: string;
    productId: bigint;
    productName: string;
    soldQty: bigint;
    incomingPending: bigint;
    category: string;
    currentStock: bigint;
}
export interface Product {
    id: bigint;
    lowStockThreshold: bigint;
    code: string;
    name: string;
    sellingPrice: number;
    category: string;
    costPrice: number;
}
export interface IncomingStock {
    id: bigint;
    status: string;
    supplierName: string;
    productId: bigint;
    productName: string;
    quantity: bigint;
    expectedDate: string;
}
export interface backendInterface {
    addIncomingStock(productId: bigint, productName: string, quantity: bigint, supplierName: string, expectedDate: string): Promise<IncomingStock>;
    createDelivery(customerName: string, phone: string, address: string, productName: string, deliveryDate: string, driverName: string, notes: string): Promise<Delivery>;
    createProduct(name: string, code: string, category: string, costPrice: number, sellingPrice: number, lowStockThreshold: bigint): Promise<Product>;
    deleteDelivery(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getDeliveries(): Promise<Array<Delivery>>;
    getIncomingStock(): Promise<Array<IncomingStock>>;
    getInventorySummary(): Promise<Array<InventorySummary>>;
    getProducts(): Promise<Array<Product>>;
    getSales(): Promise<Array<Sale>>;
    recordSale(productId: bigint, productName: string, quantity: bigint, customerName: string, saleDate: string): Promise<void>;
    updateDelivery(id: bigint, customerName: string, phone: string, address: string, productName: string, deliveryDate: string, driverName: string, notes: string, status: string): Promise<Delivery>;
    updateIncomingStockStatus(id: bigint, status: string): Promise<IncomingStock>;
    updateProduct(id: bigint, name: string, code: string, category: string, costPrice: number, sellingPrice: number, lowStockThreshold: bigint): Promise<Product>;
}
