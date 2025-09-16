"use client";

import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, UserPlus } from "lucide-react";
import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  active: boolean;
}

const mockUsers: AdminUser[] = [
  { id: "u1", name: "Ali Veli", email: "ali@example.com", role: "student", active: true },
  { id: "u2", name: "Ayşe Yılmaz", email: "ayse@example.com", role: "teacher", active: true },
  { id: "u3", name: "Mehmet Kaya", email: "mehmet@example.com", role: "student", active: false },
];

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const users = useMemo(() => mockUsers.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Kullanıcılar</h1>
        <Button className="gap-2"><UserPlus className="h-4 w-4" />Yeni Kullanıcı</Button>
      </div>
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="İsim veya e-posta ile ara" className="pl-9" />
          </div>
          <Button variant="outline">Dışa Aktar</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-3">İsim</th>
                <th className="py-2 px-3">E-posta</th>
                <th className="py-2 px-3">Rol</th>
                <th className="py-2 px-3">Durum</th>
                <th className="py-2 px-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 px-3 font-medium">{u.name}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3 capitalize">{u.role}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{u.active ? "Aktif" : "Pasif"}</span>
                  </td>
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
  );
}



