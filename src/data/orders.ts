import fs from "fs";
import path from "path";
import { isDbConfigured, query } from "@/lib/db";
import { getProductById } from "./products";

export type OrderStatus = "paid" | "processing" | "shipped" | "refunded";

export type OrderItem = {
  productId: string | null;
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

/** Used until a database is connected. */
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
 * Fallback flat-file store used only when no database is configured — see
 * src/data/orders.ts history. Once DB_* env vars are set, orders live in
 * the `orders` / `order_items` tables instead (serverless hosts don't
 * reliably persist local files across invocations anyway).
 */
function readGeneratedOrders(): Order[] {
  try {
    const raw = fs.readFileSync(GENERATED_ORDERS_PATH, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function appendGeneratedOrderFile(order: Order) {
  const existing = readGeneratedOrders();
  existing.unshift(order);
  fs.mkdirSync(path.dirname(GENERATED_ORDERS_PATH), { recursive: true });
  fs.writeFileSync(GENERATED_ORDERS_PATH, JSON.stringify(existing, null, 2));
}

type OrderRow = {
  id: string;
  customer_email: string;
  customer_name: string;
  total: string;
  status: OrderStatus;
  source: "seed" | "stripe";
  created_at: string;
};

type OrderItemRow = {
  order_id: string;
  product_id: string | null;
  name: string;
  quantity: number;
  unit_price: string;
};

async function attachItems(orders: OrderRow[]): Promise<Order[]> {
  if (orders.length === 0) return [];
  const ids = orders.map((o) => o.id);
  const items = await query<OrderItemRow[]>(
    `SELECT order_id, product_id, name, quantity, unit_price FROM order_items WHERE order_id IN (${ids
      .map(() => "?")
      .join(",")})`,
    ids
  );
  return orders.map((o) => ({
    id: o.id,
    customerEmail: o.customer_email,
    customerName: o.customer_name,
    total: Number(o.total),
    status: o.status,
    source: o.source,
    createdAt: new Date(o.created_at).toISOString(),
    items: items
      .filter((i) => i.order_id === o.id)
      .map((i) => ({
        productId: i.product_id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: Number(i.unit_price),
      })),
  }));
}

export async function getAllOrders(): Promise<Order[]> {
  if (!isDbConfigured()) {
    return [...readGeneratedOrders(), ...seedOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const rows = await query<OrderRow[]>("SELECT * FROM orders ORDER BY created_at DESC");
  return attachItems(rows);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (!isDbConfigured()) {
    return [...readGeneratedOrders(), ...seedOrders].find((o) => o.id === id);
  }
  const rows = await query<OrderRow[]>("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return undefined;
  const [order] = await attachItems(rows);
  return order;
}

export async function createOrder(order: Order): Promise<void> {
  if (!isDbConfigured()) {
    appendGeneratedOrderFile(order);
    return;
  }
  await query(
    "INSERT INTO orders (id, customer_email, customer_name, total, status, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [order.id, order.customerEmail, order.customerName, order.total, order.status, order.source, order.createdAt]
  );
  for (const item of order.items) {
    await query(
      "INSERT INTO order_items (order_id, product_id, name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
      [order.id, item.productId, item.name, item.quantity, item.unitPrice]
    );
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!isDbConfigured()) {
    throw new Error("Connect a database to update order status (see README).");
  }
  await query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
}

export async function orderItemsWithProducts(order: Order) {
  return Promise.all(
    order.items.map(async (item) => ({
      ...item,
      product: item.productId ? await getProductById(item.productId) : undefined,
    }))
  );
}
