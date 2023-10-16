"use client";

import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface ItemProps {
  id?: Id<"documents">;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
  documentIcon?: string;
  active?: boolean;
  onExpand?: () => void;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
}

export default function Item({
  id,
  label,
  onClick,
  icon: Icon,
  documentIcon,
  active,
  onExpand,
  expanded,
  isSearch,
  level = 0,
}: ItemProps) {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      role="button"
      onClick={onClick}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group flex min-h-[27px] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary",
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={() => {}}
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="mr-2 h-[18px] shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl</span>+ K
        </kbd>
      )}
    </div>
  );
}
