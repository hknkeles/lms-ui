"use client";

import React from "react";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 fixed inset-0 z-50">
        {children}
      </div>
    </SidebarProvider>
  );
}
