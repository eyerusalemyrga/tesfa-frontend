import { useState } from "react";
import { fetchSignUp } from "../utils/fetchSignup";
import type { SignUpData } from "../utils/types/user";

export function useFetchSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function signUp(data: SignUpData) {
    setIsLoading(true);
    setError(null);
    try {
      return await fetchSignUp(data);
    } catch (error) {
      setError(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { signUp, isLoading, error };
}
