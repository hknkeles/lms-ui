"use client";

import StudentNavbar from "@/components/student/StudentNavbar";
import { GraduationCap, Home } from "lucide-react";

export default function GradesPage() {
  return (
    <div className="min-h-screen">
      <StudentNavbar 
        title="Notlar"
        subtitle="Tüm derslerindeki notların ve genel ortalaman"
        icon={<GraduationCap className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Ana Sayfa",
              href: "/",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Notlar",
              active: true
            }
          ]
        }}
      />
      
      <div className="pt-24 px-4 py-6">
        <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notlar</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tüm derslerindeki notların ve genel ortalaman.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Genel Ortalama</h3>
          <div className="text-3xl font-bold text-primary">85.2</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bu dönem</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Matematik 101</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Dr. Ahmet Yılmaz</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">88</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">A</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">İngilizce Kompozisyon</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dr. Sarah Johnson</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">82</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">B+</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-pastel-blue-light dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Bilgisayar Programlama</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Dr. Mehmet Kaya</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">91</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">A+</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
