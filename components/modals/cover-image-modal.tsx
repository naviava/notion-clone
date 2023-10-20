"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";

import { Id } from "@/convex/_generated/dataModel";

import { useMutation } from "convex/react";
import { useEdgeStore } from "@/lib/edgestore";
import { useCoverImage } from "@/hooks/use-cover-image";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import { SingleImageDropzone } from "../single-image-dropzone";

export default function CoverImageModal() {
  const params = useParams();
  const coverImage = useCoverImage();

  const { edgestore } = useEdgeStore();
  const update = useMutation(api.documents.update);

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  }, [coverImage]);

  const handleChange = useCallback(
    async (file?: File) => {
      if (!!file) {
        setIsSubmitting(true);
        setFile(file);

        const res = await edgestore.publicFiles.upload({
          file,
          options: { replaceTargetUrl: coverImage.url },
        });

        await update({
          id: params.documentId as Id<"documents">,
          coverImage: res.url,
        });

        coverImage.onClose();
      }

      setIsSubmitting(false);
      setFile(undefined);
    },
    [edgestore.publicFiles, params.documentId, update, coverImage],
  );

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">CoverImage</h2>
        </DialogHeader>
        <div>
          <SingleImageDropzone
            value={file}
            disabled={isSubmitting}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
