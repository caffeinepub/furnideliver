export type DeliveryStatus = "Pending" | "Out for Delivery" | "Delivered";

export interface Delivery {
  id: bigint;
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  deliveryDate: string;
  driverName: string;
  notes: string;
  status: string;
  createdAt: bigint;
}

export interface DeliveryFormData {
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  deliveryDate: string;
  driverName: string;
  notes: string;
  status: DeliveryStatus;
}

export const STATUSES: DeliveryStatus[] = [
  "Pending",
  "Out for Delivery",
  "Delivered",
];

export const sampleDeliveries: Delivery[] = [
  {
    id: BigInt(1),
    customerName: "Marcus Thompson",
    phone: "60123456789",
    address: "14, Jalan Bukit Bintang, Kuala Lumpur 55100",
    productName: "3-Seater Leather Sofa",
    deliveryDate: new Date().toISOString().split("T")[0],
    driverName: "Ali Hassan",
    notes: "Call 30 minutes before arrival. Second floor, no elevator.",
    status: "Out for Delivery",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    customerName: "Priya Nair",
    phone: "60198765432",
    address: "88, Taman Sri Muda, Shah Alam 40150",
    productName: "Queen Bed Frame & Mattress",
    deliveryDate: new Date().toISOString().split("T")[0],
    driverName: "Raju Selvam",
    notes: "Assembly required. Customer has tools ready.",
    status: "Pending",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    customerName: "Tan Wei Liang",
    phone: "60112233445",
    address: "22, Damansara Utama, Petaling Jaya 47400",
    productName: "8-Seat Dining Table Set",
    deliveryDate: new Date().toISOString().split("T")[0],
    driverName: "Ali Hassan",
    notes: "",
    status: "Delivered",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    customerName: "Faridah Binti Razak",
    phone: "60177889900",
    address: "5, Ara Damansara, Petaling Jaya 47301",
    productName: "TV Cabinet & Bookshelf",
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    driverName: "Raju Selvam",
    notes: "Preferred delivery time: 9am–12pm.",
    status: "Pending",
    createdAt: BigInt(Date.now()),
  },
];
