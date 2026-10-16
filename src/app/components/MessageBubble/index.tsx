import { FaDove } from "react-icons/fa";
import ChartView from "../../sharedComponents/ChartView";
import type { Message } from "../../utils/types/chat";
import RichText from "../RichText";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

function label(key: string) {
  const text = key.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Metrics({ metrics }: { metrics: Record<string, unknown> }) {
  const entries = Object.entries(metrics).filter(([, value]) => typeof value === "number" || typeof value === "string");
  if (!entries.length) return null;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-lg bg-accent-soft/60 px-3 py-2">
          <p className="text-xs text-gray-600">{label(key)}</p>
          <p className="font-bold text-brand">{typeof value === "number" ? number.format(value) : String(value)}</p>
        </div>
      ))}
    </div>
  );
}

function TopConflicts({ conflicts }: { conflicts: NonNullable<Message["top_conflicts"]> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-accent text-white">
          <tr>
            <th className="px-3 py-2 font-semibold">Conflict</th>
            <th className="px-3 py-2 font-semibold">Year</th>
            <th className="px-3 py-2 text-right font-semibold">Risk score</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((conflict, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-3 py-2">{conflict.country_a} vs {conflict.country_b}</td>
              <td className="px-3 py-2">{conflict.year ?? "-"}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {conflict.predicted_risk_score != null ? number.format(Number(conflict.predicted_risk_score)) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand px-4 py-3 text-white">
          {message.content}
          {(message.region || message.conflict_type) && (
            <p className="mt-1 text-xs text-white/70">
              {[message.region, message.conflict_type].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white">
        <FaDove aria-hidden />
      </span>
      <div className="min-w-0 flex-1 space-y-4 text-gray-800">
        <RichText text={message.content} />
        {message.metrics && <Metrics metrics={message.metrics} />}
        {message.chart?.labels?.length ? <ChartView chart={message.chart} /> : null}
        {message.top_conflicts?.length ? <TopConflicts conflicts={message.top_conflicts} /> : null}
      </div>
    </div>
  );
}
