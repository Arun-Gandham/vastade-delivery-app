import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type DataTableColumn =
  | string
  | {
      key: string;
      label: string;
      headerClassName?: string;
      cellClassName?: string;
    };

export const DataTable = ({
  columns,
  rows,
  title,
  description,
  actions,
}: {
  columns: DataTableColumn[];
  rows: Array<Record<string, ReactNode>>;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) => {
  const normalizedColumns = columns.map((column) =>
    typeof column === "string" ? { key: column, label: column } : column
  );

  return (
    <Card className="w-full overflow-hidden rounded-[28px] border border-[#e8edf3] bg-white p-0 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
      {title || description || actions ? (
        <div className="flex flex-col gap-4 border-b border-[#eef2f6] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            {title ? <h3 className="text-lg font-bold tracking-[-0.03em] text-[#111827]">{title}</h3> : null}
            {description ? <p className="text-sm text-[#667085]">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#f8fafc]">
            <tr>
              {normalizedColumns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "whitespace-nowrap px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]",
                    column.headerClassName
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef2f6] bg-white">
            {rows.map((row, index) => (
              <tr key={index} className="transition hover:bg-[#fafcff]">
                {normalizedColumns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-5 py-4 align-middle text-sm text-[#111827]", column.cellClassName)}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
