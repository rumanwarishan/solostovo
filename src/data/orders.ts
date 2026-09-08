import fs from "fs";
import path from "path";
import { getProductById } from "./products";

export type OrderStatus = "paid" | "processing" | "shipped" | "refunded";

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO date
  source: "seed" | "stripe";
};

/** Seed orders so the admin dashboard has something to show on first run. */
const seedOrders: Order[] = [
  {
    id: "ORD-1001",
    customerEmail: "j.rivera@example.com",
    customerName: "J. Rivera",
    items: [{ productId: "fp-ember-18", name: "Ember 18", quantity: 1, unitPrice: 279 }],
    total: 279,
    status: "shipped",
    createdAt: "2026-08-14T15:22:00.000Z",
    source: "seed",
  },
  {
    id: "ORD-1002",
    customerEmail: "d.chen@example.com",
    customerName: "D. Chen",
    items: [
      { productId: "fp-ember-27", name: "Ember 27", quantity: 1, unitPrice: 449 },
      { productId: "acc-stand-ember", name: "Ember Stand", quantity: 1, unitPrice: 59 },
      { productId: "acc-cover-ember-27", name: "Ember 27 Cover", quantity: 1, unitPrice: 49 },
    ],
    total: 557,
    status: "processing",
    createdAt: "2026-09-01T10:05:00.000Z",
    source: "seed",
  },
  {
    id: "ORD-1003",
    customerEmail: "m.okafor@example.com",
    customerName: "M. Okafor",
    items: [{ productId: "fp-scout-12", name: "Scout 12", quantity: 2, unitPrice: 129 }],
    total: 258,
    status: "paid",
    createdAt: "2026-09-05T18:47:00.000Z",
    source: "seed",
  },
  {
    id: "ORD-1004",
    customerEmail: "t.nguyen@example.com",
    customerName: "T. Nguyen",
    items: [{ productId: "po-hearth-16", name: "Hearth 16", quantity: 1, unitPrice: 349 }],
    total: 349,
    status: "refunded",
    createdAt: "2026-08-22T09:12:00.000Z",
    source: "seed",
  },
  {
    id: "ORD-1005",
    customerEmail: "a.petrova@example.com",
    customerName: "A. Petrova",
    items: [{ productId: "fp-infinity-flame", name: "Infinity Flame", quantity: 1, unitPrice: 599 }],
    total: 599,
    status: "shipped",
    createdAt: "2026-08-30T13:40:00.000Z",
    source: "seed",
  },
];

const GENERATED_ORDERS_PATH = path.join(process.cwd(), "data", "orders.generated.json");

/**
 * Orders created by real Stripe checkouts land here (written by the webhook
 * route). This is a flat-file store for demo/dev purposes only — swap for a
 * real database (Postgres, etc.) before running this in production, since
 * serverless deployments won't reliably persist local files across invocations.
 */
function readGeneratedOrders(): Order[] {
  try {
    const raw = fs.readFileSync(GENERATED_ORDERS_PATH, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function appendGeneratedOrder(order: Order) {
  const existing = readGeneratedOrders();
  existing.unshift(order);
  fs.mkdirSync(path.dirname(GENERATED_ORDERS_PATH), { recursive: true });
  fs.writeFileSync(GENERATED_ORDERS_PATH, JSON.stringify(existing, null, 2));
}

export function getAllOrders(): Order[] {
  return [...readGeneratedOrders(), ...seedOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrder(id: string): Order | undefined {
  return getAllOrders().find((o) => o.id === id);
}

export function orderItemsWithProducts(order: Order) {
  return order.items.map((item) => ({
    ...item,
    product: getProductById(item.productId),
  }));
}
