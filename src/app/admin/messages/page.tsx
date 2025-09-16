"use client";

import Card from "@/components/shared/Card";
import { conversations } from "@/data/conversations";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Home } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminMessagesPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Mesaj Yönetimi"
        subtitle="Sistem mesajlarını yönetin"
        icon={<Mail className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Mesajlar",
              active: true
            }
          ]
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Mesajlar</h1>
      <Card className="p-4">
        <div className="space-y-3">
          {conversations.map(c => (
            <div key={c.id} className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.participant.name}</div>
                  <div className="text-xs text-gray-500">{c.lastMessage.content}</div>
                </div>
                <Button size="sm" variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" />Sil</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
}



