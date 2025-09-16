"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeSelector from "@/components/ui/ThemeSelector";
import { Settings, Home } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Sistem Ayarları"
        subtitle="Sistem ayarlarını yönetin"
        icon={<Settings className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Ayarlar",
              active: true
            }
          ]
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-6">
          <h1 className="text-xl font-semibold">Ayarlar</h1>
      
      {/* Tema Seçici */}
      <ThemeSelector />
      
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold">Genel</h2>
          <p className="text-sm text-gray-600">Platform adı, logo ve renkler.</p>
        </div>
        <div>
          <h2 className="font-semibold">Güvenlik</h2>
          <p className="text-sm text-gray-600">Parola politikası ve 2FA.</p>
        </div>
        <Button>Kaydet</Button>
      </Card>
        </div>
      </div>
    </div>
  );
}



