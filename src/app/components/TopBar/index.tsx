import Link from "next/link";
import { FaBars } from "react-icons/fa";
import type { User } from "../../utils/types/user";

interface Props {
  user: User | null;
  ready: boolean;
  onMenu: () => void;
}

export default function TopBar({ user, ready, onMenu }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">
      <button type="button" onClick={onMenu} aria-label="Open menu" className="rounded-lg p-2 text-brand hover:bg-gray-100 lg:invisible">
        <FaBars />
      </button>
      {ready &&
        (user ? (
          <Link href="/account" className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-bold text-brand">{user.first_name} {user.last_name}</span>
              <span className="block text-xs text-gray-500">{user.user_type}</span>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-bold text-white">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin" className="rounded-lg px-4 py-2 font-semibold text-brand hover:bg-gray-100">
              Log in
            </Link>
            <Link href="/signup" className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-dark">
              Create account
            </Link>
          </div>
        ))}
    </header>
  );
}
