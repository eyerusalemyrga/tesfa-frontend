import type { ChartData } from "./graphs";

export interface TopConflict {
  country_a: string;
  country_b: string;
  year?: number;
  predicted_risk_score?: number;
  [key: string]: unknown;
}

export interface Message {
  id: number;
  conversation: number | null;
  role: "user" | "assistant";
  content: string;
  region: string;
  conflict_type: string;
  metrics: Record<string, unknown> | null;
  top_conflicts: TopConflict[] | null;
  chart: Partial<ChartData> | null;
  countries: string[];
  created_at: string;
}

export interface Conversation {
  id: number;
  user: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface QueryData {
  query: string;
  region?: string;
  conflict_type?: string;
  conversation_id?: number;
}

// A Tesfa AI answer that came with chart data (GET /charts/).
export interface SavedChart {
  id: number;
  conversation: number;
  question: string | null;
  countries: string[];
  chart: Partial<ChartData>;
  metrics: Record<string, unknown> | null;
  top_conflicts: TopConflict[] | null;
  created_at: string;
}
