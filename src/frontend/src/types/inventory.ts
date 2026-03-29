export interface Product {
  id: bigint;
  name: string;
  code: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold: bigint;
}

export interface IncomingStock {
  id: bigint;
  productId: bigint;
  productName: string;
  quantity: bigint;
  supplierName: string;
  expectedDate: string;
  status: string;
}

export interface Sale {
  id: bigint;
  productId: bigint;
  productName: string;
  quantity: bigint;
  customerName: string;
  saleDate: string;
}

export interface InventorySummary {
  productId: bigint;
  productName: string;
  productCode: string;
  category: string;
  currentStock: bigint;
  incomingPending: bigint;
  soldQty: bigint;
  lowStockThreshold: bigint;
}

export const CATEGORIES = ["Sofa", "Bed", "Table", "Chair", "Other"];
export const STOCK_STATUSES = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
] as const;

export function getStockStatus(
  currentStock: bigint,
  threshold: bigint,
): string {
  if (currentStock <= 0n) return "Out of Stock";
  if (currentStock <= threshold) return "Low Stock";
  return "In Stock";
}

export const sampleProducts: Product[] = [
  {
    id: 1n,
    name: "3-Seater Leather Sofa",
    code: "SOFA-001",
    category: "Sofa",
    costPrice: 1200,
    sellingPrice: 1800,
    lowStockThreshold: 5n,
  },
  {
    id: 2n,
    name: "Queen Bed Frame",
    code: "BED-001",
    category: "Bed",
    costPrice: 800,
    sellingPrice: 1200,
    lowStockThreshold: 3n,
  },
  {
    id: 3n,
    name: "8-Seat Dining Table",
    code: "TBL-001",
    category: "Table",
    costPrice: 600,
    sellingPrice: 950,
    lowStockThreshold: 4n,
  },
  {
    id: 4n,
    name: "Office Chair",
    code: "CHR-001",
    category: "Chair",
    costPrice: 250,
    sellingPrice: 420,
    lowStockThreshold: 8n,
  },
];

export const sampleIncomingStock: IncomingStock[] = [
  {
    id: 1n,
    productId: 1n,
    productName: "3-Seater Leather Sofa",
    quantity: 10n,
    supplierName: "Kota Furniture Co.",
    expectedDate: new Date(Date.now() + 3 * 86400000)
      .toISOString()
      .split("T")[0],
    status: "Ordered",
  },
  {
    id: 2n,
    productId: 2n,
    productName: "Queen Bed Frame",
    quantity: 5n,
    supplierName: "BestBed Sdn Bhd",
    expectedDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    status: "Received",
  },
  {
    id: 3n,
    productId: 3n,
    productName: "8-Seat Dining Table",
    quantity: 3n,
    supplierName: "WoodCraft MY",
    expectedDate: new Date().toISOString().split("T")[0],
    status: "Ordered",
  },
];

export const sampleSales: Sale[] = [
  {
    id: 1n,
    productId: 1n,
    productName: "3-Seater Leather Sofa",
    quantity: 2n,
    customerName: "Marcus Thompson",
    saleDate: new Date().toISOString().split("T")[0],
  },
  {
    id: 2n,
    productId: 2n,
    productName: "Queen Bed Frame",
    quantity: 3n,
    customerName: "Priya Nair",
    saleDate: new Date().toISOString().split("T")[0],
  },
];

// Derive sample inventory summary from sample data
export const sampleInventorySummary: InventorySummary[] = [
  {
    productId: 1n,
    productName: "3-Seater Leather Sofa",
    productCode: "SOFA-001",
    category: "Sofa",
    currentStock: 3n,
    incomingPending: 10n,
    soldQty: 2n,
    lowStockThreshold: 5n,
  },
  {
    productId: 2n,
    productName: "Queen Bed Frame",
    productCode: "BED-001",
    category: "Bed",
    currentStock: 2n,
    incomingPending: 0n,
    soldQty: 3n,
    lowStockThreshold: 3n,
  },
  {
    productId: 3n,
    productName: "8-Seat Dining Table",
    productCode: "TBL-001",
    category: "Table",
    currentStock: 7n,
    incomingPending: 3n,
    soldQty: 0n,
    lowStockThreshold: 4n,
  },
  {
    productId: 4n,
    productName: "Office Chair",
    productCode: "CHR-001",
    category: "Chair",
    currentStock: 0n,
    incomingPending: 0n,
    soldQty: 12n,
    lowStockThreshold: 8n,
  },
];
