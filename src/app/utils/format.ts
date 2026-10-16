import type { ChartData } from "./types/graphs";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export const formatNumber = (value: number) => number.format(value);
export const formatCompact = (value: number) => compact.format(value);

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// Counts items per key, largest first, as chart-ready data.
export function countBy<T>(items: T[], key: (item: T) => string | string[], title: string): ChartData {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const k of ([] as string[]).concat(key(item))) {
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  const rows = [...counts].sort((a, b) => b[1] - a[1]);
  return { chart_type: "bar", title, labels: rows.map((r) => r[0]), values: rows.map((r) => r[1]) };
}

// Counts items per day (or month) over a continuous range, so empty periods show as 0.
export function countOverTime<T>(items: T[], date: (item: T) => string, title: string, unit: "day" | "month", periods: number): ChartData {
  const keyOf = (d: Date) => (unit === "day" ? d.toISOString().slice(0, 10) : d.toISOString().slice(0, 7));
  const labels: string[] = [];
  const keys: string[] = [];
  const now = new Date();
  for (let i = periods - 1; i >= 0; i--) {
    const d = unit === "day" ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - i) : new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(keyOf(d));
    labels.push(d.toLocaleDateString("en", unit === "day" ? { day: "numeric", month: "short" } : { month: "short", year: "2-digit" }));
  }
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const item of items) {
    const k = keyOf(new Date(date(item)));
    if (counts.has(k)) counts.set(k, counts.get(k)! + 1);
  }
  return { chart_type: unit === "day" ? "bar" : "line", title, labels, values: keys.map((k) => counts.get(k)!) };
}
