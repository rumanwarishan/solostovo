import { getPaymentStatus } from "@/data/payment-settings";
import { isDbConfigured } from "@/lib/db";
import { StripeConnectForm } from "@/components/admin/StripeConnectForm";
import { PaypalConnectForm } from "@/components/admin/PaypalConnectForm";

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

export default async function AdminPaymentsPage() {
  const dbReady = isDbConfigured();
  const status = await getPaymentStatus();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Payments</h1>
      <p className="mt-1 max-w-2xl text-sm text-brand-ink/60">
        Connect a provider below — credentials are verified against the provider before saving, then
        encrypted and stored in your database. You can also set STRIPE_SECRET_KEY /
        STRIPE_WEBHOOK_SECRET as environment variables instead; a key entered here takes priority
        over the environment variable if both are set.
      </p>

      {!dbReady && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — connecting a provider from this page requires one (see
          README). Environment variables still work without a database.
        </p>
      )}

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
            <StatusPill ok={status.stripeConnected} label={status.stripeConnected ? "Connected" : "Not connected"} />
          </div>

          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-sm bg-brand-paper px-3 py-2">
              <dt className="text-brand-ink/60">Checkout key</dt>
              <dd>
                <StatusPill ok={status.stripeConnected} label={status.stripeConnected ? status.stripeSecretKeyMasked : "Missing"} />
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-sm bg-brand-paper px-3 py-2">
              <dt className="text-brand-ink/60">Order sync (webhook)</dt>
              <dd>
                <StatusPill ok={status.stripeWebhookConnected} label={status.stripeWebhookConnected ? "Set" : "Missing"} />
              </dd>
            </div>
          </dl>

          {dbReady && (
            <StripeConnectForm
              connected={status.stripeConnected}
              maskedKey={status.stripeSecretKeyMasked}
              webhookConnected={status.stripeWebhookConnected}
            />
          )}

          {status.stripeConnected && !status.stripeWebhookConnected && (
            <p className="mt-4 rounded-sm border border-dashed border-brand-line p-3 text-xs text-brand-ink/60">
              Checkout works, but completed orders won&apos;t appear under Orders until a webhook
              secret is set — add an endpoint at{" "}
              <code className="rounded bg-brand-line/60 px-1">/api/stripe/webhook</code> in the
              Stripe dashboard and paste its signing secret above.
            </p>
          )}
          {status.stripeConnected && status.stripeWebhookConnected && !dbReady && (
            <p className="mt-4 rounded-sm border border-dashed border-brand-line p-3 text-xs text-brand-ink/60">
              Fully connected, but without a database, completed orders are only saved to a
              temporary file on the server and can be lost. Connect a database (see README) so
              orders persist reliably.
            </p>
          )}
        </div>

        <div className="rounded-sm border border-brand-line bg-brand-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">PayPal</h2>
              <p className="mt-1 text-sm text-brand-ink/60">
                Connect your PayPal app credentials. The customer-facing &quot;Pay with PayPal&quot;
                button at checkout is a separate build — this wires up the account side first.
              </p>
            </div>
            <StatusPill ok={status.paypalConnected} label={status.paypalConnected ? "Connected" : "Not connected"} />
          </div>

          {dbReady && (
            <PaypalConnectForm
              connected={status.paypalConnected}
              initialClientId={status.paypalClientId}
              initialMode={status.paypalMode}
            />
          )}
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
