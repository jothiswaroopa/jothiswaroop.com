/** Printer's corner ticks. Drop inside a `.crop` box. */
export default function CropMarks() {
  return (
    <>
      <span className="tick tl" aria-hidden />
      <span className="tick tr" aria-hidden />
      <span className="tick bl" aria-hidden />
      <span className="tick br" aria-hidden />
    </>
  );
}
