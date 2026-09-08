import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

/**
 * Cart state + footer + cart drawer are shared by every storefront route.
 * The header/announcement/value-prop chrome is NOT here on purpose — the
 * homepage (page.tsx, a sibling of this layout) composes it itself so the
 * hero can sit directly under the header for the transparent-over-hero
 * effect; every other route gets that chrome from (shop)/layout.tsx instead.
 */
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
