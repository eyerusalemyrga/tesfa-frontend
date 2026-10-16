import type { ReactNode } from "react";
import { FaChartBar, FaComments, FaHistory } from "react-icons/fa";
import Logo from "../Logo";

const perks = [
  { icon: <FaComments />, text: "Ask Tesfa AI about conflicts, risk and their consequences" },
  { icon: <FaHistory />, text: "Keep every conversation in your history" },
  { icon: <FaChartBar />, text: "Explore graphs and charts built from the Tesfa data" },
];

// Split screen like the KukuKonnect login: form on the left, brand panel on the right.
export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Logo />
          <h1 className="mt-8 text-4xl font-bold text-brand sm:text-5xl">{title}</h1>
          {children}
        </div>
      </section>
      <section className="relative hidden flex-col justify-center gap-8 overflow-hidden bg-brand px-16 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />
        <h2 className="relative text-4xl font-extrabold leading-tight">
          Answers that bring <span className="text-accent">hope</span> to the hardest places.
        </h2>
        <ul className="relative space-y-5">
          {perks.map((perk) => (
            <li key={perk.text} className="flex items-center gap-4 text-lg">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-accent">{perk.icon}</span>
              {perk.text}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
