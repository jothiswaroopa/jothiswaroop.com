import Hero from "@/components/sections/Hero";
import Receipts from "@/components/sections/Receipts";
import Who from "@/components/sections/Who";
import Services from "@/components/sections/Services";
import Offers from "@/components/sections/Offers";
import Burn from "@/components/sections/Burn";
import Method from "@/components/sections/Method";
import Work from "@/components/sections/Work";
import Systems from "@/components/sections/Systems";
import Chain from "@/components/sections/Chain";
import Testimonials from "@/components/sections/Testimonials";
import Filter from "@/components/sections/Filter";
import Faq from "@/components/sections/Faq";
import Accelerator from "@/components/sections/Accelerator";
import ApplySection from "@/components/sections/ApplySection";
import Notes from "@/components/sections/Notes";
import IndiaOnly from "@/components/IndiaOnly";

export default function Home() {
  return (
    <>
      <Hero />
      <Receipts />
      <Chain />
      <Who />
      <Services />
      <Offers />
      <Burn />
      <Method />
      <Work />
      <Systems />
      <Testimonials />
      <Filter />
      {/* An in-person week in Chennai: noise to a buyer abroad. */}
      <IndiaOnly><Accelerator /></IndiaOnly>
      <Faq />
      <ApplySection />
      <Notes />
    </>
  );
}
