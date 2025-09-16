"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, requireRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !requireRole('teacher')) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`transition-all duration-300 lg:ml-16`}>
        <ScrollArea className="flex-1">
          <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}


