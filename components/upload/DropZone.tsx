"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DropZoneProps extends HTMLAttributes<HTMLDivElement> {
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}

const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, onFileSelect, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4",
          "w-full p-12 rounded-[var(--radius-card)]",
          "border-2 border-dashed border-border",
          "bg-bg-card/50 hover:bg-bg-card",
          "transition-all duration-200 ease-out",
          "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {/* Upload Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-bg-elevated">
          <Upload className="w-8 h-8 text-text-secondary" />
        </div>

        {/* Main Text */}
        <div className="text-center">
          <p className="text-text-primary font-medium">
            Drop your resume here or click to browse
          </p>
          <p className="text-text-secondary text-sm mt-1">
            PDF only &bull; Max 5MB
          </p>
        </div>
      </div>
    );
  }
);

DropZone.displayName = "DropZone";

export { DropZone };
