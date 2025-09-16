"use client";

import Card from "@/components/shared/Card";

const mockSchedule = [
  { id: "s1", title: "Matematik 101", time: "Pzt 09:00", room: "A-201", teacher: "Prof. A. Yılmaz" },
  { id: "s2", title: "Fizik", time: "Sal 11:00", room: "B-104", teacher: "Dr. A. Demir" },
];

export default function AdminSchedulePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ders Programı</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSchedule.map(s => (
          <Card key={s.id} className="p-4">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-600">{s.teacher}</div>
            <div className="text-sm text-gray-600">{s.time} • {s.room}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}



