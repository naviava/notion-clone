"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { ImageIcon, X } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";

import { useMutation } from "convex/react";
import { useEdgeStore } from "@/lib/edgestore";
import { useCoverImage } from "@/hooks/use-cover-image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export default function Cover({ url, preview }: CoverProps) {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const handleRemove = useCallback(async () => {
    if (!!url) await edgestore.publicFiles.delete({ url });
    removeCoverImage({ id: params.documentId as Id<"documents"> });
  }, [params.documentId, removeCoverImage, edgestore.publicFiles, url]);

  return (
    <div
      className={cn(
        "group relative h-[35vh] w-full",
        !url && "h-[12vh]",
        !!url && "bg-muted",
      )}
    >
      {!!url && (
        <Image fill src={url} alt="Cover image" className="object-cover" />
      )}
      {!!url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-xs text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />;
};
