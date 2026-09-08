# Storefront

A Next.js DTC storefront scaffold that mirrors the structure and UX patterns documented in
[`docs/solostove-ui-ux-analysis.md`](docs/solostove-ui-ux-analysis.md) — sticky value-prop bar,
need-based + product-family navigation, a full-width hero slider, category pages with a spec
comparison tool, product pages with financing/cross-sell/FAQ/reviews, a cart drawer with a
free-shipping progress bar, real Stripe Checkout, and a database-backed admin for orders, products,
categories, and homepage content.

Every brand name, color, and product in this repo is a **placeholder** — nothing is copied from any
third-party site. Swap them for your own before shipping (see below).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a database connected (see below), the site runs on a built-in placeholder catalog and
admin editing is disabled — everything else works.

## Rebranding checklist

1. **Brand identity** — edit `src/config/brand.ts` (name, tagline, support email, social links,
   free-shipping threshold, warranty/trial copy).
2. **Colors** — edit the `--brand-*` custom properties in `src/app/globals.css` (`:root` for light,
   the `prefers-color-scheme: dark` block for dark mode).
3. **Fonts** — swap the `next/font/google` imports in `src/app/layout.tsx`.
4. **Navigation** — edit `src/data/nav.ts` (need-based links, product-family links, footer columns).
5. **Homepage content** — once a database is connected, edit hero slides, the value-prop bar, the
   "as featured in" strip, and the community teaser from `/admin/content` instead of code.
6. **Catalog** — once a database is connected, add/edit products and categories from `/admin/products`
   and `/admin/categories`. Each product's `imageTone` is a Tailwind gradient class used by the
   placeholder image block (`src/components/storefront/PlaceholderImage.tsx`) — swap that
   component's usage for `next/image` once you have real photography.

## Database

The app uses MySQL (via `mysql2`) for products, categories, orders, and editable homepage content.
**Setup is just: create a database, add four environment variables, redeploy.** The app creates its
own tables on first request (`src/lib/db.ts`) — no manual SQL, no SSH, no migration tool needed.

### On Hostinger (or any cPanel-style host)

1. In hPanel, go to **Databases → MySQL Databases** and create a new database and user, and attach
   the user to the database with all privileges. Note the database name, username, password, and
   host (usually `localhost` on shared hosting).
2. In your Web App's environment variable settings (the same place you set `ADMIN_USER` /
   `STRIPE_SECRET_KEY`), add:
   - `DB_HOST` — usually `localhost`
   - `DB_PORT` — usually `3306`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
3. Redeploy. The first request creates all tables automatically.
4. Go to `/admin/products` and click **Seed starter catalog** to populate it with the placeholder
   fire pit / pizza oven catalog, or just start adding your own products.

### Equivalent SQL (for reference / running manually via phpMyAdmin instead)

You never need to run this by hand — it's here so you can see exactly what the app creates, or run
it yourself if you'd rather use phpMyAdmin than rely on auto-migration.

```sql
CREATE TABLE categories (
  slug VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  family VARCHAR(64) NOT NULL,
  fit VARCHAR(32) NULL,
  fuel VARCHAR(32) NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2) NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  badges JSON NULL,
  short_description TEXT,
  description TEXT,
  specs JSON NULL,
  variants JSON NULL,
  image_tone VARCHAR(255) NOT NULL DEFAULT 'from-[#3a4a3f] to-[#1f2b23]',
  cross_sell JSON NULL,
  compare_group VARCHAR(64) NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (family) REFERENCES categories(slug) ON DELETE RESTRICT,
  INDEX (family)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('paid','processing','shipped','refunded') NOT NULL DEFAULT 'paid',
  source ENUM('seed','stripe') NOT NULL DEFAULT 'stripe',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64) NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- One JSON blob per editable homepage section (hero slides, value props,
-- trust strip, community teaser) — edited from /admin/content.
CREATE TABLE content_blocks (
  block_key VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Without a database connected

Reads fall back to the placeholder catalog in `src/data/products.ts` / `categories.ts` and the
defaults in `src/data/content.ts`, so the storefront always works. Writes (creating/editing a
product, category, or content, updating an order's status) return a clear error asking you to
connect a database first, instead of silently failing.

Stripe orders always try the database first; if none is configured, they fall back to a local
`data/orders.generated.json` file for dev/demo purposes only (serverless hosts don't reliably
persist local files across invocations, so don't rely on this in production).

## Stripe checkout

Checkout is real Stripe Checkout (hosted, redirect-based — Stripe handles card data, so this app
never touches it directly).

1. Get test keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys) and set
   `STRIPE_SECRET_KEY` in `.env.local`.
2. In dev, forward webhook events so completed orders land in the admin dashboard:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.
3. In production, add a webhook endpoint pointing at `https://yourdomain.com/api/stripe/webhook` in
   the Stripe dashboard and use its signing secret instead.

Without `STRIPE_SECRET_KEY` set, the storefront still runs — checkout just shows a clear message
instead of erroring.

## Admin dashboard

Visit `/admin` (e.g. `https://yourdomain.com/admin`) and sign in with whatever you set
`ADMIN_USER` / `ADMIN_PASSWORD` to in your environment — your browser will show a standard
Basic Auth login prompt.

- **Dashboard** — revenue, order count, low-stock alerts.
- **Orders** — list, detail, and status updates (paid/processing/shipped/refunded).
- **Products** — add, edit, delete. Specs, badges, cross-sell, and compare-group are all editable.
- **Categories** — add, edit, delete.
- **Content** — hero slider slides (including a video or image URL per slide), the value-props bar,
  the "as featured in" strip, and the community teaser — all edited as plain forms, live on save.

Gated by HTTP Basic Auth (`src/proxy.ts`) using `ADMIN_USER` / `ADMIN_PASSWORD` from your
environment, and the same protection covers the `/api/admin/*` write endpoints, not just the pages.
**There is no default password** — the route returns 503 until both are set, so this never ships
accidentally open.

This is a minimal gate for local/internal use, not a substitute for real authentication (roles,
sessions, audit trail) before this handles real customer data at scale — swap in NextAuth, Clerk,
or your identity provider before going live with a team of admins.

## Project structure

```
src/
  app/
    (storefront)/     Public site: home, /shop/[category], /product/[slug], /checkout/*
    admin/            Dashboard, orders, products, categories, content — all under Basic Auth
    api/
      checkout/       Stripe Checkout session creation
      stripe/webhook/ Stripe webhook → writes to the orders table
      admin/          Write endpoints for products/categories/content/order status (admin-only)
  components/
    storefront/       Header, Footer, CartDrawer, HeroSlider, ProductCard, CompareTable, etc.
    admin/            Sidebar, ProductForm, CategoryForm, ContentForm, OrderStatusForm, etc.
  data/               DB-backed data layer (falls back to placeholder data with no DB configured)
  config/brand.ts     Brand identity — start here when rebranding
  context/            Cart state (snapshotted per line item, persisted to localStorage)
  lib/db.ts           MySQL connection pool + self-migrating schema
  lib/stripe.ts       Server-side Stripe client
```
