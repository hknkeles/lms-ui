"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Save,
  X,
  User,
  Tag,
  Home,
  Plus,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import AdminNavbar from "@/components/admin/AdminNavbar";

// Zod schema for form validation
const managerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalı"),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  department: z.string().min(1, "Departman seçin"),
  position: z.string().min(1, "Pozisyon seçin"),
  roles: z.array(z.string()).min(1, 'En az bir rol seçin'),
  avatar: z.any().optional(),
  notes: z.string().optional(),
});

type ManagerFormData = z.infer<typeof managerSchema>;

// Available roles for selection
const availableRoles = [
  { id: 'super-admin', name: 'Süper Yönetici', description: 'Tüm sistem yetkilerine sahip' },
  { id: 'system-admin', name: 'Sistem Yöneticisi', description: 'Sistem yönetimi ve kullanıcı işlemleri' },
  { id: 'hr-admin', name: 'İK Yöneticisi', description: 'İnsan kaynakları yönetimi' },
  { id: 'content-admin', name: 'İçerik Yöneticisi', description: 'İçerik ve kurs yönetimi' },
  { id: 'support-admin', name: 'Destek Yöneticisi', description: 'Kullanıcı destek işlemleri' },
];

export default function AddManagerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      department: '',
      position: '',
      roles: [],
      avatar: undefined,
      notes: '',
    },
  });

  // Watch form values for change detection
  const watchedValues = watch();

  // Check for changes
  useEffect(() => {
    if (isDirty && !hasChanges) {
      setHasChanges(true);
    }
  }, [isDirty, hasChanges]);

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        setValue('avatar', file);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle role selection
  const handleRoleToggle = (roleId: string) => {
    const newRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter((r) => r !== roleId)
      : [...selectedRoles, roleId];

    setSelectedRoles(newRoles);
    setValue('roles', newRoles);
    setHasChanges(true);
  };

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("password", password);
    setHasChanges(true);
    toast.success("Şifre oluşturuldu");
  };

  // Handle form submission
  const onSubmit = async (data: ManagerFormData) => {
    setIsSubmitting(true);

    try {
      // Mock API call - gerçek uygulamada API'ye gönderilir
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Yeni yönetici ekleme modu
      const newManager = {
        ...data,
        id: Date.now().toString(), // Geçici ID
        avatar: avatarPreview || null,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Yeni yönetici verisi:', newManager);
      toast.success('Yönetici başarıyla eklendi!');
      
      // Form'u sıfırla
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        department: '',
        position: '',
        roles: [],
        avatar: undefined,
        notes: '',
      });
      setSelectedRoles([]);
      setAvatarPreview(null);
      setHasChanges(false);
      
      router.push('/admin/users?role=admin');
    } catch (error) {
      toast.error('Yönetici eklenirken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation with unsaved changes warning
  const handleNavigation = (path: string) => {
    if (hasChanges) {
      setPendingNavigation(path);
      setShowExitModal(true);
    } else {
      router.push(path);
    }
  };

  // Confirm exit
  const confirmExit = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  // Cancel exit
  const cancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Yönetici Ekle"
        subtitle="Sisteme yeni yönetici ekleyin"
        icon={<Plus className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Yöneticiler",
              href: "/admin/users?role=admin",
              icon: <User className="h-3 w-3" />
            },
            {
              label: "Yeni Yönetici",
              active: true
            }
          ]
        }}
      />

      <div className="pt-24 p-6">
        <div className="space-y-6">
          {/* Unsaved Changes Modal */}
          {showExitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelExit} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Kaydedilmemiş Değişiklikler
                  </h3>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Kaydedilmemiş değişiklikler var. Çıkmak istediğinizden emin misiniz?
                </p>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={cancelExit}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmExit}
                    className="flex-1"
                  >
                    Çık
                  </Button>
                </div>
              </motion.div>
            </div>
          )}


          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Ad *</label>
                      <input
                        {...register('firstName')}
                        className="input w-full"
                        placeholder="Ad"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Soyad *</label>
                      <input
                        {...register('lastName')}
                        className="input w-full"
                        placeholder="Soyad"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">E-posta *</label>
                      <input
                        {...register('email')}
                        className="input w-full"
                        placeholder="ornek@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefon *</label>
                      <input
                        {...register('phone')}
                        className="input w-full"
                        placeholder="+90 5XX XXX XX XX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Departman *</label>
                      <select {...register('department')} className="input w-full">
                        <option value="">Departman seçin</option>
                        <option value="Bilgi İşlem">Bilgi İşlem</option>
                        <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                        <option value="Muhasebe">Muhasebe</option>
                        <option value="Pazarlama">Pazarlama</option>
                        <option value="Satış">Satış</option>
                        <option value="Yönetim">Yönetim</option>
                      </select>
                      {errors.department && (
                        <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Pozisyon *</label>
                      <select {...register('position')} className="input w-full">
                        <option value="">Pozisyon seçin</option>
                        <option value="Sistem Yöneticisi">Sistem Yöneticisi</option>
                        <option value="IT Yöneticisi">IT Yöneticisi</option>
                        <option value="Proje Yöneticisi">Proje Yöneticisi</option>
                        <option value="Takım Lideri">Takım Lideri</option>
                        <option value="Uzman">Uzman</option>
                      </select>
                      {errors.position && (
                        <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Hesap Bilgileri</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Kullanıcı Adı *</label>
                      <input
                        {...register('username')}
                        className="input w-full"
                        placeholder="Kullanıcı adı"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Şifre *</label>
                      <div className="relative">
                        <input
                          {...register('password')}
                          type={showPassword ? "text" : "password"}
                          className="input pr-10 w-full"
                          placeholder="Şifre"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Generate Password Button */}
                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generatePassword}
                        className="w-full md:w-auto"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Otomatik Şifre Oluştur
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview, Tags & Actions */}
              <div className="space-y-6">
                {/* Yönetici Önizleme */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Yönetici Önizleme</h2>

                  {/* Kimlik Kartı Görünümü */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200 dark:border-gray-500">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Bilgiler */}
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {watch('firstName') && watch('lastName') 
                            ? `${watch('firstName')} ${watch('lastName')}`
                            : 'Ad Soyad'
                          }
                        </div>
                        
                        {watch('department') && (
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            {watch('department')}
                          </div>
                        )}
                        
                        {watch('position') && (
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            {watch('position')}
                          </div>
                        )}

                        {watch('email') && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {watch('email')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Roles */}
                  {selectedRoles.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Roller:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoles.map((roleId) => {
                          const role = availableRoles.find(r => r.id === roleId);
                          return (
                            <span
                              key={roleId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              {role?.name || roleId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Roles */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Roller *</h2>

                  <div className="space-y-3">
                    {/* Role Selector */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rol seç veya ara..."
                        className="input w-full pr-10 cursor-pointer"
                        onClick={() => setShowRoleSelector(!showRoleSelector)}
                        readOnly
                      />
                      <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      {showRoleSelector && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowRoleSelector(false)}
                          />
                          
                          <div className="absolute top-full left-0 right-0 mt-2 z-50">
                            <Command className="rounded-lg border border-border bg-background shadow-lg backdrop-blur-sm">
                              <CommandInput 
                                placeholder="Rol ara..." 
                                className="border-0 focus:ring-0 focus:outline-none"
                                autoFocus
                              />
                              <CommandList className="max-h-48 overflow-y-auto">
                                <CommandEmpty className="py-4 text-center text-muted-foreground">
                                  Rol bulunamadı.
                                </CommandEmpty>
                                <CommandGroup>
                                  {availableRoles.map((role) => (
                                    <CommandItem
                                      key={role.id}
                                      onSelect={() => {
                                        handleRoleToggle(role.id);
                                        setShowRoleSelector(false);
                                      }}
                                      className="flex items-center space-x-3 px-3 py-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors"
                                    >
                                      <div className="flex items-center justify-center w-4 h-4">
                                        <input
                                          type="checkbox"
                                          checked={selectedRoles.includes(role.id)}
                                          onChange={() => {}}
                                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium">{role.name}</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                          {role.description}
                                        </p>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </div>
                        </>
                      )}
                    </div>

                    {errors.roles && (
                      <p className="text-red-500 text-sm">{errors.roles.message}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Kaydediliyor...' : 'Yöneticiyi Kaydet'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleNavigation('/admin/users?role=admin')}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    İptal
                  </Button>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}