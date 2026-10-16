"use client";
import Link from "next/link";
import { FaChartBar, FaComments, FaUserCheck, FaUserMd, FaUsers } from "react-icons/fa";
import { useSavedCharts } from "../hooks/useFetchGraphs";
import { useConversations } from "../hooks/useFetchConversations";
import { useUsers } from "../hooks/useFetchUsers";
import ChartView from "../sharedComponents/ChartView";
import StatTile from "../sharedComponents/StatTile";
import { countBy, countOverTime, formatDateTime } from "../utils/format";

export default function AdminOverviewPage() {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { conversations, loading: convLoading, error: convError } = useConversations();
  const { charts } = useSavedCharts();
  const loading = usersLoading || convLoading;
  const error = usersError || convError;

  const professionals = users.filter((u) => u.user_type === "Health Professional");
  const usersById = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-extrabold text-brand sm:text-4xl">Overview</h1>
      <p className="mb-6 mt-1 text-gray-600">Who is using Tesfa and what they are asking.</p>

      {error && <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label="Users" icon={<FaUsers />} value={loading ? "–" : users.length} />
        <StatTile label="Health professionals" icon={<FaUserMd />} value={loading ? "–" : professionals.length} />
        <StatTile label="Active users" icon={<FaUserCheck />} value={loading ? "–" : users.filter((u) => u.is_active).length} />
        <StatTile label="Conversations" icon={<FaComments />} value={loading ? "–" : conversations.length} />
        <StatTile label="Answers with charts" icon={<FaChartBar />} value={charts.length} />
      </div>

      {!loading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ChartView chart={countOverTime(conversations, (c) => c.created_at, "Conversations started per day (last 30 days)", "day", 30)} timeSeries />
          </div>
          <ChartView chart={countOverTime(users, (u) => u.date_joined, "New users per month (last 12 months)", "month", 12)} />
          <ChartView chart={countBy(professionals, (u) => u.country || "Not given", "Health professionals by country")} />
          <ChartView chart={countBy(charts, (c) => c.countries, "Countries asked about most")} />
          <ChartView chart={countBy(conversations, (c) => usersById.get(c.user)?.organization || "Not given", "Conversations by organization")} />
        </div>
      )}

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-brand">Latest queries</h2>
          <Link href="/admin/queries" className="font-semibold text-accent-dark hover:underline">See all</Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-accent text-white">
              <tr>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Asked by</th>
                <th className="px-4 py-3">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {conversations.slice(0, 6).map((c) => {
                const owner = usersById.get(c.user);
                return (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="max-w-md truncate px-4 py-3">{c.title || "Untitled"}</td>
                    <td className="px-4 py-3">{owner ? `${owner.first_name} ${owner.last_name}` : `User #${c.user}`}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(c.updated_at)}</td>
                  </tr>
                );
              })}
              {!loading && conversations.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-6 text-gray-500">No queries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
