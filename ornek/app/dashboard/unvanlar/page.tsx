'use client'

import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  X,
  GraduationCap,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Home,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Title {
  id: string
  name: string
  code: string
  description: string
  isActive: boolean
  employeeCount: number
  level: number
  createdAt: string
  updatedAt: string
}

interface TitleFormData {
  name: string
  code: string
  description: string
  isActive: boolean
  level: number
}

// Mock data - gerçek uygulamada API'den gelecek
const mockTitles: Title[] = [
  {
    id: '1',
    name: 'Adalet Bakanı',
    code: 'AB',
    description: 'Adalet Bakanlığı en üst yönetici pozisyonu',
    isActive: true,
    employeeCount: 1,
    level: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Müsteşar',
    code: 'MST',
    description: 'Adalet Bakanlığı müsteşar pozisyonu',
    isActive: true,
    employeeCount: 1,
    level: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Genel Müdür',
    code: 'GM',
    description: 'Genel müdür pozisyonu',
    isActive: true,
    employeeCount: 8,
    level: 3,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Daire Başkanı',
    code: 'DB',
    description: 'Daire başkanı pozisyonu',
    isActive: true,
    employeeCount: 25,
    level: 4,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'Şube Müdürü',
    code: 'SM',
    description: 'Şube müdürü pozisyonu',
    isActive: false,
    employeeCount: 12,
    level: 5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Ünvan Ekleme/Düzenleme Modal Bileşeni
const TitleModal = ({
  title,
  isOpen,
  onClose,
  onSave,
}: {
  title: Title | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: TitleFormData) => void
}) => {
  const [formData, setFormData] = useState<TitleFormData>({
    name: '',
    code: '',
    description: '',
    isActive: true,
    level: 1,
  })

  // Form açıldığında mevcut veriyi yükle
  useEffect(() => {
    if (title && isOpen) {
      setFormData({
        name: title.name,
        code: title.code,
        description: title.description,
        isActive: title.isActive,
        level: title.level,
      })
    } else if (!title && isOpen) {
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true,
        level: 1,
      })
    }
  }, [title, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Ünvan adı ve kodu zorunludur')
      return
    }
    onSave(formData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-foreground">
                  {title ? 'Ünvan Düzenle' : 'Yeni Ünvan Ekle'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ünvan Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Ünvan adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ünvan Kodu *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Ünvan kodunu girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Seviye *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, level: parseInt(e.target.value) }))
                    }
                    className="input w-full"
                  >
                    <option value={1}>1 - En Üst Seviye</option>
                    <option value={2}>2 - Üst Seviye</option>
                    <option value={3}>3 - Orta Üst Seviye</option>
                    <option value={4}>4 - Orta Seviye</option>
                    <option value={5}>5 - Alt Orta Seviye</option>
                    <option value={6}>6 - Alt Seviye</option>
                    <option value={7}>7 - En Alt Seviye</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="input w-full resize-none"
                    rows={3}
                    placeholder="Ünvan açıklamasını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.value === 'active' }))
                    }
                    className="input w-full"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {title ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function UnvanlarPage() {
  const queryClient = useQueryClient()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState<Title | null>(null)

  // Query - gerçek uygulamada API'den gelecek
  const { data: titles = mockTitles, isLoading } = useQuery({
    queryKey: ['titles'],
    queryFn: () => Promise.resolve(mockTitles),
  })

  // Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: async (titleId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] })
      toast.success('Ünvan durumu güncellendi')
    },
    onError: () => {
      toast.error('Ünvan durumu güncellenirken hata oluştu')
    },
  })

  const deleteTitleMutation = useMutation({
    mutationFn: async (titleId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] })
      toast.success('Ünvan silindi')
    },
    onError: () => {
      toast.error('Ünvan silinirken hata oluştu')
    },
  })

  // Filtered data
  const filteredTitles = useMemo(() => {
    let filtered = titles

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (title) =>
          title.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          title.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((title) =>
        statusFilter === 'active' ? title.isActive : !title.isActive
      )
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter((title) => title.level === levelFilter)
    }

    return filtered
  }, [titles, searchTerm, statusFilter, levelFilter])

  // Handlers
  const handleSaveTitle = (data: TitleFormData) => {
    if (editingTitle) {
      // Güncelleme işlemi
      toast.success(`Ünvan güncellendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    } else {
      // Ekleme işlemi
      toast.success(`Yeni ünvan eklendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    }
    // Gerçek uygulamada API çağrısı yapılacak
    console.log('Kaydedilecek veri:', data)
  }

  const handleEdit = (title: Title) => {
    setEditingTitle(title)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingTitle(null)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (titleId: string) => {
    toggleStatusMutation.mutate(titleId)
  }

  const handleDelete = (titleId: string) => {
    if (confirm('Bu ünvanı silmek istediğinizden emin misiniz?')) {
      deleteTitleMutation.mutate(titleId)
    }
  }

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return 'En Üst Seviye'
      case 2: return 'Üst Seviye'
      case 3: return 'Orta Üst Seviye'
      case 4: return 'Orta Seviye'
      case 5: return 'Alt Orta Seviye'
      case 6: return 'Alt Seviye'
      case 7: return 'En Alt Seviye'
      default: return `Seviye ${level}`
    }
  }

  return (
    <div className="space-y-6">
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
        <span className="text-foreground font-medium flex items-center space-x-1 px-2 py-1 rounded-md bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm">
          <GraduationCap className="h-4 w-4" />
          <span>Unvanlar</span>
        </span>
      </motion.nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between w-full"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Unvan Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm unvanları görüntüleyin ve yönetin
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Unvan Ekle</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card p-6 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ünvan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="input"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="input"
          >
            <option value="all">Tüm Seviyeler</option>
            <option value={1}>1 - En Üst Seviye</option>
            <option value={2}>2 - Üst Seviye</option>
            <option value={3}>3 - Orta Üst Seviye</option>
            <option value={4}>4 - Orta Seviye</option>
            <option value={5}>5 - Alt Orta Seviye</option>
            <option value={6}>6 - Alt Seviye</option>
            <option value={7}>7 - En Alt Seviye</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setLevelFilter('all')
            }}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreleri Temizle
          </button>
        </div>
      </motion.div>

      {/* Titles Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))
        ) : filteredTitles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Ünvan bulunamadı
            </h3>
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun ünvan bulunamadı.
            </p>
          </div>
        ) : (
          filteredTitles.map((title) => (
            <motion.div
              key={title.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {title.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kod: {title.code}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(title.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      title.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={title.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {title.isActive ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </button>

                  {/* More Actions */}
                  <div className="relative">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              {title.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {title.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{title.employeeCount} personel</span>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      title.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {title.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getLevelText(title.level)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(title)}
                  className="btn btn-sm btn-secondary flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(title.id)}
                  className="btn btn-sm btn-destructive"
                  disabled={title.employeeCount > 0}
                  title={
                    title.employeeCount > 0
                      ? 'Personeli olan ünvan silinemez'
                      : 'Ünvanı sil'
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Title Modal */}
      <TitleModal
        title={editingTitle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTitle(null)
        }}
        onSave={handleSaveTitle}
      />
    </div>
  )
}
