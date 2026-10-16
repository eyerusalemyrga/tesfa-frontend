import Link from "next/link";
import { FaDove } from "react-icons/fa";

// "Tesfa" is Amharic for hope.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-extrabold ${light ? "text-white" : "text-brand"}`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white">
        <FaDove aria-hidden />
      </span>
      Tesfa
    </Link>
  );
}
