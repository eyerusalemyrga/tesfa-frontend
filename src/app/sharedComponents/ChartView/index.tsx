"use client";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartData } from "../../utils/types/graphs";

export const SERIES_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"];
const SINGLE_COLOR = "#0f7a63";
const AXIS = { fontSize: 12, fill: "#6b7280" };
const MAX_SLICES = 6;

const full = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

interface Row {
  label: string;
  value: number;
}

interface Props {
  chart: Partial<ChartData>;
  limit?: number;
  height?: number;
  showTitle?: boolean;
  timeSeries?: boolean;
}

function toRows(chart: Partial<ChartData>): Row[] {
  const labels = chart.labels ?? [];
  const values = chart.values ?? [];
  return labels.map((label, i) => ({ label: String(label ?? "Unknown"), value: Number(values[i] ?? 0) }));
}

function foldSlices(rows: Row[]) {
  // Keep the given order (e.g. Low → Critical) unless slices must be folded.
  if (rows.length <= MAX_SLICES) return rows;
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const rest = sorted.slice(MAX_SLICES - 1).reduce((sum, row) => sum + row.value, 0);
  return [...sorted.slice(0, MAX_SLICES - 1), { label: "Other", value: rest }];
}

const tooltipProps = {
  formatter: (value: unknown) => [full.format(Number(value)), "Value"] as [string, string],
  contentStyle: { borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 },
  cursor: { fill: "rgba(8, 66, 54, 0.06)" },
};

export default function ChartView({ chart, limit = 12, height, showTitle = true, timeSeries = false }: Props) {
  const [asTable, setAsTable] = useState(false);
  const type = chart.chart_type === "line" || chart.chart_type === "pie" ? chart.chart_type : "bar";
  const allRows = toRows(chart);

  let rows = allRows;
  let note = "";
  if (type === "pie") {
    rows = foldSlices(allRows);
  } else if (type === "bar" && !timeSeries && allRows.length > limit) {
    rows = [...allRows].sort((a, b) => b.value - a.value).slice(0, limit);
    note = `Top ${limit} of ${allRows.length}`;
  }

  return (
    <figure className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <figcaption className="min-w-0">
          {showTitle && chart.title && <p className="font-bold text-brand">{chart.title}</p>}
          {note && <p className="text-xs text-gray-500">{note}</p>}
        </figcaption>
        {allRows.length > 0 && (
          <button
            type="button"
            onClick={() => setAsTable(!asTable)}
            className="shrink-0 rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            {asTable ? "Chart" : "Table"}
          </button>
        )}
      </div>

      {allRows.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No data to show.</p>
      ) : asTable ? (
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-1 pr-2 font-semibold">Label</th>
                <th className="py-1 text-right font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map((row, i) => (
                <tr key={`${row.label}-${i}`} className="border-b border-gray-50">
                  <td className="py-1 pr-2">{row.label}</td>
                  <td className="py-1 text-right tabular-nums">{full.format(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : type === "pie" ? (
        <Donut rows={rows} height={height ?? 220} />
      ) : type === "line" ? (
        <ResponsiveContainer width="100%" height={height ?? 260}>
          <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} minTickGap={16} />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} allowDecimals={false} tickFormatter={(v) => compact.format(v)} />
            <Tooltip {...tooltipProps} cursor={{ stroke: "#9ca3af", strokeDasharray: "3 3" }} />
            <Line type="linear" dataKey="value" stroke={SINGLE_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Bars rows={rows} height={height} upright={timeSeries} />
      )}
    </figure>
  );
}

function Bars({ rows, height, upright }: { rows: Row[]; height?: number; upright?: boolean }) {
  // Long or many labels read better as horizontal bars.
  const horizontal = !upright && (rows.length > 6 || rows.some((row) => row.label.length > 10));

  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={height ?? rows.length * 30 + 30}>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap={4}>
          <CartesianGrid horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => compact.format(v)} />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            width={170}
            interval={0}
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} fill={AXIS.fill}>
                {payload.value.length > 26 ? payload.value.slice(0, 25) + "…" : payload.value}
              </text>
            )}
          />
          <Tooltip {...tooltipProps} />
          <Bar dataKey="value" fill={SINGLE_COLOR} radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height ?? 260}>
      <BarChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} interval={upright ? "preserveStartEnd" : 0} minTickGap={12} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} allowDecimals={false} tickFormatter={(v) => compact.format(v)} />
        <Tooltip {...tooltipProps} />
        <Bar dataKey="value" fill={SINGLE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Donut({ rows, height }: { rows: Row[]; height: number }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="w-full sm:w-1/2">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="label" innerRadius="55%" outerRadius="85%" stroke="#fff" strokeWidth={2}>
              {rows.map((row, i) => (
                <Cell key={row.label} fill={SERIES_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown, name: unknown) => [full.format(Number(value)), String(name)]}
              contentStyle={tooltipProps.contentStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-1.5 text-sm sm:w-1/2">
        {rows.map((row, i) => (
          <li key={row.label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: SERIES_COLORS[i] }} />
            <span className="min-w-0 flex-1 truncate text-gray-700">{row.label}</span>
            <span className="tabular-nums text-gray-900">{Math.round((row.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
