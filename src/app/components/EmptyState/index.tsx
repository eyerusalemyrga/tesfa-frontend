import { FaDove } from "react-icons/fa";

const suggestions = [
  "Which countries face the highest conflict risk?",
  "What are the health consequences of conflict in the United Kingdom?",
  "Show stats for America",
  "How many refugees has the war in Ukraine produced?",
];

export default function EmptyState({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center">
      <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-2xl text-white">
        <FaDove aria-hidden />
      </span>
      <h1 className="text-3xl font-extrabold text-brand sm:text-4xl">What would you like to know?</h1>
      <p className="mt-3 text-gray-600">
        Ask Tesfa AI about conflicts, their risk and their consequences for people&apos;s health.
      </p>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {suggestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onPick(question)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition hover:border-accent hover:bg-accent-soft/40"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
