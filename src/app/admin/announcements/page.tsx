"use client";

import Card from "@/components/shared/Card";
import { announcements } from "@/data/announcements";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Duyurular</h1>
        <Button className="gap-2"><Plus className="h-4 w-4" />Yeni Duyuru</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map(a => (
          <Card key={a.id} className="p-4">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.content}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{a.date}</span>
              <span>{a.category}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 justify-end">
              <Button size="sm" variant="outline" className="gap-1"><Pencil className="h-3 w-3" />Düzenle</Button>
              <Button size="sm" variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" />Sil</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}



