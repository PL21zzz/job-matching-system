"use client";

import EmployerComparison from "@/src/components/sections/employer/EmployerComparison";
import EmployerFeatures from "@/src/components/sections/employer/EmployerFeatures";
import EmployerHero from "@/src/components/sections/employer/EmployerHero";
import EmployerSteps from "@/src/components/sections/employer/EmployerSteps";

export default function EmployerPage() {
  return (
    <div className="transition-colors duration-300 bg-white dark:bg-secondary min-h-screen">
      <EmployerHero />
      <EmployerComparison />
      <EmployerFeatures />
      <EmployerSteps />
    </div>
  );
}
