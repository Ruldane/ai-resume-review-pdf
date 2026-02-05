"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DropZoneProps {
  onFileSelect?: (file: File) => void;
  onValidationError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  maxSizeMB?: number;
}

const MAX_FILE_SIZE_MB = 5;

const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, onFileSelect, onValidationError, disabled, maxSizeMB = MAX_FILE_SIZE_MB }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback(
      (file: File): string | null => {
        // Check file type
        if (!file.type || file.type !== "application/pdf") {
          // Also check file extension as fallback
          const extension = file.name.split(".").pop()?.toLowerCase();
          if (extension !== "pdf") {
            return "Invalid file type. Please upload a PDF file.";
          }
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          return `File too large. Maximum size is ${maxSizeMB}MB.`;
        }

        return null;
      },
      [maxSizeMB]
    );

    const handleFile = useCallback(
      (file: File) => {
        const error = validateFile(file);
        if (error) {
          onValidationError?.(error);
          return;
        }
        onFileSelect?.(file);
      },
      [validateFile, onValidationError, onFileSelect]
    );

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set to false if leaving the drop zone entirely
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
        setIsDragOver(false);
      }
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          handleFile(files[0]);
        }
      },
      [disabled, handleFile]
    );

    const handleClick = useCallback(() => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, [disabled]);

    const handleFileInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleFile(files[0]);
        }
        // Reset input so the same file can be selected again
        e.target.value = "";
      },
      [handleFile]
    );

    return (
      <motion.div
        ref={ref}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragOver ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4",
          "w-full p-12 rounded-[var(--radius-card)]",
          "border-2 border-dashed border-border",
          "bg-bg-card/50 hover:bg-bg-card",
          "transition-colors duration-200 ease-out",
          "cursor-pointer",
          isDragOver && "bg-accent/5 border-accent",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Icon */}
        <motion.div
          animate={{
            scale: isDragOver ? 1.1 : 1,
            y: isDragOver ? -4 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full",
            isDragOver ? "bg-accent/20" : "bg-bg-elevated"
          )}
        >
          <Upload
            className={cn(
              "w-8 h-8 transition-colors",
              isDragOver ? "text-accent" : "text-text-secondary"
            )}
          />
        </motion.div>

        {/* Main Text */}
        <div className="text-center">
          <p
            className={cn(
              "font-medium transition-colors",
              isDragOver ? "text-accent" : "text-text-primary"
            )}
          >
            {isDragOver
              ? "Drop your file here"
              : "Drop your resume here or click to browse"}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            PDF only &bull; Max 5MB
          </p>
        </div>

        {/* Pulse animation when dragging */}
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-[var(--radius-card)] border-2 border-accent animate-pulse pointer-events-none"
          />
        )}
      </motion.div>
    );
  }
);

DropZone.displayName = "DropZone";

export { DropZone };
