import { fetchCharts, fetchCountries, fetchGraphs } from "../utils/fetchGraphs";
import { useFetch } from "./useFetch";

export function useGraphs(country: string) {
  const { data, loading, error } = useFetch(() => fetchGraphs(country || undefined), [country]);
  return { graphs: data, loading, error };
}

export function useCountries() {
  const { data, loading, error } = useFetch(fetchCountries, []);
  return { countries: data ?? [], loading, error };
}

export function useSavedCharts(country = "") {
  const { data, loading, error } = useFetch(() => fetchCharts(country || undefined), [country]);
  return { charts: data ?? [], loading, error };
}
