"use client";

import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";

import { toast } from "sonner";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";

import { useMutation } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DocumentList from "./document-list";
import UserItem from "./user-item";
import TrashBox from "./trash-box";
import Navbar from "./navbar";
import Item from "./item";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

export default function Navigation() {
  const params = useParams();
  const pathname = usePathname();
  const { onOpen: openSearch } = useSearch();
  const { onOpen: openSettings } = useSettings();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  function handleMouseDown(evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    evt.preventDefault();
    evt.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(evt: MouseEvent) {
    if (!isResizingRef.current) return;

    let newWidth = evt.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  }

  function handleMouseUp() {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => setIsResetting(false), 300);
    }
  }, [isMobile]);

  const collapseSidebar = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => setIsResetting(false), 300);
    }
  }, []);

  const handleCreate = useCallback(() => {
    const promise = create({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new note",
      success: "New note created",
      error: "Failed to create new note",
    });
  }, [create]);

  useEffect(() => {
    if (isMobile) collapseSidebar();
    else resetWidth();
  }, [isMobile, collapseSidebar, resetWidth]);

  useEffect(() => {
    if (isMobile) collapseSidebar();
  }, [isMobile, collapseSidebar, pathname]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary",
          isResetting && " transition-all duration-300 ease-in-out",
          isMobile && "w-0",
        )}
      >
        <div
          role="button"
          onClick={collapseSidebar}
          className={cn(
            "absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" onClick={openSearch} icon={Search} isSearch />
          <Item label="Settings" onClick={openSettings} icon={Settings} />
          <Item label="New page" onClick={handleCreate} icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item label="Add a page" onClick={handleCreate} icon={Plus} />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-0 z-[99999] w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full",
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && (
              <MenuIcon
                role="button"
                onClick={resetWidth}
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
