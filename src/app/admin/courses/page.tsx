"use client";

import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2, BookOpen, Home } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

const mockCourses = [
  { id: "c1", title: "Matematik 101", teacher: "Prof. A. Yılmaz", students: 240 },
  { id: "c2", title: "Fizik Temelleri", teacher: "Dr. A. Demir", students: 180 },
];

export default function AdminCoursesPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Ders Yönetimi"
        subtitle="Sistem derslerini yönetin"
        icon={<BookOpen className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Dersler",
              active: true
            }
          ]
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">Dersler</h1>
            <Button className="gap-2"><Plus className="h-4 w-4" />Yeni Ders</Button>
          </div>
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Ders ara" className="pl-9" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCourses.map(c => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.teacher}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1"><Pencil className="h-3 w-3" />Düzenle</Button>
                  <Button size="sm" variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" />Sil</Button>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">Öğrenci: {c.students}</div>
            </Card>
          ))}
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
}



