"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface RoleSelectorProps {
  value?: string;
  onChange?: (role: string) => void;
  className?: string;
}

const PRESET_ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "ML Engineer",
  "Designer",
  "Marketing",
];

const RoleSelector = forwardRef<HTMLDivElement, RoleSelectorProps>(
  ({ value, onChange, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        <label className="text-sm font-medium text-text-primary">
          Target Role
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_ROLES.map((role) => {
            const isSelected = value === role;
            return (
              <motion.button
                key={role}
                type="button"
                onClick={() => onChange?.(role)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium",
                  "transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                  isSelected
                    ? "bg-accent text-white"
                    : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated/80 hover:text-text-primary"
                )}
              >
                {role}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }
);

RoleSelector.displayName = "RoleSelector";

export { RoleSelector, PRESET_ROLES };
