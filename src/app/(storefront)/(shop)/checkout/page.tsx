import { getPaymentStatus } from "@/data/payment-settings";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const status = await getPaymentStatus();

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-2xl font-bold">Checkout</h1>
      <div className="mt-8">
        <CheckoutForm stripeConnected={status.stripeConnected} paypalConnected={status.paypalConnected} />
      </div>
    </div>
  );
}
