"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  X,
  Key,
  Shield,
  Users,
  Plus,
  Minus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import AdminNavbar from "@/components/admin/AdminNavbar";

// Zod schema for role validation
const roleSchema = z.object({
  name: z.string().min(2, "Rol adı en az 2 karakter olmalı"),
  description: z.string().min(5, "Açıklama en az 5 karakter olmalı"),
  color: z.string().min(1, "Renk seçin"),
  permissions: z.array(z.string()).min(1, 'En az bir izin seçin'),
});

type RoleFormData = z.infer<typeof roleSchema>;

// Available permissions
const availablePermissions = [
  { id: 'users', label: 'Kullanıcı Yönetimi', description: 'Kullanıcı ekleme, düzenleme ve silme' },
  { id: 'courses', label: 'Kurs Yönetimi', description: 'Kurs oluşturma ve yönetimi' },
  { id: 'announcements', label: 'Duyuru Yönetimi', description: 'Duyuru oluşturma ve yönetimi' },
  { id: 'students', label: 'Öğrenci Yönetimi', description: 'Öğrenci kayıt ve yönetimi' },
  { id: 'courses_view', label: 'Kurs Görüntüleme', description: 'Kursları görüntüleme izni' },
  { id: 'assignments', label: 'Ödev Yönetimi', description: 'Ödev oluşturma ve değerlendirme' },
  { id: 'forum', label: 'Forum Yönetimi', description: 'Forum moderasyonu' },
  { id: 'content', label: 'İçerik Yönetimi', description: 'İçerik düzenleme ve moderasyon' },
  { id: 'reports', label: 'Raporlar', description: 'Sistem raporlarını görüntüleme' },
  { id: 'settings', label: 'Sistem Ayarları', description: 'Sistem konfigürasyonu' },
];

const colorOptions = [
  { value: 'bg-red-500', label: 'Kırmızı', color: 'bg-red-500' },
  { value: 'bg-blue-500', label: 'Mavi', color: 'bg-blue-500' },
  { value: 'bg-green-500', label: 'Yeşil', color: 'bg-green-500' },
  { value: 'bg-purple-500', label: 'Mor', color: 'bg-purple-500' },
  { value: 'bg-orange-500', label: 'Turuncu', color: 'bg-orange-500' },
  { value: 'bg-pink-500', label: 'Pembe', color: 'bg-pink-500' },
  { value: 'bg-indigo-500', label: 'İndigo', color: 'bg-indigo-500' },
  { value: 'bg-teal-500', label: 'Teal', color: 'bg-teal-500' },
];

export default function CreateRolePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      color: 'bg-blue-500',
      permissions: [],
    },
  });

  const selectedColor = watch('color');

  // Handle permission selection
  const handlePermissionToggle = (permissionId: string) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((p) => p !== permissionId)
      : [...selectedPermissions, permissionId];

    setSelectedPermissions(newPermissions);
    setValue('permissions', newPermissions);
    setHasChanges(true);
  };

  // Handle form submission
  const onSubmit = async (data: RoleFormData) => {
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRole = {
        ...data,
        id: Date.now().toString(),
        userCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Yeni rol verisi:', newRole);
      toast.success('Rol başarıyla oluşturuldu!');
      
      // Form'u sıfırla
      reset({
        name: '',
        description: '',
        color: 'bg-blue-500',
        permissions: [],
      });
      setSelectedPermissions([]);
      setHasChanges(false);
      
      router.push('/admin/users/roles');
    } catch (error) {
      toast.error('Rol oluşturulurken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Yeni Rol Ekle"
        subtitle="Sisteme yeni rol ekleyin"
        icon={<Plus className="h-5 w-5 text-white" />}
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
              label: "Yeni Rol",
              active: true,
            },
          ],
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-6">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Role Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Temel Bilgiler
                  </h2>

                  <div className="space-y-4">
                    {/* Role Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rol Adı *
                      </label>
                      <Input
                        {...register('name')}
                        placeholder="Rol adını girin"
                        onChange={(e) => {
                          setValue('name', e.target.value);
                          setHasChanges(true);
                        }}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Açıklama *
                      </label>
                      <Textarea
                        {...register('description')}
                        placeholder="Rol hakkında açıklama..."
                        rows={3}
                        onChange={(e) => {
                          setValue('description', e.target.value);
                          setHasChanges(true);
                        }}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    İzinler *
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                          className="shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block truncate"
                            title={permission.label}
                          >
                            {permission.label}
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={permission.description}>
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.permissions && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.permissions.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Preview & Actions */}
              <div className="space-y-6">
                {/* Role Preview */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Rol Önizleme
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${selectedColor}`} />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {watch('name') || 'Rol Adı'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {watch('description') || 'Rol açıklaması...'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Kullanıcı Sayısı:</span>
                          <span className="font-medium text-gray-900 dark:text-white">0 kişi</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">İzin Sayısı:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedPermissions.length} izin
                          </span>
                        </div>
                      </div>

                      {selectedPermissions.length > 0 && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Seçili İzinler:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedPermissions.map((permissionId) => {
                              const permission = availablePermissions.find(p => p.id === permissionId);
                              return (
                                <span
                                  key={permissionId}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                >
                                  {permission?.label || permissionId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4">Rol Rengi</h2>

                  <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          setValue('color', color.value);
                          setHasChanges(true);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedColor === color.value
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-full h-8 rounded ${color.color}`} />
                        <p className="text-xs text-center mt-2 text-gray-700 dark:text-gray-300">
                          {color.label}
                        </p>
                      </button>
                    ))}
                  </div>

                  {errors.color && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Save className="h-5 w-5 mr-2" />
                    İşlemler
                  </h2>
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Oluşturuluyor...' : 'Rolü Oluştur'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/users/roles')}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      İptal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
