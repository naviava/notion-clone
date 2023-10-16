"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { FileIcon } from "lucide-react";

import { Doc, Id } from "@/convex/_generated/dataModel";

import { useQuery } from "convex/react";

import Item from "./item";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

interface DocumentListProps {
  data?: Doc<"documents">[];
  parentDocumentId?: Id<"documents">;
  level?: number;
}

export default function DocumentList({
  parentDocumentId,
  level = 0,
}: DocumentListProps) {
  const router = useRouter();
  const params = useParams();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = useCallback(
    (documentId: string) =>
      setExpanded((prev) => ({ ...prev, [documentId]: !prev[documentId] })),
    [],
  );

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = useCallback(
    (documentId: string) => router.push(`/documents/${documentId}`),
    [router],
  );

  if (documents === undefined)
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden",
        )}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}
