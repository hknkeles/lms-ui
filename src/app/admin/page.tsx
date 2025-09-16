"use client";

import { Users, BookOpen, FileText, Megaphone } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import Card from "@/components/shared/Card";
import Link from "next/link";

export default function AdminHomePage() {
  const stats = [
    { title: "Toplam Öğrenci", value: "1.284", subtitle: "+32 bu ay", icon: <Users className="h-6 w-6" />, color: "primary" },
    { title: "Aktif Ders", value: "48", subtitle: "8 bölüm", icon: <BookOpen className="h-6 w-6" />, color: "green" },
    { title: "Bekleyen Ödev", value: "126", subtitle: "son 7 gün", icon: <FileText className="h-6 w-6" />, color: "orange" },
    { title: "Duyuru", value: "12", subtitle: "yayında", icon: <Megaphone className="h-6 w-6" />, color: "purple" },
  ];

  const quickLinks = [
    { title: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users },
    { title: "Ders Yönetimi", href: "/admin/courses", icon: BookOpen },
    { title: "Ödev Yönetimi", href: "/admin/assignments", icon: FileText },
    { title: "Duyuru Yönetimi", href: "/admin/announcements", icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} icon={s.icon} color={s.color as any} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Hızlı Erişim</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((q) => (
              <Link key={q.href} href={q.href} className="group p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-200 flex items-center gap-3">
                <q.icon className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{q.title}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Aktivite Özeti</h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between"><span>Son 24s kayıt olan öğrenci</span><span className="font-semibold">12</span></div>
            <div className="flex items-center justify-between"><span>Yeni açılan ders</span><span className="font-semibold">2</span></div>
            <div className="flex items-center justify-between"><span>İletilen mesaj</span><span className="font-semibold">37</span></div>
            <div className="flex items-center justify-between"><span>Yayınlanan duyuru</span><span className="font-semibold">1</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}



