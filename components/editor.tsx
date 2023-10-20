"use client";

import { useCallback } from "react";

import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  initialContent?: string;
  editable?: boolean;
  onChange: (value: string) => void;
}

export default function Editor({
  initialContent,
  editable,
  onChange,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = useCallback(
    async (file: File) => {
      const res = await edgestore.publicFiles.upload({ file });
      return res.url;
    },
    [edgestore.publicFiles],
  );

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor) =>
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2)),
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
