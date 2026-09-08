"use client";

export function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        required
        placeholder="Email address"
        className="rounded-sm border border-brand-line bg-brand-paper px-3 py-2 text-sm outline-none focus:border-brand-primary"
      />
      <button className="rounded-sm bg-brand-ink px-3 py-2 text-sm text-brand-paper hover:bg-brand-primary">
        Sign up
      </button>
    </form>
  );
}
