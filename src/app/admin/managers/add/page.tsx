"use client";

import { useState, useRef, useEffect } from "react";
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
  Upload,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  CalendarIcon,
  Tag,
  DollarSign,
  Users,
  Hash,
  GraduationCap,
  Scale,
  Building,
  Baby,
  Home,
  Plus,
  AlertTriangle,
  Lock,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  birthDate: z.date({
    required_error: 'Doğum tarihi gerekli',
  }),
  startDate: z.date({
    required_error: 'Başlangıç tarihi gerekli',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Durum seçin',
  }),
  tags: z.array(z.string()).min(1, 'En az bir etiket seçin'),
  avatar: z.any().optional(),
  notes: z.string().optional(),
  emailConfirmation: z.boolean().default(true),
  kvkkAgreement: z.boolean().refine(val => val === true, "KVKK sözleşmesini kabul etmelisiniz"),
});

type ManagerFormData = z.infer<typeof managerSchema>;

// Available tags for selection
const availableTags = [
  'Sistem Yöneticisi',
  'Yönetici',
  'Uzman',
  'Yeni Başlayan',
  'Önemli',
];

export default function AddManagerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
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
      birthDate: new Date(),
      startDate: new Date(),
      status: 'active',
      tags: [],
      notes: '',
      emailConfirmation: true,
      kvkkAgreement: false,
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

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    setValue('tags', newTags);
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
        birthDate: new Date(),
        startDate: new Date(),
        status: 'active',
        tags: [],
        notes: '',
        emailConfirmation: true,
        kvkkAgreement: false,
      });
      setSelectedTags([]);
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
                {/* Personal Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Kişisel Bilgiler
                  </h2>

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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Soyad *
                      </label>
                      <input
                        {...register('lastName')}
                        className="input w-full"
                        placeholder="Soyad"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kullanıcı Adı *
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          {...register('username')}
                          className="input pl-10 w-full"
                          placeholder="Kullanıcı adı"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        E-posta *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          {...register('email')}
                          className="input pl-10 w-full"
                          placeholder="ornek@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Telefon *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          {...register('phone')}
                          className="input pl-10 w-full"
                          placeholder="+90 5XX XXX XX XX"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Doğum Tarihi *
                      </label>
                      <div className="relative">
                        <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          {...register('birthDate', { 
                            valueAsDate: true,
                            setValueAs: (value) => value ? new Date(value) : new Date()
                          })}
                          className="input pl-10 w-full"
                          onChange={(e) => {
                            if (e.target.value) {
                              setValue('birthDate', new Date(e.target.value));
                              setHasChanges(true);
                            }
                          }}
                        />
                      </div>
                      {errors.birthDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.birthDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    İş Bilgileri
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Departman *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          {...register('department')}
                          className="input pl-10 w-full"
                        >
                          <option value="">Departman seçin</option>
                          <option value="Bilgi İşlem">Bilgi İşlem</option>
                          <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                          <option value="Muhasebe">Muhasebe</option>
                          <option value="Pazarlama">Pazarlama</option>
                          <option value="Satış">Satış</option>
                          <option value="Yönetim">Yönetim</option>
                        </select>
                      </div>
                      {errors.department && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.department.message}
                        </p>
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pozisyon *
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          {...register('position')}
                          className="input pl-10 w-full"
                        >
                          <option value="">Pozisyon seçin</option>
                          <option value="Sistem Yöneticisi">Sistem Yöneticisi</option>
                          <option value="IT Yöneticisi">IT Yöneticisi</option>
                          <option value="Proje Yöneticisi">Proje Yöneticisi</option>
                          <option value="Takım Lideri">Takım Lideri</option>
                          <option value="Uzman">Uzman</option>
                        </select>
                      </div>
                      {errors.position && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.position.message}
                        </p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        İşe Başlama Tarihi *
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          {...register('startDate', { 
                            valueAsDate: true,
                            setValueAs: (value) => value ? new Date(value) : new Date()
                          })}
                          className="input pl-10 w-full"
                          onChange={(e) => {
                            if (e.target.value) {
                              setValue('startDate', new Date(e.target.value));
                              setHasChanges(true);
                            }
                          }}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Durum *
                      </label>
                      <select {...register('status')} className="input w-full">
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Güvenlik Bilgileri
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Şifre *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          {...register('password')}
                          type="password"
                          className="input pl-10 w-full"
                          placeholder="Şifre"
                        />
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Generate Password Button */}
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generatePassword}
                        className="w-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Şifre Oluştur
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Notlar ve Onaylar
                  </h2>

                  <div className="space-y-4">
                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Notlar
                      </label>
                      <textarea
                        {...register('notes')}
                        className="input w-full min-h-[100px] resize-none"
                        placeholder="Yönetici hakkında notlar..."
                        rows={4}
                        onChange={(e) => {
                          setValue('notes', e.target.value);
                          setHasChanges(true);
                        }}
                      />
                      {errors.notes && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.notes.message}
                        </p>
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="emailConfirmation"
                          checked={watch("emailConfirmation")}
                          onCheckedChange={(checked) => {
                            setValue("emailConfirmation", !!checked);
                            setHasChanges(true);
                          }}
                        />
                        <label htmlFor="emailConfirmation" className="text-sm font-medium">
                          Email Onay
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="kvkkAgreement"
                          checked={watch("kvkkAgreement")}
                          onCheckedChange={(checked) => {
                            setValue("kvkkAgreement", !!checked);
                            setHasChanges(true);
                          }}
                        />
                        <label htmlFor="kvkkAgreement" className="text-sm font-medium">
                          KVKK Aydınlatma Metni
                        </label>
                        <span className="text-sm text-muted-foreground">
                          KVKK sözleşmesini okudum, kabul ediyorum.
                        </span>
                      </div>
                      {errors.kvkkAgreement && (
                        <p className="text-sm text-destructive">
                          {errors.kvkkAgreement.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Avatar & Actions */}
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4">Profil Fotoğrafı</h2>

                  <div className="space-y-4">
                    {/* Avatar Preview and Upload Button */}
                    <div className="flex items-center space-x-4">
                      {/* Avatar Preview */}
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-16 h-16 text-muted-foreground" />
                          )}
                        </div>

                        {avatarPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setAvatarPreview(null);
                              setValue('avatar', undefined);
                              setHasChanges(true);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Fotoğraf Yükle
                        </Button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />

                        <p className="text-xs text-muted-foreground mt-2">
                          PNG, JPG veya GIF. Maksimum 5MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Etiketler *
                  </h2>

                  <div className="space-y-4">
                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagToggle(tag)}
                              className="ml-2 hover:bg-primary/20 rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tag Selector */}
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Etiket seç veya ara..."
                          className="input w-full pr-10 cursor-pointer"
                          onClick={() => setShowTagSelector(!showTagSelector)}
                          readOnly
                        />
                        <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>

                      {showTagSelector && (
                        <>
                          {/* Backdrop for closing dropdown */}
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowTagSelector(false)}
                          />
                          
                          <div className="absolute top-full left-0 right-0 mt-2 z-50">
                            <Command className="rounded-lg border border-border bg-background shadow-lg backdrop-blur-sm">
                              <CommandInput 
                                placeholder="Etiket ara..." 
                                className="border-0 focus:ring-0 focus:outline-none"
                                autoFocus
                              />
                              <CommandList className="max-h-48 overflow-y-auto">
                                <CommandEmpty className="py-4 text-center text-muted-foreground">
                                  Etiket bulunamadı.
                                </CommandEmpty>
                                <CommandGroup>
                                  {availableTags.map((tag) => (
                                    <CommandItem
                                      key={tag}
                                      onSelect={() => {
                                        handleTagToggle(tag);
                                        setShowTagSelector(false);
                                      }}
                                      className="flex items-center space-x-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                                    >
                                      <div className="flex items-center justify-center w-4 h-4">
                                        <input
                                          type="checkbox"
                                          checked={selectedTags.includes(tag)}
                                          onChange={() => {}}
                                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
                                        />
                                      </div>
                                      <span className="text-sm font-medium">{tag}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </div>
                        </>
                      )}
                    </div>

                    {errors.tags && (
                      <p className="text-red-500 text-sm">{errors.tags.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleNavigation('/admin/users?role=admin')}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}