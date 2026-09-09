import { Preloader } from "@/components/Preloader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper">
      <Preloader size={96} />
    </div>
  );
}
