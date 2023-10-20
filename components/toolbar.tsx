"use client";

import { ElementRef, useCallback, useRef, useState } from "react";

import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { Doc } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import IconPicker from "./icon-picker";

import { api } from "@/convex/_generated/api";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export default function Toolbar({ initialData, preview }: ToolbarProps) {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const enableInput = useCallback(() => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  }, [initialData.title, preview]);

  const disableInput = useCallback(() => setIsEditing(false), []);

  const handleInput = useCallback(
    (input: string) => {
      setValue(input);
      update({ id: initialData._id, title: input || "Untitled" });
    },
    [initialData._id, update],
  );

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        disableInput();
      }
    },
    [disableInput],
  );

  const handleIconSelect = useCallback(
    (icon: string) => {
      update({ id: initialData._id, icon });
    },
    [initialData._id, update],
  );

  const handleRemoveIcon = useCallback(() => {
    removeIcon({ id: initialData._id });
  }, [initialData._id, removeIcon]);

  return (
    <div className="group relative pl-[54px]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={handleIconSelect}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">{initialData.icon}</p>
      )}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={handleIconSelect}>
            <Button
              variant="outline"
              size="sm"
              className="text-sm text-muted-foreground"
            >
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="text-xs text-muted-foreground"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add cover image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          value={value}
          onKeyDown={handleKeyDown}
          onBlur={disableInput}
          onChange={(evt) => handleInput(evt.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="break-words pb-[11.5px] text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
}
