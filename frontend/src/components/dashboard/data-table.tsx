import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export const DataTable = ({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Record<string, ReactNode>>;
}) => (
  <Card className="overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--color-border)]">
        <thead className="bg-[var(--color-muted)]">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-white">
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 text-sm text-[var(--color-text)]">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
