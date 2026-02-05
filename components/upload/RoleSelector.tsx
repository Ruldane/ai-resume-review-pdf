"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil } from "lucide-react";
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
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const isCustomRole = value && !PRESET_ROLES.includes(value);

    useEffect(() => {
      if (isCustomMode && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isCustomMode]);

    const handleCustomClick = () => {
      setIsCustomMode(true);
      setCustomValue(isCustomRole ? value : "");
    };

    const handleCustomSubmit = () => {
      if (customValue.trim()) {
        onChange?.(customValue.trim());
      }
      setIsCustomMode(false);
    };

    const handleCustomCancel = () => {
      setIsCustomMode(false);
      setCustomValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCustomSubmit();
      } else if (e.key === "Escape") {
        handleCustomCancel();
      }
    };

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
                onClick={() => {
                  setIsCustomMode(false);
                  onChange?.(role);
                }}
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

          {/* Custom Role Button/Input */}
          <AnimatePresence mode="wait">
            {isCustomMode ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-1"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleCustomSubmit}
                  placeholder="Enter custom role..."
                  className={cn(
                    "px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium",
                    "bg-bg-elevated text-text-primary placeholder:text-text-secondary",
                    "border border-accent",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary",
                    "min-w-[150px]"
                  )}
                />
                <motion.button
                  type="button"
                  onClick={handleCustomCancel}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                type="button"
                onClick={handleCustomClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium",
                  "transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                  "flex items-center gap-2",
                  isCustomRole
                    ? "bg-accent text-white"
                    : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated/80 hover:text-text-primary border border-dashed border-border"
                )}
              >
                <Pencil className="w-3.5 h-3.5" />
                {isCustomRole ? value : "Custom"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

RoleSelector.displayName = "RoleSelector";

export { RoleSelector, PRESET_ROLES };
