import Card from "@/src/components/ui/Card";

interface JobContentProps {
  processedDescription: string;
  processedRequirements: string[];
}

export default function JobContent({
  processedDescription,
  processedRequirements,
}: JobContentProps) {
  return (
    <Card layoutClassName="p-6 sm:p-8 space-y-6">
      <div className="h-8 flex items-center border-l-4 border-primary pl-3">
        <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Chi tiết công việc
        </h3>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Mô tả công việc
        </h4>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-justify whitespace-pre-line">
          {processedDescription}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Nhiệm vụ & Yêu cầu
        </h4>
        <ul className="space-y-2.5">
          {processedRequirements.length > 0 ? (
            processedRequirements.map((req: string, index: number) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                <span className="text-primary font-black mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-400 italic">
              Đọc chi tiết tại phần mô tả công việc.
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}
