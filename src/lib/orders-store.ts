import fs from "fs";
import path from "path";

export interface StoredOrderItem {
  productName: string;
  variantLabel: string;
  quantity: number;
  priceMAD: number;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  shippingAddress: string;
  status: "PENDING" | "PAID" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | string;
  paymentMethod: "COD" | string;
  notes?: string;
  totalMAD: number;
  createdAt: string;
  items: StoredOrderItem[];
}

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

function ensureOrdersFile() {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getStoredOrders(): StoredOrder[] {
  try {
    ensureOrdersFile();
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading stored orders:", err);
    return [];
  }
}

export function saveOrderToDisk(order: StoredOrder) {
  try {
    ensureOrdersFile();
    const current = getStoredOrders();
    current.unshift(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving order to disk:", err);
  }
}

export function updateStoredOrderStatus(orderIdOrNumber: string, status: StoredOrder["status"]) {
  try {
    ensureOrdersFile();
    const current = getStoredOrders();
    const index = current.findIndex(
      (o) => o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber
    );
    if (index !== -1) {
      current[index].status = status;
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(current, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error updating stored order status:", err);
  }
}
