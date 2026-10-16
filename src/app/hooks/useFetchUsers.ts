import { fetchUsers } from "../utils/fetchUsers";
import { useFetch } from "./useFetch";

export function useUsers() {
  const { data, setData, loading, error, reload } = useFetch(fetchUsers, []);
  return { users: data ?? [], setUsers: setData, loading, error, loadUsers: reload };
}
