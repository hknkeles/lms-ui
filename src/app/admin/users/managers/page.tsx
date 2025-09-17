"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminNavbar from "@/components/admin/AdminNavbar";

// Available roles for selection
const availableRoles = [
  { id: 'super-admin', name: 'Süper Yönetici', color: 'bg-red-500' },
  { id: 'system-admin', name: 'Sistem Yöneticisi', color: 'bg-blue-500' },
  { id: 'hr-admin', name: 'İK Yöneticisi', color: 'bg-green-500' },
  { id: 'content-admin', name: 'İçerik Yöneticisi', color: 'bg-purple-500' },
  { id: 'support-admin', name: 'Destek Yöneticisi', color: 'bg-orange-500' },
];

// Mock data for managers
const mockManagers = [
  {
    id: "1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@company.com",
    phone: "+90 532 123 45 67",
    username: "ahmet.yilmaz",
    department: "Bilgi İşlem",
    position: "Sistem Yöneticisi",
    roles: ["super-admin", "system-admin"],
    avatar: null,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    firstName: "Ayşe",
    lastName: "Kaya",
    email: "ayse.kaya@company.com",
    phone: "+90 533 234 56 78",
    username: "ayse.kaya",
    department: "İnsan Kaynakları",
    position: "İK Yöneticisi",
    roles: ["hr-admin"],
    avatar: null,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
  {
    id: "3",
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet.demir@company.com",
    phone: "+90 534 345 67 89",
    username: "mehmet.demir",
    department: "Pazarlama",
    position: "İçerik Yöneticisi",
    roles: ["content-admin"],
    avatar: null,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
  },
];

export default function ManagersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [expandedManager, setExpandedManager] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    phone: true,
    department: true,
    position: true,
    roles: true,
    actions: true,
    // Hidden by default
    email: false,
    createdAt: false,
  });

  const departments = ["all", "Bilgi İşlem", "İnsan Kaynakları", "Muhasebe", "Pazarlama", "Satış", "Yönetim"];

  const filteredManagers = useMemo(() => {
    return mockManagers.filter((manager) => {
      const matchesSearch = 
        manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === "all" || manager.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  const getRoleBadges = (roleIds: string[]) => {
    return roleIds.map((roleId) => {
      const role = availableRoles.find(r => r.id === roleId);
      return (
        <span
          key={roleId}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mr-1 mb-1"
        >
          <div className={`w-2 h-2 rounded-full ${role?.color || 'bg-gray-500'} mr-1`} />
          {role?.name || roleId}
        </span>
      );
    });
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Yöneticileri Yönet"
        subtitle="Sistem yöneticilerini yönetin"
        icon={<Shield className="h-5 w-5 text-white" />}
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
              label: "Yöneticiler",
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
                Yöneticiler
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Toplam {mockManagers.length} yönetici
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => {/* Column toggle dropdown will be added */}}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Sütunlar
                </Button>
              </div>
              <Button
                onClick={() => window.location.href = '/admin/managers/add'}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Yönetici
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Yönetici ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[200px]"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "Tüm Departmanlar" : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Managers Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {visibleColumns.name && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ad Soyad
                      </th>
                    )}
                    {visibleColumns.department && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Departman
                      </th>
                    )}
                    {visibleColumns.position && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Pozisyon
                      </th>
                    )}
                    {visibleColumns.roles && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Roller
                      </th>
                    )}
                    {visibleColumns.phone && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Telefon
                      </th>
                    )}
                    {visibleColumns.email && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        E-posta
                      </th>
                    )}
                    {visibleColumns.createdAt && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Oluşturulma
                      </th>
                    )}
                    {visibleColumns.actions && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        İşlemler
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredManagers.map((manager, index) => (
                    <motion.tr
                      key={manager.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {visibleColumns.name && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {manager.firstName} {manager.lastName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                @{manager.username}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.department && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {manager.department}
                          </div>
                        </td>
                      )}
                      {visibleColumns.position && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {manager.position}
                          </div>
                        </td>
                      )}
                      {visibleColumns.roles && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {getRoleBadges(manager.roles)}
                          </div>
                        </td>
                      )}
                      {visibleColumns.phone && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {manager.phone}
                          </div>
                        </td>
                      )}
                      {visibleColumns.email && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
                            {manager.email}
                          </div>
                        </td>
                      )}
                      {visibleColumns.createdAt && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(manager.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = `/admin/managers/${manager.id}`}
                              className="h-7 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Detay
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = `/admin/managers/${manager.id}/edit`}
                              className="h-7 px-2 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Düzenle
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredManagers.length === 0 && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Yönetici bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun yönetici bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
