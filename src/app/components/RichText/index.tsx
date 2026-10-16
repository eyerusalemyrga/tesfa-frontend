import type { ReactNode } from "react";

// Tesfa AI answers use light markdown: **bold**, "#" headings and "-" / "1." lists.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

const bullet = /^\s*([-*•]|\d+[.)])\s+/;

export default function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => <li key={i}>{inline(item)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={blocks.length} className="list-decimal space-y-1 pl-5">{items}</ol>
      ) : (
        <ul key={blocks.length} className="list-disc space-y-1 pl-5">{items}</ul>
      )
    );
    list = null;
  };

  for (const line of text.split("\n")) {
    const match = line.match(bullet);
    if (match) {
      const ordered = /\d/.test(match[1]);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(line.replace(bullet, ""));
      continue;
    }
    flushList();
    const heading = line.match(/^#{1,6}\s+(.*)/);
    if (heading) {
      blocks.push(<p key={blocks.length} className="font-bold text-brand">{inline(heading[1])}</p>);
    } else if (line.trim()) {
      blocks.push(<p key={blocks.length}>{inline(line)}</p>);
    }
  }
  flushList();

  return <div className="space-y-2 leading-relaxed">{blocks}</div>;
}
