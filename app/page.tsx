import Hero from "@/components/sections/Hero";
import Specimens from "@/components/sections/Specimens";
import Figures from "@/components/sections/Figures";
import Timetable from "@/components/sections/Timetable";
import Voices from "@/components/sections/Voices";
import Issuer from "@/components/sections/Issuer";
import Terms from "@/components/sections/Terms";
import Close from "@/components/sections/Close";

/**
 * The homepage is the rate card: the opening and the rates, the specimens, the audited figures, how an
 * engagement runs, the voices, who issues it, the terms, and the reply card.
 * The longer sections it used to carry live on their own pages now: /work/ (every case, every screenshot,
 * every testimonial), /about (the referral chain, recognition), /services/ (what you were sold, the method),
 * /systems/ (the automations), /india/ (the Accelerator), /apply (the full application), /blog/.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Specimens />
      <Figures />
      <Timetable />
      <Voices />
      <Issuer />
      <Terms />
      <Close />
    </>
  );
}
