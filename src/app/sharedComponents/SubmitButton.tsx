export default function SubmitButton({ busy, busyLabel, label }: { busy: boolean; busyLabel: string; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white shadow-[0_6px_18px_rgba(216,146,67,0.25)] transition hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/30 disabled:opacity-70"
    >
      {busy ? busyLabel : label}
    </button>
  );
}
