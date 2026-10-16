"use client";
import { useState } from "react";
import { FaArrowUp, FaSlidersH } from "react-icons/fa";
import type { Filters } from "../../hooks/useChat";

interface Props {
  disabled: boolean;
  onSend: (query: string, filters: Filters) => void;
}

export default function Composer({ disabled, onSend }: Props) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({ region: "", conflict_type: "" });

  function submit() {
    const text = query.trim();
    if (!text || disabled) return;
    onSend(text, filters);
    setQuery("");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4">
      {showFilters && (
        <div className="mb-2 grid gap-2 sm:grid-cols-2">
          <input
            aria-label="Region"
            placeholder="Region (optional), e.g. East Africa"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <input
            aria-label="Conflict type"
            placeholder="Conflict type (optional), e.g. Civil war"
            value={filters.conflict_type}
            onChange={(e) => setFilters({ ...filters, conflict_type: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-accent"
      >
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Filters"
          aria-pressed={showFilters}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${showFilters ? "bg-accent-soft text-accent-dark" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <FaSlidersH />
        </button>
        <textarea
          aria-label="Ask Tesfa"
          rows={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask Tesfa anything..."
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !query.trim()}
          aria-label="Send"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white transition hover:bg-accent-dark disabled:opacity-40"
        >
          <FaArrowUp />
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-gray-400">Tesfa AI can make mistakes. Check important information.</p>
    </div>
  );
}
