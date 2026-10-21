"use client";
import { useState } from "react";
import { FaBalanceScale, FaChartLine, FaDollarSign, FaHeartbeat, FaUsers } from "react-icons/fa";
import { useCountries, useGraphs, useSavedCharts } from "../hooks/useFetchGraphs";
import { useSession } from "../hooks/useSession";
import ChartView from "../sharedComponents/ChartView";
import StatTile from "../sharedComponents/StatTile";
import { formatCompact, formatDate, formatNumber } from "../utils/format";

// Charts from GET /graphs/, in reading order. Wide ones span both columns.
const chartOrder: { key: string; wide?: boolean }[] = [
  { key: "conflicts_per_year", wide: true },
  { key: "conflicts_by_country" },
  { key: "risk_by_country" },
  { key: "risk_categories" },
  { key: "conflict_types" },
  { key: "civilian_deaths_by_country" },
  { key: "refugees_by_country" },
  { key: "economic_loss_by_country" },
  { key: "outcomes" },
  { key: "top_risk_conflicts", wide: true },
];

export default function InsightsPage() {
  const { isAdmin } = useSession();
  const [country, setCountry] = useState("");
  const { countries } = useCountries();
  const { graphs, loading, error } = useGraphs(country);
  const { charts: saved, loading: savedLoading } = useSavedCharts(country);
  const summary = graphs?.summary;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-brand sm:text-4xl">Insights</h1>
          <p className="mt-1 text-gray-600">Conflict, risk and humanitarian data from the Tesfa database.</p>
        </div>
        <label className="flex flex-col gap-1 text-sm font-semibold text-brand">
          Country
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-11 min-w-56 rounded-lg border border-accent bg-white px-3 font-normal focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label="Conflicts" icon={<FaChartLine />} value={summary ? formatNumber(summary.conflict_count) : "–"} />
        <StatTile label="Average risk score" icon={<FaBalanceScale />} value={summary ? formatNumber(summary.avg_risk_score) : "–"} />
        <StatTile label="Civilian deaths" icon={<FaHeartbeat />} value={summary ? formatCompact(summary.total_civilian_deaths) : "–"} />
        <StatTile label="Refugees" icon={<FaUsers />} value={summary ? `${formatNumber(summary.total_refugees_millions)}M` : "–"} />
        <StatTile label="Economic loss" icon={<FaDollarSign />} value={summary ? `$${formatNumber(summary.total_economic_loss_usd_billions)}B` : "–"} />
      </div>

      {loading && !graphs ? (
        <p className="py-10 text-center text-gray-500">Loading charts...</p>
      ) : (
        graphs && (
          <div className={`grid gap-6 lg:grid-cols-2 ${loading ? "opacity-60" : ""}`}>
            {chartOrder
              .filter(({ key }) => graphs.charts[key])
              .map(({ key, wide }) => (
                <div key={key} className={wide ? "lg:col-span-2" : ""}>
                  <ChartView chart={graphs.charts[key]} limit={wide ? 10 : 12} />
                </div>
              ))}
          </div>
        )
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-brand">{isAdmin ? "Charts from questions on Tesfa" : "Charts from your questions"}</h2>
        <p className="mb-4 text-gray-600">Answers from Tesfa AI that came with chart data{country ? ` about ${country}` : ""}.</p>
        {savedLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : saved.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
            No charts yet. Ask Tesfa for statistics, e.g. &quot;Show stats for United Kingdom&quot;.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {saved.map((item) => (
              <div key={item.id} className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-brand">{item.question ?? "Question"}</span>
                  <span className="ml-2 text-gray-500">{formatDate(item.created_at)}</span>
                </p>
                <ChartView chart={item.chart} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
