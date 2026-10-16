import { useState } from "react";
import { fetchLogin } from "../utils/fetchLogin";
import { saveSession } from "../utils/session";

export function useFetchLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLogin(email, password);
      saveSession(data);
      return data;
    } catch (error) {
      setError(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
