"use client";

import AboutTech from "@/src/components/sections/about/AboutAccessibility";
import AboutAI from "@/src/components/sections/about/AboutAI";
import AboutHero from "@/src/components/sections/about/AboutHero";
import AboutImpact from "@/src/components/sections/about/AboutImpact";
import AboutPhilosophy from "@/src/components/sections/about/AboutPhilosophy";
import AboutStats from "@/src/components/sections/about/AboutStats";

export default function AboutPage() {
  return (
    <div className="transition-colors duration-300 bg-white dark:bg-secondary min-h-screen">
      <AboutHero />
      <AboutStats />
      <AboutAI />
      <AboutPhilosophy />
      <AboutTech />
      <AboutImpact />
    </div>
  );
}
