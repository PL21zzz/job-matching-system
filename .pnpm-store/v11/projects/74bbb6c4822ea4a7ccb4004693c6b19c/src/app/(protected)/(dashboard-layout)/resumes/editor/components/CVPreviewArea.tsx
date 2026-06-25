"use client";

import { PencilLine } from "lucide-react";
import React from "react";

interface CVPreviewAreaProps {
  cvRef: React.RefObject<HTMLDivElement | null>;
  SelectedTemplateComponent: React.ComponentType<any>;
  cvData: any;
  onChange: (field: string, value: string) => void;
  onBulletChange: (index: number, value: string) => void;
  onProjectChange: (index: number, field: string, value: string) => void;
  onEduChange: (index: number, field: string, value: string) => void;
  onSkillChange: (index: number, field: string, value: string | number) => void;
  onCertChange: (index: number, value: string) => void;
  onAwardChange: (index: number, value: string) => void;
}

export default function CVPreviewArea({
  cvRef,
  SelectedTemplateComponent,
  cvData,
  onChange,
  onBulletChange,
  onProjectChange,
  onEduChange,
  onSkillChange,
  onCertChange,
  onAwardChange,
}: CVPreviewAreaProps) {
  return (
    <div className="flex w-full min-w-0 flex-1 justify-start overflow-auto bg-slate-950 p-3 sm:p-6 xl:justify-center xl:p-10 print:overflow-visible print:bg-white print:p-0">
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

      <div className="w-full max-w-[880px]">
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-cyan-500/15 bg-cyan-500/8 px-4 py-3 text-sm text-cyan-100 print:hidden">
          <PencilLine size={16} className="shrink-0 text-cyan-300" />
          <span>
            Nhấp trực tiếp vào nội dung trên CV để chỉnh. Các thay đổi được cập
            nhật ngay lên bản A4 này.
          </span>
        </div>

        <div
          id="cv-print-zone"
          className="overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/60 print:rounded-none"
        >
          <div ref={cvRef} style={{ width: "794px", minHeight: "1123px" }}>
            <SelectedTemplateComponent
              {...cvData}
              isDemo={false}
              editable
              onFieldChange={onChange}
              onBulletChange={onBulletChange}
              onProjectChange={onProjectChange}
              onEduChange={onEduChange}
              onSkillChange={onSkillChange}
              onCertChange={onCertChange}
              onAwardChange={onAwardChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
