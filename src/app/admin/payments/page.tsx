import { isStripeConfigured, isStripeWebhookConfigured } from "@/lib/stripe";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        ok ? "bg-brand-primary-soft text-brand-primary-dark" : "bg-brand-danger/10 text-brand-danger"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-brand-primary" : "bg-brand-danger"}`} />
      {label}
    </span>
  );
}

export default function AdminPaymentsPage() {
  const stripeReady = isStripeConfigured();
  const webhookReady = isStripeWebhookConfigured();
  const dbReady = isDbConfigured();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Payments</h1>
      <p className="mt-1 max-w-2xl text-sm text-brand-ink/60">
        Payment provider keys live in environment variables, not in this database — that keeps
        secret keys out of a web form and admin-panel database that a misconfigured permission or
        backup could otherwise expose. This page shows connection status and tells you exactly
        what to set, rather than storing the keys itself.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-sm border border-brand-line bg-brand-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Stripe</h2>
              <p className="mt-1 text-sm text-brand-ink/60">
                Hosted Checkout — customers pay on a Stripe-hosted page, so this app never touches
                card data directly.
              </p>
            </div>
            <StatusPill ok={stripeReady} label={stripeReady ? "Connected" : "Not connected"} />
          </div>

          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-sm bg-brand-paper px-3 py-2">
              <dt className="text-brand-ink/60">Checkout (STRIPE_SECRET_KEY)</dt>
              <dd>
                <StatusPill ok={stripeReady} label={stripeReady ? "Set" : "Missing"} />
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-sm bg-brand-paper px-3 py-2">
              <dt className="text-brand-ink/60">Order sync (STRIPE_WEBHOOK_SECRET)</dt>
              <dd>
                <StatusPill ok={webhookReady} label={webhookReady ? "Set" : "Missing"} />
              </dd>
            </div>
          </dl>

          {!stripeReady && (
            <p className="mt-4 rounded-sm border border-dashed border-brand-line p-3 text-xs text-brand-ink/60">
              Get test keys from the{" "}
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                target="_blank"
                rel="noreferrer"
                className="text-brand-primary hover:underline"
              >
                Stripe dashboard
              </a>{" "}
              and add <code className="rounded bg-brand-line/60 px-1">STRIPE_SECRET_KEY</code> and{" "}
              <code className="rounded bg-brand-line/60 px-1">STRIPE_WEBHOOK_SECRET</code> to your
              hosting environment variables, then redeploy. Full steps are in the README.
            </p>
          )}
          {stripeReady && !webhookReady && (
            <p className="mt-4 rounded-sm border border-dashed border-brand-line p-3 text-xs text-brand-ink/60">
              Checkout works, but completed orders won&apos;t appear under Orders until
              <code className="mx-1 rounded bg-brand-line/60 px-1">STRIPE_WEBHOOK_SECRET</code>
              is set — add a webhook endpoint at{" "}
              <code className="rounded bg-brand-line/60 px-1">/api/stripe/webhook</code> in the
              Stripe dashboard and copy its signing secret in.
            </p>
          )}
          {stripeReady && webhookReady && !dbReady && (
            <p className="mt-4 rounded-sm border border-dashed border-brand-line p-3 text-xs text-brand-ink/60">
              Fully connected, but without a database, completed orders are only saved to a
              temporary file on the server and can be lost. Connect a database (see README) so
              orders persist reliably.
            </p>
          )}
        </div>

        <div className="rounded-sm border border-brand-line bg-brand-surface p-5 opacity-60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">PayPal</h2>
              <p className="mt-1 text-sm text-brand-ink/60">Not built yet.</p>
            </div>
            <StatusPill ok={false} label="Coming soon" />
          </div>
        </div>

        <div className="rounded-sm border border-brand-line bg-brand-surface p-5 opacity-60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Manual / Cash on delivery</h2>
              <p className="mt-1 text-sm text-brand-ink/60">Not built yet.</p>
            </div>
            <StatusPill ok={false} label="Coming soon" />
          </div>
        </div>
      </div>
    </div>
  );
}
