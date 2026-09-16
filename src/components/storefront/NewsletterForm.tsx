"use client";

export function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        required
        placeholder="Email address"
        className="rounded-sm border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/60"
      />
      <button className="rounded-sm bg-white px-3 py-2 text-sm font-medium text-brand-ink hover:bg-white/90">
        Sign up
      </button>
    </form>
  );
}
