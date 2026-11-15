/**
 * Was a text-scramble effect on every section label. On the rate card a label is printed, not decoded,
 * so this is now plain text; the leading "// " the old labels carried is dropped here, once.
 */
export default function Scramble({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{text.replace(/^\/\/\s*/, "")}</span>;
}
