"use client";

import React from "react";

interface CVPreviewAreaProps {
  cvRef: React.RefObject<HTMLDivElement | null>;
  SelectedTemplateComponent: React.ComponentType<any>;
  cvData: any;
}

export default function CVPreviewArea({
  cvRef,
  SelectedTemplateComponent,
  cvData,
}: CVPreviewAreaProps) {
  return (
    <div className="flex-1 bg-slate-950 p-6 xl:p-10 overflow-y-auto flex justify-center items-start">
      <div className="shadow-2xl shadow-black/60 bg-white rounded-none shrink-0 overflow-hidden">
        <div ref={cvRef}>
          <SelectedTemplateComponent {...cvData} isDemo={false} />
        </div>
      </div>
    </div>
  );
}
