import Button from "@/components/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <h1 className="tracking-display mt-6 text-[clamp(2.75rem,8vw,6rem)]">This page isn&apos;t a lead either.</h1>
        <p className="mt-6 max-w-lg text-ink">The link is wrong or the page moved. Everything worth seeing is one click away.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/">Back to the results</Button>
          <Button href="/audit" variant="ghost">Run the free audit</Button>
        </div>
      </div>
    </section>
  );
}
