"use client";

import React from "react";

interface TableLayoutProps {
  data: any[];
  headers: string[];
  renderRow: (item: any) => React.ReactNode;
}

export function TableLayout({ data, headers, renderRow }: TableLayoutProps) {
  if (data.length === 0) {
    return (
      <div className="p-10 text-center text-xs font-bold text-slate-400 select-none">
        Hệ thống trống rỗng hoặc không tìm thấy dữ liệu bộ lọc.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase border-b select-none">
            {headers.map((h, idx) => (
              <th key={idx} className="p-4">
                {h}
              </th>
            ))}
            <th className="p-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}
