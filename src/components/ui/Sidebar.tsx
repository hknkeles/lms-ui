"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
  ChevronLeft,
  Clock,
  CheckCircle,
  BarChart3,
  Megaphone,
  Users,
  Eye,
  BookOpenCheck,
  CalendarDays,
  FileVideo,
  Link as LinkIcon,
  TrendingUp,
  Award,
  PieChart,
  MessageCircle,
  AlertCircle,
  Home,
  FolderOpen,
  ClipboardList,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuCategories = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-blue-600",
    items: [
      { label: "Genel Bakış", href: "/", description: "Ana sayfa", icon: Home }
    ]
  },
  {
    id: "courses",
    icon: BookOpen,
    label: "Dersler",
    color: "text-green-600",
    items: [
      { label: "Tüm Derslerim", href: "/courses", description: "Aktif dersler", icon: BookOpenCheck },
      { label: "Ders Programı", href: "/schedule", description: "Haftalık program", icon: CalendarDays },
      { label: "Ders Materyalleri", href: "/courses/materials", description: "PDF, video, linkler", icon: FolderOpen }
    ]
  },
  {
    id: "assignments",
    icon: FileText,
    label: "Ödevler",
    color: "text-orange-600",
    items: [
      { label: "Yaklaşan Ödevler", href: "/assignments", description: "Teslim tarihleri", icon: Clock },
      { label: "Tamamlanan", href: "/assignments/completed", description: "Bitirilen ödevler", icon: CheckCircle },
      { label: "Ödev Takvimi", href: "/assignments/calendar", description: "Aylık görünüm", icon: CalendarDays }
    ]
  },
  {
    id: "grades",
    icon: GraduationCap,
    label: "Notlar",
    color: "text-purple-600",
    items: [
      { label: "Genel Başarı", href: "/grades", description: "Ortalama notlar", icon: TrendingUp },
      { label: "Sınav Sonuçları", href: "/grades/exams", description: "Test sonuçları", icon: Award },
      { label: "Başarı Grafiği", href: "/grades/chart", description: "Görsel analiz", icon: BarChart3 }
    ]
  },
  {
    id: "communication",
    icon: MessageSquare,
    label: "İletişim",
    color: "text-indigo-600",
    items: [
      { label: "Mesajlar", href: "/messages", description: "Yeni mesajlar", icon: MessageCircle },
      { label: "Duyurular", href: "/announcements", description: "Önemli duyurular", icon: Megaphone },
      { label: "Forum", href: "/forum", description: "Öğrenci forumu", icon: Users }
    ]
  }
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
    icon: Settings,
    label: "Ayarlar",
    description: "Genel ayarlar ve tercihler",
    href: "/settings",
    color: "text-gray-600"
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['dashboard']);
  const [selectedCategory, setSelectedCategory] = useState<string>('dashboard');
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Select category and toggle sidebar
  const selectCategory = (categoryId: string) => {
    // Eğer aynı kategori seçiliyorsa sidebar'ı kapat
    if (selectedCategory === categoryId && isOpen) {
      onToggle();
    } else {
      // Farklı kategori seçiliyorsa kategoriyi değiştir ve sidebar'ı aç
      setSelectedCategory(categoryId);
      if (!isOpen) {
        onToggle();
      }
    }
  };

  // Auto-expand category based on current path
  useEffect(() => {
    const currentCategory = menuCategories.find(cat => 
      pathname.startsWith(`/${cat.id}`) || pathname.startsWith(`/${cat.id}/`)
    );
    
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
      if (!expandedCategories.includes(currentCategory.id)) {
        setExpandedCategories(prev => [...prev, currentCategory.id]);
      }
    }
  }, [pathname, expandedCategories]);

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
      {/* Minimal Icon Sidebar - Sol tarafta her zaman sabit */}
      <div className="fixed left-0 top-0 h-full w-16 bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/60 z-50 flex flex-col items-center py-4 shadow-lg">
        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
          <span className="text-white font-bold text-lg">L</span>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 space-y-2">
          {menuCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const tooltipWidth = 200; // Tooltip genişliği tahmini
                  const tooltipHeight = 40; // Tooltip yüksekliği tahmini
                  
                  // Ekran sınırlarını kontrol et
                  let x = rect.right + 12;
                  let y = rect.top + rect.height / 2;
                  
                  // Sağa taşma kontrolü
                  if (x + tooltipWidth > window.innerWidth) {
                    x = rect.left - tooltipWidth - 12;
                  }
                  
                  // Yukarı taşma kontrolü
                  if (y - tooltipHeight / 2 < 0) {
                    y = tooltipHeight / 2 + 10;
                  }
                  
                  // Aşağı taşma kontrolü
                  if (y + tooltipHeight / 2 > window.innerHeight) {
                    y = window.innerHeight - tooltipHeight / 2 - 10;
                  }
                  
                  setTooltip({
                    text: category.label,
                    x: x,
                    y: y
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                  isActive
                    ? "bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                <category.icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle Button */}
        <div className="mt-4">
          <button
            onClick={onToggle}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const tooltipWidth = 200;
              const tooltipHeight = 40;
              
              let x = rect.right + 12;
              let y = rect.top + rect.height / 2;
              
              if (x + tooltipWidth > window.innerWidth) {
                x = rect.left - tooltipWidth - 12;
              }
              
              if (y - tooltipHeight / 2 < 0) {
                y = tooltipHeight / 2 + 10;
              }
              
              if (y + tooltipHeight / 2 > window.innerHeight) {
                y = window.innerHeight - tooltipHeight / 2 - 10;
              }
              
              setTooltip({
                text: isOpen ? "Detaylı sidebar'ı kapat" : "Detaylı sidebar'ı aç",
                x: x,
                y: y
              });
            }}
            onMouseLeave={() => setTooltip(null)}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
          >
            <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const tooltipWidth = 200;
              const tooltipHeight = 40;
              
              let x = rect.right + 12;
              let y = rect.top + rect.height / 2;
              
              if (x + tooltipWidth > window.innerWidth) {
                x = rect.left - tooltipWidth - 12;
              }
              
              if (y - tooltipHeight / 2 < 0) {
                y = tooltipHeight / 2 + 10;
              }
              
              if (y + tooltipHeight / 2 > window.innerHeight) {
                y = window.innerHeight - tooltipHeight / 2 - 10;
              }
              
              setTooltip({
                text: isDark ? "Light mode'a geç" : "Dark mode'a geç",
                x: x,
                y: y
              });
            }}
            onMouseLeave={() => setTooltip(null)}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                text: "3 yeni bildirim",
                x: rect.right + 12,
                y: rect.top + rect.height / 2
              });
            }}
            onMouseLeave={() => setTooltip(null)}
            className="relative w-12 h-12 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          {user && (
            <button
              onClick={() => setShowProfileModal(true)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const tooltipWidth = 200;
                const tooltipHeight = 40;
                
                let x = rect.right + 12;
                let y = rect.top + rect.height / 2;
                
                if (x + tooltipWidth > window.innerWidth) {
                  x = rect.left - tooltipWidth - 12;
                }
                
                if (y - tooltipHeight / 2 < 0) {
                  y = tooltipHeight / 2 + 10;
                }
                
                if (y + tooltipHeight / 2 > window.innerHeight) {
                  y = window.innerHeight - tooltipHeight / 2 - 10;
                }
                
                setTooltip({
                  text: "Profil",
                  x: x,
                  y: y
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <User className="h-5 w-5" />
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const tooltipWidth = 200;
              const tooltipHeight = 40;
              
              let x = rect.right + 12;
              let y = rect.top + rect.height / 2;
              
              if (x + tooltipWidth > window.innerWidth) {
                x = rect.left - tooltipWidth - 12;
              }
              
              if (y - tooltipHeight / 2 < 0) {
                y = tooltipHeight / 2 + 10;
              }
              
              if (y + tooltipHeight / 2 > window.innerHeight) {
                y = window.innerHeight - tooltipHeight / 2 - 10;
              }
              
              setTooltip({
                text: "Çıkış Yap",
                x: x,
                y: y
              });
            }}
            onMouseLeave={() => setTooltip(null)}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile overlay - sadece detaylı sidebar açıkken */}
      {isOpen && (
        <div
          className="fixed top-0 left-16 right-0 bottom-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Detailed Sidebar - Sağa doğru açılan */}
      <div
        className={`fixed left-16 top-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/60 dark:border-gray-700/60 z-60 transform transition-all duration-300 ease-in-out shadow-xl flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {menuCategories.find(cat => cat.id === selectedCategory)?.label || 'LMS'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Learning Platform</p>
          </div>
        </div>

        {/* Navigation - Scrollable Area */}
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            {/* Selected Category Items */}
            {(() => {
              const category = menuCategories.find(cat => cat.id === selectedCategory);
              if (!category) return null;
              
              return (
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-primary-50/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-700/50 shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-primary-600 dark:hover:text-primary-400 hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-100/60 dark:bg-primary-800/40" 
                            : "bg-gray-100/60 dark:bg-gray-700/40 group-hover:bg-primary-50/60 dark:group-hover:bg-primary-900/20"
                        }`}>
                          {item.icon && <item.icon className={`h-4 w-4 transition-colors duration-200 ${
                            isActive 
                              ? "text-primary-600 dark:text-primary-400" 
                              : "text-gray-600 dark:text-gray-400"
                          }`} />}
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
                          <div className="w-1.5 h-1.5 bg-primary-500/80 dark:bg-primary-400/80 rounded-full"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })()}
          </nav>
        </ScrollArea>

        {/* Bottom Section - User Info + Logout */}
        <div className="p-4 space-y-3 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 flex-shrink-0">
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
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-200 group border border-red-200/50 dark:border-red-700/50"
          >
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-700 transition-colors duration-200">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfileModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9997]"
            onClick={() => setShowProfileModal(false)}
          />
          <div 
            className={`fixed w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 z-[9998] overflow-hidden transform origin-left transition-all duration-300 ease-in-out animate-in slide-in-from-left-2 fade-in-0 ${
              isOpen ? 'left-[22rem]' : 'left-20'
            } top-auto bottom-20`}
          >
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
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group mb-1 last:mb-0"
                >
                  <div className={`p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm transition-all duration-200 ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{item.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
                </Link>
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
      <div className="lg:hidden fixed top-0 left-16 right-0 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 z-40 flex items-center justify-between px-4 shadow-sm">
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

      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[9999] px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-xl border border-primary-500/30 pointer-events-none transition-all duration-200 animate-in fade-in-0 zoom-in-95"
          style={{
            left: tooltip.x,
            top: tooltip.y - 20,
            transform: 'translateY(-50%)'
          }}
        >
          {tooltip.text}
          {/* Tooltip arrow */}
          <div className="absolute left-0 top-1/2 w-0 h-0 border-r-4 border-r-primary-600 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-x-full -translate-y-1/2"></div>
        </div>
      )}
    </>
  );
}
