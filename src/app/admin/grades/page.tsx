"use client";

import Card from "@/components/shared/Card";
import { mockGrades, mockCourses } from "@/data/mock/dashboard";

export default function AdminGradesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Notlar</h1>
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-3">Ders</th>
                <th className="py-2 px-3">Puan</th>
                <th className="py-2 px-3">Maks</th>
              </tr>
            </thead>
            <tbody>
              {mockGrades.map(g => {
                const course = mockCourses.find(c => c.id === g.courseId);
                return (
                  <tr key={g.courseId} className="border-t">
                    <td className="py-2 px-3">{course?.title}</td>
                    <td className="py-2 px-3 font-medium">{g.score}</td>
                    <td className="py-2 px-3">{g.maxScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}



