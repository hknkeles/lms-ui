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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content area */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6">
          <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
          
          {/* Theme toggle for desktop */}
          <button className="p-2 rounded-md hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <main className="p-6 lg:p-6 pt-24 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
