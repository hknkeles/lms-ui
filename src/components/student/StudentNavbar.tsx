"use client";

import { Maximize } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

interface StudentNavbarProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  breadcrumb?: {
    items: Array<{
      label: string;
      href?: string;
      icon?: React.ReactNode;
      active?: boolean;
    }>;
  };
}

export default function StudentNavbar({ title, subtitle, icon, breadcrumb }: StudentNavbarProps) {
  const { sidebarOpen } = useSidebar();

  return (
    <div className={`fixed top-0 z-30 transition-all duration-300 ${
      sidebarOpen ? 'left-[22rem] right-0' : 'left-16 right-0'
    }`}>
      {/* Navbar */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                {icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Maximize className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Tam Ekran
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="bg-gradient-to-r from-muted/30 to-muted/20 border-b border-border/50 shadow-sm backdrop-blur-sm">
          <div className="px-4 py-2">
            <nav className="flex items-center space-x-0.5 text-xs" aria-label="Breadcrumb">
              {breadcrumb.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="h-3 w-3 text-gray-400 dark:text-gray-500 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 group"
                    >
                      {item.icon && <span className="group-hover:scale-110 transition-transform duration-200">{item.icon}</span>}
                      <span className="font-medium">{item.label}</span>
                    </a>
                  ) : (
                    <div className="flex items-center space-x-1 text-gray-900 dark:text-gray-100 font-semibold">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>{item.label}</span>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
