"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaChartPie, FaComments, FaListUl, FaSignOutAlt, FaThLarge, FaUser, FaUsers } from "react-icons/fa";
import { useSession } from "../../hooks/useSession";
import { clearSession } from "../../utils/session";
import ConfirmModal from "../ConfirmModal";
import Logo from "../Logo";

const professionalLinks = [
  { href: "/", label: "Ask Tesfa", icon: <FaComments /> },
  { href: "/insights", label: "Insights", icon: <FaChartPie /> },
  { href: "/account", label: "Account", icon: <FaUser /> },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: <FaThLarge /> },
  { href: "/admin/users", label: "Users", icon: <FaUsers /> },
  { href: "/admin/queries", label: "Queries", icon: <FaListUl /> },
  { href: "/insights", label: "Insights", icon: <FaChartPie /> },
  { href: "/account", label: "Account", icon: <FaUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useSession();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const links = isAdmin ? adminLinks : professionalLinks;

  function handleLogout() {
    clearSession();
    router.push("/signin");
  }

  const linkClass = (href: string) =>
    `rounded-lg transition-colors ${pathname === href ? "bg-accent text-white" : "text-white hover:bg-accent/80"}`;

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-brand p-5 text-white lg:flex">
        <div className="mb-10 px-2">
          <Logo light />
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 ${linkClass(link.href)}`}>
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={() => setConfirmLogout(true)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/80">
          <FaSignOutAlt className="text-lg" />
          Log out
        </button>
      </aside>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around bg-brand py-2 text-white shadow-lg lg:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`flex flex-col items-center px-2 py-1 text-xs ${linkClass(link.href)}`}>
            <span className="text-lg">{link.icon}</span>
            <span className="mt-1">{link.label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => setConfirmLogout(true)} className="flex flex-col items-center rounded-lg px-2 py-1 text-xs hover:bg-accent/80">
          <FaSignOutAlt className="text-lg" />
          <span className="mt-1">Log out</span>
        </button>
      </nav>

      {confirmLogout && (
        <ConfirmModal
          title="Confirm Log Out"
          message="Are you sure you want to sign out?"
          onConfirm={handleLogout}
          onClose={() => setConfirmLogout(false)}
        />
      )}
    </>
  );
}
