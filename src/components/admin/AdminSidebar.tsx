"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpenCheck,
  FileText,
  GraduationCap,
  MessageSquare,
  Megaphone,
  CalendarDays,
  Settings,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

type AdminCategory = {
  id: string;
  icon: any;
  label: string;
  items: Array<{ label: string; href: string; icon?: any; description?: string }>;
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
    id: "academics",
    icon: BookOpenCheck,
    label: "Akademik",
    items: [
      { label: "Kullanıcılar", href: "/admin/users", icon: Users, description: "Öğrenci/öğretmen" },
      { label: "Dersler", href: "/admin/courses", icon: BookOpenCheck, description: "Ders yönetimi" },
      { label: "Program", href: "/admin/schedule", icon: CalendarDays, description: "Ders programı" },
    ],
  },
  {
    id: "learning",
    icon: FileText,
    label: "Öğrenme",
    items: [
      { label: "Ödevler", href: "/admin/assignments", icon: FileText, description: "Ödev ve teslim" },
      { label: "Notlar", href: "/admin/grades", icon: GraduationCap, description: "Değerlendirme" },
    ],
  },
  {
    id: "communication",
    icon: MessageSquare,
    label: "İletişim",
    items: [
      { label: "Mesajlar", href: "/admin/messages", icon: MessageSquare, description: "Gelen kutusu" },
      { label: "Duyurular", href: "/admin/announcements", icon: Megaphone, description: "Duyuru yönetimi" },
      { label: "Forum", href: "/admin/forum", icon: MessageSquare, description: "Topluluk" },
    ],
  },
  {
    id: "settings",
    icon: Settings,
    label: "Ayarlar",
    items: [
      { label: "Genel Ayarlar", href: "/admin/settings", icon: Settings, description: "Platform" },
    ],
  },
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(adminCategories[0].id);
  useEffect(() => setMounted(true), []);
  const { user, logout } = useAuth();

  useEffect(() => {
    const current = adminCategories.find(cat => pathname.startsWith(`/admin`) && cat.items.some(i => pathname.startsWith(i.href)));
    if (current) setSelectedCategory(current.id);
  }, [pathname]);

  const selectCategory = (categoryId: string) => {
    if (selectedCategory === categoryId && isOpen) {
      onToggle();
    } else {
      setSelectedCategory(categoryId);
      if (!isOpen) onToggle();
    }
  };

  useEffect(() => {
    const current = adminCategories.find(cat => pathname.startsWith(`/admin`) && cat.items.some(i => pathname.startsWith(i.href)));
    if (current) {
      setSelectedCategory(current.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="fixed left-0 top-0 h-full z-50">
      {/* Mobile overlay - sadece detaylı sidebar açıkken, ikon rayı sabit */}
      {isOpen && (
        <div
          className="fixed top-0 left-16 right-0 bottom-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      {/* Minimal icon rail */}
      <div className="w-16 h-full bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center py-4 shadow-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <nav className="flex-1 space-y-2">
          {adminCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? "bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"}`}
              >
                <cat.icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>
        <button
          onClick={onToggle}
          aria-label={isOpen ? "Detaylı sidebar'ı kapat" : "Detaylı sidebar'ı aç"}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Detail panel */}
      <div className={`fixed left-16 top-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/60 dark:border-gray-700/60 transform transition-all duration-300 shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            {adminCategories.find(c => c.id === selectedCategory)?.label}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Yönetim Paneli</p>
        </div>
        <nav className="p-3 space-y-1">
          {adminCategories.find(c => c.id === selectedCategory)?.items.map((item) => {
            const isActive = mounted && (pathname === item.href || pathname.startsWith(item.href + "/"));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-primary-50/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-700/50" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-primary-600 dark:hover:text-primary-400 hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"}`}>
                {item.icon && <item.icon className={`h-4 w-4 ${isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-400"}`} />}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm">{item.label}</span>
                  {item.description && <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate">{item.description}</p>}
                </div>
                {isActive && <div className="w-1.5 h-1.5 bg-primary-500/80 dark:bg-primary-400/80 rounded-full" />}
              </Link>
            );
          })}
        </nav>
        {/* Bottom Section - User Info + Logout */}
        <div className="p-4 space-y-3 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 flex-shrink-0 absolute bottom-0 left-0 right-0">
          {user && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
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
    </div>
  );
}


