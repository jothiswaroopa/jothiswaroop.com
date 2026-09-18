import clsx from "clsx";

type Props = {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p";
};

/**
 * Each word rises out of a clipped mask, staggered. The "expensive hero" reveal.
 * Pure CSS (.word-rise keyframes) — it plays as soon as the stylesheet arrives, so the headline is the
 * LCP element on phones *without* waiting for the JS bundle. Same curve/duration/stagger as the framer version.
 * Inline emphasis markers (kept out of the DOM): *word* → accent colour (proof), _word_ → italic (payoff).
 * A run of NBSP-joined words counts as one word so a marked phrase moves together.
 */
function styleWord(raw: string) {
  let w = raw, cls = "";
  if (w.startsWith("*") && w.endsWith("*")) { w = w.slice(1, -1); cls += " text-signal"; }
  if (w.startsWith("_") && w.endsWith("_")) { w = w.slice(1, -1); cls += " italic"; }
  return { w, cls };
}
export default function SplitText({ lines, className, delay = 0, stagger = 0.04, as = "h1" }: Props) {
  const Tag = as;
  let i = 0;
  return (
    <Tag className={clsx(className)}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi) => {
            const idx = i++;
            const { w, cls } = styleWord(word);
            return (
              <span key={wi}>
                <span className="mask-line !inline-block align-baseline">
                  <span className={"word-rise inline-block" + cls} style={{ animationDelay: `${(delay + idx * stagger).toFixed(2)}s` }}>
                    {w}
                  </span>
                </span>
                {wi < line.split(" ").length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
