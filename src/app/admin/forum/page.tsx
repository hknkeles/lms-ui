"use client";

import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Home } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

const mockForum = [
  { id: "p1", title: "Sınav haftası duyuruları", author: "Moderatör", replies: 12 },
  { id: "p2", title: "Matematik 101 soru çözümleri", author: "Ali Veli", replies: 34 },
];

export default function AdminForumPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Forum Yönetimi"
        subtitle="Sistem forumunu yönetin"
        icon={<MessageSquare className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Forum",
              active: true
            }
          ]
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Forum</h1>
      <Card className="p-4">
        <div className="space-y-3">
          {mockForum.map(p => (
            <div key={p.id} className="p-3 rounded-lg border flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500">{p.author} • {p.replies} cevap</div>
              </div>
              <Button size="sm" variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" />Sil</Button>
            </div>
          ))}
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
}



