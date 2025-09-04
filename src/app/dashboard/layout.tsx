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
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const pageTitle = getPageTitle(pathname);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('lms_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    const isDarkMode = theme === 'dark';
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Auth guard - token yoksa login'e yönlendir
  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
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
      <div className="lg:ml-72 transition-all duration-300">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{pageTitle}</h1>
          
          {/* Theme toggle for desktop */}
          <button 
            onClick={() => {
              const newIsDark = !isDark;
              console.log('Layout dark mode toggle:', { current: isDark, new: newIsDark });
              
              setIsDark(newIsDark);
              if (newIsDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('lms_theme', 'dark');
                console.log('Added dark class to document (layout)');
              } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('lms_theme', 'light');
                console.log('Removed dark class from document (layout)');
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Tema değiştir"
          >
            {isDark ? (
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Content */}
        <main className="p-6 lg:p-6 pt-24 lg:pt-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
