import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureRow {
  feature: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
  individual: boolean | string;
}

interface FeatureComparisonTableProps {
  title: string;
  features: FeatureRow[];
}

export function FeatureComparisonTable({ title, features }: FeatureComparisonTableProps) {
  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="flex justify-center">
          <Check className="w-5 h-5 text-foreground" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex justify-center">
          <X className="w-5 h-5 text-muted-foreground" />
        </div>
      );
    }
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-semibold text-foreground mb-6">{title}</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary border-b border-border">
              <th className="text-left p-4 font-semibold text-foreground">Feature</th>
              <th className="text-center p-4 font-semibold text-foreground min-w-[100px]">Starter</th>
              <th className="text-center p-4 font-semibold text-foreground min-w-[100px] bg-card">Pro</th>
              <th className="text-center p-4 font-semibold text-foreground min-w-[100px]">Enterprise</th>
              <th className="text-center p-4 font-semibold text-foreground min-w-[100px]">Individuell</th>
            </tr>
          </thead>
          <tbody>
            {features.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-border",
                  index % 2 === 0 ? "bg-card" : "bg-background"
                )}
              >
                <td className="p-4 text-sm text-foreground font-medium">{row.feature}</td>
                <td className="p-4 text-center">{renderCell(row.starter)}</td>
                <td className="p-4 text-center bg-card/50">{renderCell(row.pro)}</td>
                <td className="p-4 text-center">{renderCell(row.enterprise)}</td>
                <td className="p-4 text-center">{renderCell(row.individual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

