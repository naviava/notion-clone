"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Toolbar from "@/components/toolbar";
import { api } from "@/convex/_generated/api";

interface DocumentIdPageProps {
  params: { documentId: Id<"documents"> };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  if (document === undefined) return <p>Loading...</p>;

  if (document === null) return <div>Not found</div>;

  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
      </div>
    </div>
  );
}