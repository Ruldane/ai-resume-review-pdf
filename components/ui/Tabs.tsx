"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

// Tabs Context
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  registerTab: (id: string, element: HTMLButtonElement | null) => void;
  tabRefs: Map<string, HTMLButtonElement | null>;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

// Tabs Root
export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const tabRefs = useRef(new Map<string, HTMLButtonElement | null>());

  const activeTab = value ?? internalValue;

  const setActiveTab = useCallback(
    (id: string) => {
      if (value === undefined) {
        setInternalValue(id);
      }
      onValueChange?.(id);
    },
    [value, onValueChange]
  );

  const registerTab = useCallback(
    (id: string, element: HTMLButtonElement | null) => {
      tabRefs.current.set(id, element);
    },
    []
  );

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab, registerTab, tabRefs: tabRefs.current }}
    >
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// TabList
export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function TabList({ children, className, ...props }: TabListProps) {
  const { activeTab, tabRefs } = useTabsContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeElement = tabRefs.get(activeTab);
    if (activeElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      setIndicatorStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      });
    }
  }, [activeTab, tabRefs]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex gap-1 border-b border-border",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
      {/* Animated indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-accent"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
}

// Tab
export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

function Tab({ value, children, disabled, className, ...props }: TabProps) {
  const { activeTab, setActiveTab, registerTab } = useTabsContext();
  const isActive = activeTab === value;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerTab(value, ref.current);
    return () => registerTab(value, null);
  }, [value, registerTab]);

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-colors relative",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        isActive
          ? "text-text-primary"
          : "text-text-secondary hover:text-text-primary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// TabPanel
export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("py-4", className)}
    >
      {children}
    </motion.div>
  );
}

export { Tabs, TabList, Tab, TabPanel };
