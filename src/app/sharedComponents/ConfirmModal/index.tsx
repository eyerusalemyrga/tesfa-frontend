"use client";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({ title, message, confirmLabel = "Yes", busy, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex w-full max-w-sm flex-col items-center rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-3 text-center text-2xl font-bold text-accent">{title}</h2>
        <p className="mb-6 text-center text-gray-700">{message}</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded bg-accent px-8 py-2 font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
          >
            {busy ? "Working..." : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-accent px-8 py-2 font-semibold text-accent transition hover:bg-accent-soft"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
