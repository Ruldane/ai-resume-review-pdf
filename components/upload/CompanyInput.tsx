"use client";

import { forwardRef } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CompanyInputProps {
  value?: string;
  onChange?: (company: string) => void;
  className?: string;
}

const CompanyInput = forwardRef<HTMLDivElement, CompanyInputProps>(
  ({ value = "", onChange, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
          <Building2 className="w-4 h-4 text-text-secondary" />
          Target Company
          <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="e.g., Google, OpenAI"
          className={cn(
            "w-full px-4 py-2.5 rounded-[var(--radius-card)] text-sm",
            "bg-bg-elevated text-text-primary placeholder:text-text-secondary",
            "border border-border",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary",
            "transition-colors duration-150"
          )}
        />
      </div>
    );
  }
);

CompanyInput.displayName = "CompanyInput";

export { CompanyInput };
