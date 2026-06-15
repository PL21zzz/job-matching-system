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
    <div className="flex-1 bg-slate-950 p-6 xl:p-10 overflow-y-auto flex justify-center items-start border-l border-slate-800 print:p-0 print:bg-white print:overflow-visible">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-print-zone,
          #cv-print-zone * {
            visibility: visible;
          }
          #cv-print-zone {
            position: absolute;
            left: 0;
            top: 0;
            width: 794px;
            height: 1123px;
            box-shadow: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <div
        id="cv-print-zone"
        className="shadow-2xl shadow-black/60 bg-white rounded-none shrink-0 overflow-hidden"
      >
        <div ref={cvRef} style={{ width: "794px", height: "1123px" }}>
          <SelectedTemplateComponent {...cvData} isDemo={false} />
        </div>
      </div>
    </div>
  );
}
