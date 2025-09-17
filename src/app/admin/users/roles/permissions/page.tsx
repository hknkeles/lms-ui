"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Key,
  Users,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminNavbar from "@/components/admin/AdminNavbar";
import Card from "@/components/shared/Card";

// Mock data for permissions
const mockPermissions = [
  {
    id: "1",
    name: "Kullanıcı Yönetimi",
    key: "users",
    description: "Kullanıcı ekleme, düzenleme, silme ve listeleme işlemleri",
    category: "Kullanıcı",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Kurs Yönetimi",
    key: "courses",
    description: "Kurs oluşturma, düzenleme, silme ve yayınlama işlemleri",
    category: "Kurs",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Duyuru Yönetimi",
    key: "announcements",
    description: "Duyuru oluşturma, düzenleme ve yönetimi",
    category: "İçerik",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "4",
    name: "Öğrenci Yönetimi",
    key: "students",
    description: "Öğrenci kayıt, düzenleme ve yönetimi",
    category: "Kullanıcı",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-25",
  },
  {
    id: "5",
    name: "Forum Yönetimi",
    key: "forum",
    description: "Forum moderasyonu ve içerik yönetimi",
    category: "İçerik",
    isActive: false,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "6",
    name: "Sistem Ayarları",
    key: "settings",
    description: "Sistem konfigürasyonu ve genel ayarlar",
    category: "Sistem",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];

const categories = [
  { id: "Kullanıcı", label: "Kullanıcı", color: "bg-blue-500" },
  { id: "Kurs", label: "Kurs", color: "bg-green-500" },
  { id: "İçerik", label: "İçerik", color: "bg-purple-500" },
  { id: "Sistem", label: "Sistem", color: "bg-red-500" },
];

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [editingPermission, setEditingPermission] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPermissions = permissions.filter((permission) => {
    if (selectedCategory === "all") return true;
    return permission.category === selectedCategory;
  });

  const handleEditPermission = (permissionId: string) => {
    setEditingPermission(permissionId);
  };

  const handleSavePermission = (permissionData: any) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.id === editingPermission 
          ? { ...permission, ...permissionData, updatedAt: new Date().toISOString() }
          : permission
      )
    );
    setEditingPermission(null);
  };

  const handleAddPermission = (permissionData: any) => {
    const newPermission = {
      ...permissionData,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPermissions(prev => [...prev, newPermission]);
    setShowAddForm(false);
  };

  const handleDeletePermission = (permissionId: string) => {
    setPermissions(prev => prev.filter(permission => permission.id !== permissionId));
  };

  const togglePermissionStatus = (permissionId: string) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.id === permissionId 
          ? { ...permission, isActive: !permission.isActive, updatedAt: new Date().toISOString() }
          : permission
      )
    );
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="İzin Yönetimi"
        subtitle="Sistem izinlerini yönetin ve tanımlayın"
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
              label: "Roller",
              href: "/admin/users/roles",
            },
            {
              label: "İzin Yönetimi",
              active: true,
            },
          ],
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sistem İzinleri
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Toplam {permissions.length} izin tanımlanmış
              </p>
            </div>
            
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni İzin Ekle
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Tümü ({permissions.length})
            </button>
            {categories.map((category) => {
              const count = permissions.filter(p => p.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${category.color}`} />
                  {category.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Add Permission Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Yeni İzin Ekle</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <AddPermissionForm
                onSave={handleAddPermission}
                onCancel={() => setShowAddForm(false)}
                categories={categories}
              />
            </motion.div>
          )}

          {/* Permissions Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İzin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Anahtar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Güncellenme
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPermissions.map((permission, index) => (
                    <motion.tr
                      key={permission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {permission.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {permission.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            categories.find(c => c.id === permission.category)?.color || 'bg-gray-500'
                          } mr-2`} />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {permission.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200">
                          {permission.key}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePermissionStatus(permission.id)}
                            className={`p-1 rounded transition-colors ${
                              permission.isActive
                                ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                : "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            }`}
                          >
                            {permission.isActive ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            permission.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {permission.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(permission.updatedAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPermission(permission.id)}
                            className="h-8 px-3"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePermission(permission.id)}
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

          {filteredPermissions.length === 0 && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                İzin bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Seçili kategoride izin bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add Permission Form Component
function AddPermissionForm({ onSave, onCancel, categories }: any) {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    category: 'Kullanıcı',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.key && formData.description) {
      onSave(formData);
      setFormData({ name: '', key: '', description: '', category: 'Kullanıcı' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">İzin Adı *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="İzin adını girin"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Anahtar *</label>
          <Input
            value={formData.key}
            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
            placeholder="izin_anahtari"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Açıklama *</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="İzin hakkında açıklama..."
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Kategori</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Kaydet
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          <X className="h-4 w-4 mr-2" />
          İptal
        </Button>
      </div>
    </form>
  );
}
