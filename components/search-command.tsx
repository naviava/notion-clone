"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { useSearch } from "@/hooks/use-search";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { api } from "@/convex/_generated/api";
import { File } from "lucide-react";

export default function SearchCommand() {
  const router = useRouter();
  const { user } = useUser();

  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onClose, toggle } = useSearch();

  const documents = useQuery(api.documents.getSearch);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    function down(evt: KeyboardEvent) {
      if (evt.key === "k" && (evt.metaKey || evt.ctrlKey)) {
        evt.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const handleSelect = useCallback(
    (id: string) => {
      router.push(`/documents/${id}`);
      onClose();
    },
    [router, onClose],
  );

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.firstName}'s Quickscribe`} />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={handleSelect}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
