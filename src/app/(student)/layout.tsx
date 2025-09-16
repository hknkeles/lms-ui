"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/student/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/courses":
      return "Derslerim";
    case "/schedule":
      return "Ders Programı";
    case "/assignments":
      return "Ödevler";
    case "/grades":
      return "Notlar";
    case "/messages":
      return "Mesajlar";
    case "/settings":
      return "Ayarlar";
    default:
      return "Dashboard";
  }
};

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, requireRole } = useAuth();
  const pageTitle = getPageTitle(pathname);

  // Auth guard - token yoksa login'e yönlendir
  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading durumunda loading göster
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

  // Authenticated değilse hiçbir şey render etme (redirect olacak)
  if (!isAuthenticated() || !requireRole('student')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content area */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-[22rem]' : 'lg:ml-16'
      }`}>
        {/* Content */}
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}
