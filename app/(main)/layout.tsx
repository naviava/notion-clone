"use client";

import { redirect } from "next/navigation";

import { useConvexAuth } from "convex/react";

import Spinner from "@/components/spinner";
import Navigation from "./_components/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (!isAuthenticated) return redirect("/");

  return (
    <div className="flex h-full dark:bg-[#1f1f1f]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
