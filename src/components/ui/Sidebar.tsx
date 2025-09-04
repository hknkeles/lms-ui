"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  MessageSquare,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  Bell,
  Search,
  Shield,
  Palette,
  HelpCircle,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: "/dashboard",
    description: "Genel bakış"
  },
  { 
    icon: BookOpen, 
    label: "Derslerim", 
    href: "/courses",
    description: "Aktif dersler"
  },
  { 
    icon: FileText, 
    label: "Ödevler", 
    href: "/assignments",
    description: "Teslim tarihleri"
  },
  { 
    icon: GraduationCap, 
    label: "Notlar", 
    href: "/grades",
    description: "Başarı durumu"
  },
  { 
    icon: MessageSquare, 
    label: "Mesajlar", 
    href: "/messages",
    description: "Yeni mesajlar"
  },
  { 
    icon: Settings, 
    label: "Ayarlar", 
    href: "/settings",
    description: "Hesap ayarları"
  },
];

const profileMenuItems = [
  {
    icon: User,
    label: "Profil Bilgileri",
    description: "Kişisel bilgileri düzenle",
    href: "/profile",
    color: "text-blue-600"
  },
  {
    icon: Palette,
    label: "Görünüm",
    description: "Tema ve renk ayarları",
    href: "/appearance",
    color: "text-purple-600"
  },
  {
    icon: Shield,
    label: "Güvenlik",
    description: "Şifre ve güvenlik ayarları",
    href: "/security",
    color: "text-green-600"
  },
  {
    icon: Bell,
    label: "Bildirimler",
    description: "Bildirim tercihleri",
    href: "/notifications",
    color: "text-orange-600"
  },
  {
    icon: HelpCircle,
    label: "Yardım & Destek",
    description: "SSS ve iletişim",
    href: "/support",
    color: "text-indigo-600"
  }
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isDark, setIsDark] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Dark mode toggle function
  const toggleDarkMode = () => {
    const newMode = !isDark;
    console.log('Toggling dark mode:', { current: isDark, new: newMode });
    
    setIsDark(newMode);
    localStorage.setItem('lms_theme', newMode ? 'dark' : 'light');
    
    // Apply theme to document
    if (newMode) {
      document.documentElement.classList.add('dark');
      console.log('Added dark class to document');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class from document');
    }
    
    // Force re-render
    setTimeout(() => {
      console.log('Current document classes:', document.documentElement.classList.toString());
    }, 100);
  };

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/60 dark:border-gray-700/60 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                LMS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Learning Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title={isDark ? "Light mode'a geç" : "Dark mode'a geç"}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            {/* Mobile Close Button */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:ring-primary-400/20 dark:focus:border-primary-400 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.label} className="group">
                <a
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group-hover:shadow-md ${
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 text-gray-900 dark:text-white shadow-lg shadow-primary-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-primary-700 dark:hover:text-primary-400 hover:shadow-sm"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-primary-100 dark:bg-primary-800" 
                      : "bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20"
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <span className={`font-semibold text-sm ${
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-gray-100"
                    }`}>
                      {item.label}
                    </span>
                    <p className={`text-xs mt-0.5 ${
                      isActive ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full shadow-sm"></div>
                  )}
                </a>
              </div>
            );
          })}
        </nav>

        {/* Notifications */}
        <div className="px-4 py-3 border-b border-gray-200/60 dark:border-gray-700/60">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl transition-all duration-200 group">
            <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-700 transition-colors duration-200">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">3 yeni bildirim</p>
              <p className="text-xs text-amber-600 dark:text-amber-500">Ödev teslim tarihi yaklaşıyor</p>
            </div>
          </button>
        </div>

        {/* Bottom Section - User Info + Logout */}
        <div className="mt-auto p-4 space-y-3">
          {/* User Info */}
          {user && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={() => setShowProfileModal(true)}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Çevrimiçi</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
              </div>
            </div>
          )}
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 rounded-xl transition-all duration-200 group"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-600 group-hover:bg-red-100 dark:group-hover:bg-red-800 rounded-lg transition-colors duration-200">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfileModal && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileModal(false)}
          />
          
          <div className="absolute bottom-20 left-72 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 z-50 overflow-hidden">
            {/* Dropdown Header */}
            <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Dropdown Content */}
            <div className="p-2">
              {profileMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className={`p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm transition-all duration-200 ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{item.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
                </a>
              ))}
            </div>

            {/* Dropdown Footer */}
            <div className="p-3 border-t border-gray-200/60 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Son giriş: Bugün 14:30</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Top bar for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 z-30 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">LMS</h1>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </>
  );
}
