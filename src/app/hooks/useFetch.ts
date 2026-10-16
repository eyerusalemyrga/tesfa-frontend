import { useCallback, useEffect, useState } from "react";

// Runs `load` on mount (and whenever `deps` change) and tracks data / loading / error.
// Pass `enabled: false` to wait, e.g. until the session is known.
export function useFetch<T>(load: () => Promise<T>, deps: unknown[], enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await run());
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    if (enabled) reload();
  }, [reload, enabled]);

  return { data, setData, loading, error, reload };
}
