"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular";
  width?: string | number;
  height?: string | number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", width, height }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-bg-elevated",
          variant === "circular" && "rounded-full",
          variant === "text" && "rounded h-4",
          variant === "default" && "rounded-lg",
          className
        )}
        style={{
          width: width ?? undefined,
          height: height ?? undefined,
        }}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Text Preview Skeleton
export interface TextPreviewSkeletonProps {
  lines?: number;
  className?: string;
}

const TextPreviewSkeleton = forwardRef<HTMLDivElement, TextPreviewSkeletonProps>(
  ({ lines = 8, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3 p-4", className)}>
        {/* Header skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={120} height={16} />
        </div>

        {/* Text lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={`${Math.random() * 40 + 60}%`}
            height={14}
          />
        ))}

        {/* Action buttons skeleton */}
        <div className="flex gap-3 mt-6">
          <Skeleton width={100} height={36} className="rounded-lg" />
          <Skeleton width={100} height={36} className="rounded-lg" />
        </div>
      </div>
    );
  }
);

TextPreviewSkeleton.displayName = "TextPreviewSkeleton";

export { Skeleton, TextPreviewSkeleton };
