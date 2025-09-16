"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Megaphone,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
  User as UserIcon,
  UserCheck,
  UserPlus,
  GraduationCap,
  UserCog,
  Sun,
  Moon,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

type AdminCategory = {
  id: string;
  icon: any;
  label: string;
  items: Array<{ 
    label: string; 
    href: string; 
    icon?: any; 
    description?: string;
    subItems?: Array<{ label: string; href: string; icon?: any; description?: string }>;
  }>;
};

const adminCategories: AdminCategory[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    items: [
      { label: "Genel Bakış", href: "/admin", icon: LayoutDashboard, description: "Yönetim özeti" },
    ],
  },
  {
    id: "courses",
    icon: BookOpen,
    label: "Kurslar",
    items: [
      { label: "Tüm Kurslar", href: "/admin/courses", icon: BookOpen, description: "Kurs listesi" },
      { label: "Kurs Oluştur", href: "/admin/courses/create", icon: BookOpen, description: "Yeni kurs ekle" },
      { label: "Kurs Kategorileri", href: "/admin/courses/categories", icon: BookOpen, description: "Kategori yönetimi" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Kullanıcılar",
    items: [
      { label: "Tüm Kullanıcılar", href: "/admin/users", icon: Users, description: "Kullanıcı listesi" },
      { 
        label: "Yöneticiler", 
        href: "/admin/users?role=admin", 
        icon: UserCog, 
        description: "Yönetici listesi",
        subItems: [
          { label: "Yöneticileri Yönet", href: "/admin/users?role=admin", icon: UserCheck, description: "Yönetici yönetimi" },
          { label: "Yönetici Ekle", href: "/admin/managers/add", icon: UserPlus, description: "Yeni yönetici ekle" }
        ]
      },
      { 
        label: "Eğitmenler", 
        href: "/admin/users?role=teacher", 
        icon: GraduationCap, 
        description: "Eğitmen listesi",
        subItems: [
          { label: "Eğitmenleri Yönet", href: "/admin/users/teachers", icon: UserCheck, description: "Eğitmen yönetimi" },
          { label: "Yeni Eğitmen Ekle", href: "/admin/users/teachers/create", icon: UserPlus, description: "Yeni eğitmen ekle" }
        ]
      },
      { 
        label: "Öğrenciler", 
        href: "/admin/users?role=student", 
        icon: UserIcon, 
        description: "Öğrenci listesi",
        subItems: [
          { label: "Öğrencileri Yönet", href: "/admin/users/students", icon: UserCheck, description: "Öğrenci yönetimi" },
          { label: "Yeni Öğrenci Ekle", href: "/admin/users/students/create", icon: UserPlus, description: "Yeni öğrenci ekle" }
        ]
      },
    ],
  },
  {
    id: "announcements",
    icon: Megaphone,
    label: "Duyurular",
    items: [
      { label: "Tüm Duyurular", href: "/admin/announcements", icon: Megaphone, description: "Duyuru listesi" },
      { label: "Yeni Duyuru", href: "/admin/announcements/create", icon: Megaphone, description: "Duyuru oluştur" },
      { label: "Duyuru Kategorileri", href: "/admin/announcements/categories", icon: Megaphone, description: "Kategori yönetimi" },
    ],
  },
  {
    id: "settings",
    icon: Settings,
    label: "Ayarlar",
    items: [
      { label: "Genel Ayarlar", href: "/admin/settings", icon: Settings, description: "Platform ayarları" },
      { label: "Sistem Ayarları", href: "/admin/settings/system", icon: Settings, description: "Sistem konfigürasyonu" },
      { label: "Güvenlik", href: "/admin/settings/security", icon: Settings, description: "Güvenlik ayarları" },
    ],
  },
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(adminCategories[0].id);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => setMounted(true), []);

  // Dark mode toggle function
  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('lms_theme', newMode ? 'dark' : 'light');
    
    // Apply theme to document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  // Auto-select category based on current path
  useEffect(() => {
    const currentCategory = adminCategories.find(cat => 
      cat.items.some(item => {
        // Exact match for root paths
        if (item.href === pathname) return true;
        // Match for sub-paths but avoid false matches
        if (item.href !== '/admin' && (pathname.startsWith(item.href + '/') || pathname.startsWith(item.href + '?'))) {
          return true;
        }
        return false;
      })
    );
    
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
    }
  }, [pathname]);

  const selectCategory = (categoryId: string) => {
    if (selectedCategory === categoryId && isOpen) {
      onToggle();
    } else {
      setSelectedCategory(categoryId);
      if (!isOpen) onToggle();
    }
  };

  const toggleSubMenu = (itemLabel: string) => {
    setExpandedItems(prev => 
      prev.includes(itemLabel) 
        ? prev.filter(label => label !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  return (
    <>
      {/* Mobile overlay - sadece detaylı sidebar açıkken, ikon rayı sabit */}
      {isOpen && (
        <div
          className="fixed top-0 left-16 right-0 bottom-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      {/* Minimal icon rail */}
      <div className="fixed left-0 top-0 h-full w-16 z-50 bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center py-4 shadow-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg mb-6">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <nav className="flex-1 space-y-2">
          {adminCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
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
                    text: cat.label,
                    x: x,
                    y: y
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${isActive ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary"}`}
              >
                <cat.icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>
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
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

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
          aria-label={isOpen ? "Detaylı sidebar'ı kapat" : "Detaylı sidebar'ı aç"}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
        >
          <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Detail panel */}
      <div className={`fixed left-16 top-0 h-full w-72 z-60 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/60 dark:border-gray-700/60 transform transition-all duration-300 ease-in-out shadow-xl flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {adminCategories.find(c => c.id === selectedCategory)?.label}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Yönetim Paneli</p>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {adminCategories.find(c => c.id === selectedCategory)?.items.map((item) => {
            // Improved active state detection
            const isActive = mounted && (
              pathname === item.href || 
              pathname.startsWith(item.href + '/') || 
              pathname.startsWith(item.href + '?')
            );
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.label);
            
            return (
              <div key={item.href}>
                <div className="flex items-center">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleSubMenu(item.label)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 flex-1 w-full ${
                        isActive 
                          ? "bg-primary/5 dark:bg-primary/10 text-primary border border-primary/20 dark:border-primary/30" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-primary hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"
                      }`}
                    >
                      {item.icon && (
                        <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-gray-600 dark:text-gray-400"}`} />
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        <span className="font-semibold text-sm">{item.label}</span>
                        {item.description && (
                          <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      {isActive && <div className="w-1.5 h-1.5 bg-primary/80 rounded-full" />}
                    </button>
                  ) : (
                    <Link 
                      href={item.href} 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 flex-1 ${
                        isActive 
                          ? "bg-primary/5 dark:bg-primary/10 text-primary border border-primary/20 dark:border-primary/30" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-primary hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"
                      }`}
                    >
                      {item.icon && (
                        <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-gray-600 dark:text-gray-400"}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm">{item.label}</span>
                        {item.description && (
                          <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 bg-primary/80 rounded-full" />}
                    </Link>
                  )}
                </div>
                
                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <div className="relative ml-6 mt-1">
                    {/* Main vertical line */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30 dark:bg-primary/40"></div>
                    
                    <div className="space-y-1">
                      {item.subItems!.map((subItem, index) => {
                        const isSubActive = mounted && (
                          pathname === subItem.href || 
                          pathname.startsWith(subItem.href + '/') || 
                          pathname.startsWith(subItem.href + '?')
                        );
                        
                        return (
                          <div key={subItem.href} className="relative">
                            {/* Horizontal connector line */}
                            <div className={`absolute left-0 top-1/2 w-4 h-0.5 transform -translate-y-1/2 ${
                              isSubActive 
                                ? "bg-primary shadow-sm shadow-primary/30" 
                                : "bg-primary/40 dark:bg-primary/50"
                            }`}></div>
                            
                            <Link 
                              href={subItem.href} 
                              className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ml-4 ${
                                isSubActive 
                                  ? "bg-primary/5 dark:bg-primary/10 text-primary border border-primary/20 dark:border-primary/30" 
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-primary"
                              }`}
                            >
                              {subItem.icon && (
                                <subItem.icon className={`h-3 w-3 ${isSubActive ? "text-primary" : "text-gray-500 dark:text-gray-500"}`} />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-xs">{subItem.label}</span>
                                {subItem.description && (
                                  <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate">
                                    {subItem.description}
                                  </p>
                                )}
                              </div>
                              {isSubActive && <div className="w-1 h-1 bg-primary/80 rounded-full" />}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </nav>
        </ScrollArea>
        {/* Bottom Section - User Info + Logout */}
        <div className="p-4 space-y-3 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 flex-shrink-0 mt-auto">
          {user && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Çevrimiçi</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
              </div>
            </div>
          )}
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

      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[9999] px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow-xl border border-primary/30 pointer-events-none transition-all duration-200 animate-in fade-in-0 zoom-in-95"
          style={{
            left: tooltip.x,
            top: tooltip.y - 20,
            transform: 'translateY(-50%)'
          }}
        >
          {tooltip.text}
          {/* Tooltip arrow */}
          <div className="absolute left-0 top-1/2 w-0 h-0 border-r-4 border-r-primary border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-x-full -translate-y-1/2"></div>
        </div>
      )}
    </>
  );
}


