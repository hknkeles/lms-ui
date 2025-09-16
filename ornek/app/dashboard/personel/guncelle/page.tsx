'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
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
  ChevronRight,
  Edit,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk'
import {
  employeeSchema,
  type EmployeeFormData,
} from '@/lib/validations/employee'
import { getDepartments, getLocations, getStatuses, getKadroTypes } from '@/lib/data/employees'

// Available tags for selection - yönetim altındaki etiketlerden alınacak
const availableTags = [
  'Önemli',
  'Yeni Başlayan',
  'Uzman',
  'Geçici',
  'Yönetici',
]

export default function GuncellePersonelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showExitModal, setShowExitModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      sicil: '',
      unvan: '',
      kadro: '',
      adliye: '',
      birim: '',
      birthDate: new Date(),
      startDate: new Date(),
      status: 'active',
      separationDate: undefined,
      separationReason: '',
      tags: [],
      notes: '',
      temporaryDutyLocation: '',
      temporaryDutyEndDate: undefined,
    },
  })

  // Watch form values for change detection
  const watchedValues = watch()

  // Check for changes
  if (isDirty && !hasChanges) {
    setHasChanges(true)
  }

  // URL parametrelerinden personel bilgilerini al ve formu doldur
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setValue('firstName', searchParams.get('firstName') || '')
      setValue('lastName', searchParams.get('lastName') || '')
      setValue('email', searchParams.get('email') || '')
      setValue('phone', searchParams.get('phone') || '')
      setValue('sicil', searchParams.get('sicil') || '')
      setValue('unvan', searchParams.get('unvan') || '')
      setValue('kadro', searchParams.get('kadro') || '')
      setValue('adliye', searchParams.get('adliye') || '')
      setValue('birim', searchParams.get('birim') || '')
      setValue('startDate', searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date())
      setValue('status', (searchParams.get('status') as any) || 'active')
      setValue('separationDate', searchParams.get('separationDate') ? new Date(searchParams.get('separationDate')!) : undefined)
      setValue('separationReason', searchParams.get('separationReason') || '')
      setValue('notes', searchParams.get('notes') || '')
      setValue('temporaryDutyLocation', searchParams.get('temporaryDutyLocation') || '')
      setValue('temporaryDutyEndDate', searchParams.get('temporaryDutyEndDate') ? new Date(searchParams.get('temporaryDutyEndDate')!) : undefined)
      
      const tags = searchParams.get('tags')
      if (tags) {
        const tagArray = tags.split(',').filter(tag => tag.trim() !== '')
        setSelectedTags(tagArray)
        setValue('tags', tagArray)
      }
    }
  }, [searchParams, setValue])

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
        setValue('avatar', file)
        setHasChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(newTags)
    setValue('tags', newTags)
    setHasChanges(true)
  }

  // Handle form submission
  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true)

    try {
      // Mock API call - gerçek uygulamada API'ye gönderilir
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Düzenleme modu - mevcut personeli güncelle
      const employeeId = searchParams.get('id')
      const updatedEmployee = {
        ...data,
        id: employeeId!,
        avatar: avatarPreview || null,
        notes: data.notes || '',
        temporaryDutyLocation: data.temporaryDutyLocation || '',
        temporaryDutyEndDate: data.temporaryDutyEndDate || undefined,
        updatedAt: new Date().toISOString(),
      }

      console.log('Güncellenen personel verisi:', updatedEmployee)
      toast.success('Personel başarıyla güncellendi!')
      
      router.push('/dashboard/personel')
    } catch (error) {
      toast.error('Personel güncellenirken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle navigation with unsaved changes warning
  const handleNavigation = (path: string) => {
    if (hasChanges) {
      setPendingNavigation(path)
      setShowExitModal(true)
    } else {
      router.push(path)
    }
  }

  // Confirm exit
  const confirmExit = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
    setShowExitModal(false)
    setPendingNavigation(null)
  }

  // Cancel exit
  const cancelExit = () => {
    setShowExitModal(false)
    setPendingNavigation(null)
  }

  return (
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

      {/* Breadcrumb Navigation */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2 text-sm bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg p-3 border border-border/50 shadow-sm backdrop-blur-sm"
        aria-label="Breadcrumb"
      >
        <a
          href="/dashboard"
          className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50 hover:shadow-sm group"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Dashboard</span>
        </a>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <a
          href="/dashboard/personel"
          className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50 hover:shadow-sm group"
        >
          <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Personel</span>
        </a>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="text-foreground font-medium flex items-center space-x-1 px-2 py-1 rounded-md bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm">
          <Edit className="h-4 w-4" />
          <span>Personel Güncelle</span>
        </span>
      </motion.nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleNavigation('/dashboard/personel')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Personel Güncelle
            </h1>
            <p className="text-muted-foreground mt-2">
              Personel bilgilerini düzenleyin
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleNavigation('/dashboard/personel')}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            İptal
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </div>
      </motion.div>

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

                {/* Sicil */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sicil No *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      {...register('sicil')}
                      className="input pl-10 w-full"
                      placeholder="Sicil numarası"
                    />
                  </div>
                  {errors.sicil && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sicil.message}
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
                          setValue('birthDate', new Date(e.target.value))
                          setHasChanges(true)
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
                {/* Unvan */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ünvan *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      {...register('unvan')}
                      className="input pl-10 w-full"
                    >
                      <option value="">Ünvan seçin</option>
                      <option value="Avukat">Avukat</option>
                      <option value="Hakim">Hakim</option>
                      <option value="Savcı">Savcı</option>
                      <option value="Memur">Memur</option>
                      <option value="Şef">Şef</option>
                      <option value="Müdür">Müdür</option>
                      <option value="Başkan">Başkan</option>
                    </select>
                  </div>
                  {errors.unvan && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unvan.message}
                    </p>
                  )}
                </div>

                {/* Kadro */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kadro *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      {...register('kadro')}
                      className="input pl-10 w-full"
                    >
                      <option value="">Kadro seçin</option>
                      {getKadroTypes().map((kadro) => (
                        <option key={kadro} value={kadro}>
                          {kadro}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.kadro && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kadro.message}
                    </p>
                  )}
                </div>

                {/* Adliye */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adliye *
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      {...register('adliye')}
                      className="input pl-10 w-full"
                    >
                      <option value="">Adliye seçin</option>
                      <option value="İstanbul Adliyesi">İstanbul Adliyesi</option>
                      <option value="Ankara Adliyesi">Ankara Adliyesi</option>
                      <option value="İzmir Adliyesi">İzmir Adliyesi</option>
                      <option value="Bursa Adliyesi">Bursa Adliyesi</option>
                      <option value="Antalya Adliyesi">Antalya Adliyesi</option>
                    </select>
                  </div>
                  {errors.adliye && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adliye.message}
                    </p>
                  )}
                </div>

                {/* Birim */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Birim *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      {...register('birim')}
                      className="input pl-10 w-full"
                    >
                      <option value="">Birim seçin</option>
                      <option value="Ceza Mahkemesi">Ceza Mahkemesi</option>
                      <option value="Hukuk Mahkemesi">Hukuk Mahkemesi</option>
                      <option value="İcra Müdürlüğü">İcra Müdürlüğü</option>
                      <option value="Cumhuriyet Başsavcılığı">Cumhuriyet Başsavcılığı</option>
                      <option value="Adalet Komisyonu">Adalet Komisyonu</option>
                      <option value="Ceza Dairesi">Ceza Dairesi</option>
                      <option value="Hukuk Dairesi">Hukuk Dairesi</option>
                      <option value="İcra Dairesi">İcra Dairesi</option>
                    </select>
                  </div>
                  {errors.birim && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.birim.message}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kuruma Başlama Tarihi *
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
                          setValue('startDate', new Date(e.target.value))
                          setHasChanges(true)
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
                    <option value="temporary_duty">Geçici Görev</option>
                    <option value="unpaid_leave">Ücretsiz İzin</option>
                    <option value="sick_leave">Raporlu</option>
                    <option value="transferred">Naklen Giden</option>
                    <option value="resigned">İstifa</option>
                    <option value="retired">Emekli</option>
                    <option value="terminated">İşten Çıkarıldı</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes and Temporary Duty Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Notlar ve Geçici Görev Bilgileri
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Notlar
                  </label>
                  <textarea
                    {...register('notes')}
                    className="input w-full min-h-[100px] resize-none"
                    placeholder="Personel hakkında notlar..."
                    rows={4}
                    onChange={(e) => {
                      setValue('notes', e.target.value)
                      setHasChanges(true)
                    }}
                  />
                  {errors.notes && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.notes.message}
                    </p>
                  )}
                </div>

                {/* Temporary Duty Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Geçici Görev Yeri
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      {...register('temporaryDutyLocation')}
                      className="input pl-10 w-full"
                      placeholder="Geçici görev yeri..."
                      onChange={(e) => {
                        setValue('temporaryDutyLocation', e.target.value)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  {errors.temporaryDutyLocation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryDutyLocation.message}
                    </p>
                  )}
                </div>

                {/* Temporary Duty End Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Geçici Görev Ayrılış Tarihi
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      {...register('temporaryDutyEndDate', { 
                        valueAsDate: true,
                        setValueAs: (value) => value ? new Date(value) : undefined
                      })}
                      className="input pl-10 w-full"
                      onChange={(e) => {
                        if (e.target.value) {
                          setValue('temporaryDutyEndDate', new Date(e.target.value))
                          setHasChanges(true)
                        } else {
                          setValue('temporaryDutyEndDate', undefined)
                          setHasChanges(true)
                        }
                      }}
                    />
                  </div>
                  {errors.temporaryDutyEndDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.temporaryDutyEndDate.message}
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
                          setAvatarPreview(null)
                          setValue('avatar', undefined)
                          setHasChanges(true)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 w-4" />
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
                                    handleTagToggle(tag)
                                    setShowTagSelector(false)
                                  }}
                                  className="flex items-center space-x-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center justify-center w-4 h-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedTags.includes(tag)}
                                      onChange={() => {}}
                                      className="w-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
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

            {/* Separation Information */}
            <div className="card p-6 bg-red-50 border-red-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Ayrılış Bilgileri
              </h2>

              <div className="space-y-4">
                {/* Separation Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ayrılış Tarihi
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      {...register('separationDate', { 
                        valueAsDate: true,
                        setValueAs: (value) => value ? new Date(value) : undefined
                      })}
                      className="input pl-10 w-full"
                      onChange={(e) => {
                        if (e.target.value) {
                          setValue('separationDate', new Date(e.target.value))
                          setHasChanges(true)
                        } else {
                          setValue('separationDate', undefined)
                          setHasChanges(true)
                        }
                      }}
                    />
                  </div>
                  {errors.separationDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.separationDate.message}
                    </p>
                  )}
                </div>

                {/* Separation Reason */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ayrılış Nedeni
                  </label>
                  <textarea
                    {...register('separationReason')}
                    className="input w-full min-h-[80px] resize-none"
                    placeholder="Ayrılış nedeni..."
                    rows={3}
                  />
                  {errors.separationReason && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.separationReason.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.form>
    </div>
  )
}
