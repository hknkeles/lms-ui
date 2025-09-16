"use client";

import React, { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AdminSidebarProvider, useAdminSidebar } from "@/contexts/AdminSidebarContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, requireRole } = useAuth();
  const { sidebarOpen, toggleSidebar } = useAdminSidebar();

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !requireRole('admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className={`transition-all duration-300 ml-16 ${sidebarOpen ? 'lg:ml-[22rem]' : 'lg:ml-16'}`}>
        
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminSidebarProvider>
  );
}


