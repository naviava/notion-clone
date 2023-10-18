"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";
import { Divide, Search, Trash, Undo } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";

import { useMutation, useQuery } from "convex/react";

import Spinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import ConfirmModal from "@/components/modals/confirm-modal";

import { api } from "@/convex/_generated/api";

interface TrashBoxProps {}

export default function TrashBox({}: TrashBoxProps) {
  const router = useRouter();
  const params = useParams();

  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = useMemo(
    () =>
      documents?.filter((document) =>
        document.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [documents, search],
  );

  const handleClick = useCallback(
    (documentId: string) => router.push(`/documents/${documentId}`),
    [router],
  );

  const onRestore = useCallback(
    (
      evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
      documentId: Id<"documents">,
    ) => {
      evt.stopPropagation();
      const promise = restore({ id: documentId });

      toast.promise(promise, {
        loading: "Restoring note...",
        success: "Restored note",
        error: "Failed to restore note",
      });
    },
    [restore],
  );

  const onRemove = useCallback(
    (documentId: Id<"documents">) => {
      const promise = remove({ id: documentId });

      toast.promise(promise, {
        loading: "Deleting note...",
        success: "Note deleted",
        error: "Failed to delete note",
      });

      if (params.documentId === documentId) router.push("/documents");
    },
    [remove, params.documentId, router],
  );

  if (documents === undefined)
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(evt) => evt.target.value}
          placeholder="Filter by page title..."
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden pb-2 text-center text-xs text-muted-foreground last:block">
          No documents found
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => handleClick(document._id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                role="button"
                onClick={(evt) => onRestore(evt, document._id)}
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
