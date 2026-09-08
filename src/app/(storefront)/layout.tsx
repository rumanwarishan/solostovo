import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { ValuePropBar } from "@/components/storefront/ValuePropBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Header />
      <ValuePropBar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
