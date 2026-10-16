import { fetchConversations } from "../utils/fetchConversations";
import { useFetch } from "./useFetch";

// Pass enabled=false for guests: they have no saved history.
export function useConversations(enabled = true) {
  const { data, setData, loading, error, reload } = useFetch(fetchConversations, [], enabled);
  return { conversations: data ?? [], setConversations: setData, loading, error, reload };
}
