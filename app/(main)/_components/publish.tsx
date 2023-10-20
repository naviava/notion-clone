"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "sonner";

import { Doc } from "@/convex/_generated/dataModel";

import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { api } from "@/convex/_generated/api";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
  initialData: Doc<"documents">;
}

export default function Publish({ initialData }: PublishProps) {
  const origin = useOrigin();
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = useMutation(api.documents.update);

  const url = useMemo(
    () => `${origin}/preview/${initialData._id}`,
    [origin, initialData._id],
  );

  const handlePublish = useCallback(() => {
    setIsSubmitting(true);

    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => setIsSubmitting(false),
    );

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published",
      error: "Failed to publish note",
    });
  }, [initialData._id, update]);

  const handleUnpublish = useCallback(() => {
    setIsSubmitting(true);

    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => setIsSubmitting(false),
    );

    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Note unpublished",
      error: "Failed to unpublish note",
    });
  }, [initialData._id, update]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    toast.success("Copied to clipboard");

    setTimeout(() => setIsCopied(false), 2000);
  }, [url]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Publish
          {initialData.isPublished && (
            <Globe className="ml-2 h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={8} forceMount className="w-72">
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This note is published.
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={url}
                disabled
                className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs"
              />
              <Button
                onClick={handleCopy}
                disabled={isCopied}
                className="h-8 rounded-l-none"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={handleUnpublish}
              className="w-full text-sm"
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Publish this note</p>
            <span className="mb-4 text-xs text-muted-foreground">
              Share your work with others
            </span>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={handlePublish}
              className="w-full text-sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
