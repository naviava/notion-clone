"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirm-modal";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface BannerProps {
  documentId: Id<"documents">;
}

export default function Banner({ documentId }: BannerProps) {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const handleRemove = useCallback(() => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted",
      error: "Failed to delete note",
    });

    router.push("/documents");
  }, [remove, documentId, router]);

  const handleRestore = useCallback(() => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note Restored",
      error: "Failed to restore note",
    });
  }, [restore, documentId]);

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p>This note is in your Trash!</p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRestore}
        className="h-auto border-white bg-transparent px-2 py-1 font-normal text-white hover:bg-primary/5 hover:text-white"
      >
        Restore note
      </Button>
      <ConfirmModal onConfirm={handleRemove}>
        <Button
          variant="outline"
          size="sm"
          className="h-auto border-white bg-transparent px-2 py-1 font-normal text-white hover:bg-primary/5 hover:text-white"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
}
