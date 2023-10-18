"use client";

import { useCallback, useRef, useState } from "react";

import { useMutation } from "convex/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface TitleProps {
  initialData: Doc<"documents">;
}

export default function Title({ initialData }: TitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled");

  const update = useMutation(api.documents.update);

  const enableInput = useCallback(() => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  }, [initialData.title]);

  const disableInput = useCallback(() => setIsEditing(false), []);

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(evt.target.value);
      update({ id: initialData._id, title: evt.target.value || "Untitled" });
    },
    [initialData._id, update],
  );

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Enter") disableInput();
    },
    [disableInput],
  );

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={enableInput}
          className="h-auto p-1 font-normal"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-60 rounded-md" />;
};
