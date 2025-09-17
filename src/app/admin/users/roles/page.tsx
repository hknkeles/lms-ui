"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Key,
  Shield,
  Users,
  Settings,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminNavbar from "@/components/admin/AdminNavbar";
import Card from "@/components/shared/Card";

// Mock data for roles
const mockRoles = [
  {
    id: "1",
    name: "Süper Yönetici",
    description: "Tüm sistem yetkilerine sahip",
    userCount: 1,
    permissions: ["all"],
    color: "bg-red-500",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sistem Yöneticisi",
    description: "Sistem yönetimi ve kullanıcı işlemleri",
    userCount: 3,
    permissions: ["users", "courses", "announcements"],
    color: "bg-blue-500",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Eğitmen",
    description: "Kurs oluşturma ve öğrenci yönetimi",
    userCount: 12,
    permissions: ["courses", "students"],
    color: "bg-green-500",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-25",
  },
  {
    id: "4",
    name: "Öğrenci",
    description: "Kurs erişimi ve temel işlemler",
    userCount: 245,
    permissions: ["courses_view", "assignments"],
    color: "bg-purple-500",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "5",
    name: "Moderatör",
    description: "Forum ve içerik moderasyonu",
    userCount: 5,
    permissions: ["forum", "content"],
    color: "bg-orange-500",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
];

const permissionLabels = {
  all: "Tüm İzinler",
  users: "Kullanıcı Yönetimi",
  courses: "Kurs Yönetimi",
  announcements: "Duyuru Yönetimi",
  students: "Öğrenci Yönetimi",
  courses_view: "Kurs Görüntüleme",
  assignments: "Ödev Yönetimi",
  forum: "Forum Yönetimi",
  content: "İçerik Yönetimi",
};

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const filteredRoles = mockRoles.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPermissionBadges = (permissions: string[]) => {
    if (permissions.includes("all")) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          Tüm İzinler
        </span>
      );
    }

    return permissions.map((permission) => (
      <span
        key={permission}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mr-1 mb-1"
      >
        {permissionLabels[permission as keyof typeof permissionLabels] || permission}
      </span>
    ));
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Rol Yönetimi"
        subtitle="Sistem rollerini ve izinleri yönetin"
        icon={<Key className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
            },
            {
              label: "Kullanıcılar",
              href: "/admin/users",
            },
            {
              label: "Roller",
              active: true,
            },
          ],
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sistem Rolleri
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Toplam {mockRoles.length} rol tanımlanmış
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {/* Filter logic */}}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtrele
              </Button>
              <Button
                onClick={() => window.location.href = '/admin/users/roles/create'}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Rol Ekle
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rol ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Roles Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kullanıcı Sayısı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İzinler
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Oluşturulma
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRoles.map((role, index) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${role.color} mr-3`} />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {role.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {role.userCount} kişi
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 2).map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              >
                                {permissionLabels[permission as keyof typeof permissionLabels] || permission}
                              </span>
                            ))}
                            {role.permissions.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                +{role.permissions.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(role.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/admin/users/roles/${role.id}`}
                            className="h-8 px-3"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Detay
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/admin/users/roles/${role.id}/edit`}
                            className="h-8 px-3"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Rol bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun rol bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
