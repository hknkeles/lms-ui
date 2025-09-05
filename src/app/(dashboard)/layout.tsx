"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { useAuth } from "@/hooks/useAuth";

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/courses":
      return "Derslerim";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Desktop'ta varsayılan olarak kapalı
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Authenticated değilse hiçbir şey render etme (redirect olacak)
  if (!isAuthenticated()) {
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
        <main className="p-8 lg:p-10 pt-8 lg:pt-10 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
