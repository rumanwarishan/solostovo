# Storefront

A Next.js DTC storefront scaffold that mirrors the structure and UX patterns documented in
[`docs/solostove-ui-ux-analysis.md`](docs/solostove-ui-ux-analysis.md) — sticky value-prop bar,
need-based + product-family navigation, category pages with a spec comparison tool, product pages
with financing/cross-sell/FAQ/reviews, a cart drawer with a free-shipping progress bar, real Stripe
Checkout, and an internal admin dashboard for orders and products.

Every brand name, color, and product in this repo is a **placeholder** — nothing is copied from any
third-party site. Swap them for your own before shipping (see below).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Rebranding checklist

1. **Brand identity** — edit `src/config/brand.ts` (name, tagline, support email, social links,
   free-shipping threshold, warranty/trial copy).
2. **Colors** — edit the `--brand-*` custom properties in `src/app/globals.css` (`:root` for light,
   the `prefers-color-scheme: dark` block for dark mode).
3. **Fonts** — swap the `next/font/google` imports in `src/app/layout.tsx`.
4. **Navigation** — edit `src/data/nav.ts` (need-based links, product-family links, footer columns).
5. **Catalog** — edit `src/data/products.ts` and `src/data/categories.ts`. Each product's
   `imageTone` is a Tailwind gradient class used by the placeholder image block
   (`src/components/storefront/PlaceholderImage.tsx`) — swap that component's usage for
   `next/image` once you have real photography.

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

Orders created by real checkouts are appended to `data/orders.generated.json` — a flat-file store
for demo/dev purposes (see `src/data/orders.ts`). **Replace this with a real database before
running in production**: serverless deployments (Vercel, etc.) don't reliably persist local files
across invocations, so orders would be lost.

Without `STRIPE_SECRET_KEY` set, the storefront still runs — checkout just shows a clear message
instead of erroring.

## Admin dashboard

`/admin` — orders and products, read-only for now. Gated by HTTP Basic Auth (`src/proxy.ts`) using
`ADMIN_USER` / `ADMIN_PASSWORD` from your environment. **There is no default password** — the route
returns 503 until both are set, on purpose, so this never ships accidentally open.

This is a minimal gate for local/internal use, not a substitute for real authentication (roles,
sessions, audit trail) before this handles real customer data — swap in NextAuth, Clerk, or your
identity provider before going live. Product edits currently display but don't persist; wire them
up once you've connected a real database.

## Project structure

```
src/
  app/
    (storefront)/     Public site: home, /shop/[category], /product/[slug], /checkout/*
    admin/            Internal dashboard: /admin, /admin/orders, /admin/products
    api/              /api/checkout (Stripe session), /api/stripe/webhook
  components/
    storefront/       Header, Footer, CartDrawer, ProductCard, CompareTable, etc.
    admin/            Sidebar, StatCard, StatusPill
  data/               In-code catalog, nav, and seed order data
  config/brand.ts     Brand identity — start here when rebranding
  context/            Cart state (persisted to localStorage)
  lib/stripe.ts       Server-side Stripe client
```
