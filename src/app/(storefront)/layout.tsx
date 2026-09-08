import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { getSettings } from "@/data/content";

/**
 * Cart state + footer + cart drawer are shared by every storefront route.
 * The header/announcement/value-prop chrome is NOT here on purpose — the
 * homepage (page.tsx, a sibling of this layout) composes it itself so the
 * hero can sit directly under the header for the transparent-over-hero
 * effect; every other route gets that chrome from (shop)/layout.tsx instead.
 */
export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <CartProvider>
      {children}
      {settings.showFooter && <Footer />}
      <CartDrawer />
    </CartProvider>
  );
}
