"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

const FilePreview = forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center gap-4 p-4 rounded-[var(--radius-card)]",
          "bg-bg-card border border-border",
          className
        )}
      >
        {/* PDF Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
          <FileText className="w-6 h-6 text-accent" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary truncate">{file.name}</p>
          <p className="text-sm text-text-secondary">
            {formatFileSize(file.size)}
          </p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="shrink-0"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }
);

FilePreview.displayName = "FilePreview";

export { FilePreview };
