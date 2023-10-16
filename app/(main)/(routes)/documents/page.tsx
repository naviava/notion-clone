"use client";

import { useCallback } from "react";
import Image from "next/image";

import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";

import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface DocumentPageProps {}

export default function DocumentPage({}: DocumentPageProps) {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = useCallback(() => {
    const promise = create({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note",
      success: "New note created",
      error: "Failed to create new note",
    });
  }, [create]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty document"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty document"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Quickscribe
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a note
      </Button>
    </div>
  );
}
