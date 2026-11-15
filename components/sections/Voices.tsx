import { videoTestimonials } from "@/lib/content";
import VideoTile from "@/components/VideoTile";
import Icon from "@/components/Icon";

/** Clients and partners, on camera. One voice set large beside its video; the rest as a ruled list. */
export default function Voices() {
  const [lead, ...rest] = videoTestimonials;
  return (
    <section className="field relative">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <h2 className="max-w-3xl text-[clamp(1.75rem,4.6vw,4.25rem)]">Clients and partners, on camera.</h2>

        <figure className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <blockquote className="display text-[clamp(1.375rem,3vw,2.75rem)] leading-[1.22]">&ldquo;{lead.quote}&rdquo;</blockquote>
            <figcaption className="mt-6">
              <p className="font-semibold">{lead.name}</p>
              <p className="text-[0.9375rem]">{lead.business}</p>
            </figcaption>
          </div>
          <div className="lg:col-span-4">
            <div className={lead.vertical ? "max-w-[300px] border border-ink lg:ml-auto" : "border border-ink"}>
              <VideoTile youtubeId={lead.youtubeId} poster={lead.poster} title={`${lead.name}, ${lead.business}`} vertical={lead.vertical} />
            </div>
          </div>
        </figure>

        <div className="scotch mt-14" aria-hidden />
        <ul className="m-scroller grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.filter((t) => t.quote).map((t) => (
            <li key={t.youtubeId} className="flex flex-col border-b border-line py-7">
              <blockquote className="text-lg leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
              <p className="mt-5 font-semibold">{t.name}</p>
              <p className="text-sm">{t.business}{t.language ? ` · ${t.language}` : ""}</p>
              <a href={`https://www.youtube.com/watch?v=${t.youtubeId}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold underline">
                <Icon name="play" size={12} /> Watch the video
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
