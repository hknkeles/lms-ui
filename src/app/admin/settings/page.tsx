"use client";

import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ayarlar</h1>
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
  );
}



