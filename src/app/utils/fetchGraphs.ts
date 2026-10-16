import { apiFetch } from "./apiClient";
import type { SavedChart } from "./types/chat";
import type { Country, Graphs } from "./types/graphs";

const countryQuery = (country?: string) => (country ? `?country=${encodeURIComponent(country)}` : "");

export function fetchGraphs(country?: string) {
  return apiFetch<Graphs>("/api/graphs" + countryQuery(country));
}

export function fetchCountries() {
  return apiFetch<Country[]>("/api/countries");
}

// Tesfa AI answers that came with a chart.
export function fetchCharts(country?: string) {
  return apiFetch<SavedChart[]>("/api/charts" + countryQuery(country));
}
