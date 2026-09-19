import Hero from "@/components/sections/Hero";
import Receipts from "@/components/sections/Receipts";
import Who from "@/components/sections/Who";
import Services from "@/components/sections/Services";
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

export default function Home() {
  return (
    <>
      <Hero />
      <Receipts />
      <Chain />
      <Who />
      <Services />
      <Burn />
      <Method />
      <Work />
      <Systems />
      <Testimonials />
      <Filter />
      <Accelerator />
      <Faq />
      <ApplySection />
      <Notes />
    </>
  );
}
