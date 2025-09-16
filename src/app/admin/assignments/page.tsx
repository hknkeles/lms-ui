"use client";

import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pendingAssignments } from "@/data/mock/assignments";
import { Search, Plus, Pencil, Trash2, FileText, Home } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminAssignmentsPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Ödev Yönetimi"
        subtitle="Sistem ödevlerini yönetin"
        icon={<FileText className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Ödevler",
              active: true
            }
          ]
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">Ödevler</h1>
            <Button className="gap-2"><Plus className="h-4 w-4" />Yeni Ödev</Button>
          </div>
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Ödev ara" className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-3">Başlık</th>
                <th className="py-2 px-3">Ders</th>
                <th className="py-2 px-3">Öğretmen</th>
                <th className="py-2 px-3">Teslim</th>
                <th className="py-2 px-3">Durum</th>
                <th className="py-2 px-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {pendingAssignments.slice(0, 8).map(a => (
                <tr key={a.id} className="border-t">
                  <td className="py-2 px-3 font-medium">{a.title}</td>
                  <td className="py-2 px-3">{a.course}</td>
                  <td className="py-2 px-3">{a.teacher}</td>
                  <td className="py-2 px-3">{a.dueDate} {a.dueTime}</td>
                  <td className="py-2 px-3 capitalize">{a.status}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="outline" className="gap-1"><Pencil className="h-3 w-3" />Düzenle</Button>
                      <Button size="sm" variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" />Sil</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
}



