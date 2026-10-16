export interface ChartData {
  chart_type: "bar" | "line" | "pie" | string;
  title: string;
  labels: (string | number)[];
  values: number[];
}

export interface GraphSummary {
  conflict_count: number;
  avg_risk_score: number;
  total_civilian_deaths: number;
  total_refugees_millions: number;
  total_economic_loss_usd_billions: number;
}

export interface Graphs {
  country: string | null;
  summary: GraphSummary;
  charts: Record<string, ChartData>;
  map_points: unknown[];
}

export interface Country extends GraphSummary {
  id: number;
  name: string;
  conflict_count: number;
}
