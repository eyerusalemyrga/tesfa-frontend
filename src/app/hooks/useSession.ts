import { useEffect, useState } from "react";
import { getStoredUser, SESSION_EVENT } from "../utils/session";
import type { User } from "../utils/types/user";

// The signed-in user (null for guests). `ready` is false until localStorage has been read,
// so pages don't flash the guest view or redirect before we know.
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => setUser(getStoredUser());
    read();
    setReady(true);
    window.addEventListener(SESSION_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(SESSION_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return { user, ready, isAdmin: user?.user_type === "Admin" };
}
