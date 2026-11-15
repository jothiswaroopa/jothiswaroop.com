type Name = "arrow" | "arrow-up-right" | "arrow-left" | "arrow-down" | "check" | "plus" | "play" | "x";

const PATHS: Record<Name, string> = {
  arrow: "M2 8h11M9 4l4 4-4 4",
  "arrow-up-right": "M4 12l8-8M6 4h6v6",
  "arrow-left": "M14 8H3M7 4L3 8l4 4",
  "arrow-down": "M8 2v11M4 9l4 4 4-4",
  check: "M3 8.5l3.2 3.2L13 5",
  plus: "M8 3v10M3 8h10",
  play: "M5 3v10l8-5z",
  x: "M4 4l8 8M12 4l-8 8",
};

/** One drawn icon set: 16px grid, 1.5 stroke, square ends, the weight of the card's hairline rules. */
export default function Icon({ name, size = 16, className }: { name: Name; size?: number; className?: string }) {
  const solid = name === "play";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={solid ? "currentColor" : "none"} stroke={solid ? "none" : "currentColor"} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}
