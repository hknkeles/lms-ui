"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminSidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // localStorage'dan sidebar durumunu yükle
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('admin_sidebar_open');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    // localStorage'a kaydet
    localStorage.setItem('admin_sidebar_open', JSON.stringify(newState));
  };

  const setSidebarOpenWithPersistence = (open: boolean) => {
    setSidebarOpen(open);
    // localStorage'a kaydet
    localStorage.setItem('admin_sidebar_open', JSON.stringify(open));
  };

  return (
    <AdminSidebarContext.Provider value={{ 
      sidebarOpen, 
      setSidebarOpen: setSidebarOpenWithPersistence, 
      toggleSidebar 
    }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error("useAdminSidebar must be used within an AdminSidebarProvider");
  }
  return context;
}
