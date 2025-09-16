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
  Tag,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Palette,
  Home,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface EmployeeTag {
  id: string
  name: string
  color: string
  description: string
  isActive: boolean
  employeeCount: number
  category: string
  createdAt: string
  updatedAt: string
}

interface TagFormData {
  name: string
  color: string
  description: string
  isActive: boolean
  category: string
}

// Mock data - gerçek uygulamada API'den gelecek
const mockTags: EmployeeTag[] = [
  {
    id: '1',
    name: 'Önemli',
    color: '#ef4444',
    description: 'Önemli personel etiketi',
    isActive: true,
    employeeCount: 15,
    category: 'Öncelik',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Yeni Başlayan',
    color: '#3b82f6',
    description: 'Yeni işe başlayan personel etiketi',
    isActive: true,
    employeeCount: 8,
    category: 'Deneyim',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Uzman',
    color: '#10b981',
    description: 'Uzman personel etiketi',
    isActive: true,
    employeeCount: 25,
    category: 'Deneyim',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Geçici',
    color: '#f59e0b',
    description: 'Geçici personel etiketi',
    isActive: false,
    employeeCount: 12,
    category: 'İstihdam',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'Yönetici',
    color: '#8b5cf6',
    description: 'Yönetici personel etiketi',
    isActive: true,
    employeeCount: 18,
    category: 'Pozisyon',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Renk seçenekleri
const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e', '#6b7280', '#374151', '#1f2937'
]

// Kategori seçenekleri
const categoryOptions = [
  'Öncelik', 'Deneyim', 'İstihdam', 'Pozisyon', 'Proje', 'Eğitim', 'Diğer'
]

// Etiket Ekleme/Düzenleme Modal Bileşeni
const TagModal = ({
  tag,
  isOpen,
  onClose,
  onSave,
}: {
  tag: EmployeeTag | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: TagFormData) => void
}) => {
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    color: '#3b82f6',
    description: '',
    isActive: true,
    category: 'Diğer',
  })

  // Form açıldığında mevcut veriyi yükle
  useEffect(() => {
    if (tag && isOpen) {
      setFormData({
        name: tag.name,
        color: tag.color,
        description: tag.description,
        isActive: tag.isActive,
        category: tag.category,
      })
    } else if (!tag && isOpen) {
      setFormData({
        name: '',
        color: '#3b82f6',
        description: '',
        isActive: true,
        category: 'Diğer',
      })
    }
  }, [tag, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Etiket adı zorunludur')
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
                  {tag ? 'Etiket Düzenle' : 'Yeni Etiket Ekle'}
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
                    Etiket Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Etiket adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="input w-full"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Renk
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color
                            ? 'border-foreground scale-110'
                            : 'border-border hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
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
                    placeholder="Etiket açıklamasını girin"
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
                    {tag ? 'Güncelle' : 'Ekle'}
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

export default function EtiketlerPage() {
  const queryClient = useQueryClient()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<EmployeeTag | null>(null)

  // Query - gerçek uygulamada API'den gelecek
  const { data: tags = mockTags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => Promise.resolve(mockTags),
  })

  // Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: async (tagId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Etiket durumu güncellendi')
    },
    onError: () => {
      toast.error('Etiket durumu güncellenirken hata oluştu')
    },
  })

  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Etiket silindi')
    },
    onError: () => {
      toast.error('Etiket silinirken hata oluştu')
    },
  })

  // Filtered data
  const filteredTags = useMemo(() => {
    let filtered = tags

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((tag) =>
        statusFilter === 'active' ? tag.isActive : !tag.isActive
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((tag) => tag.category === categoryFilter)
    }

    return filtered
  }, [tags, searchTerm, statusFilter, categoryFilter])

  // Handlers
  const handleSaveTag = (data: TagFormData) => {
    if (editingTag) {
      // Güncelleme işlemi
      toast.success(`Etiket güncellendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    } else {
      // Ekleme işlemi
      toast.success(`Yeni etiket eklendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    }
    // Gerçek uygulamada API çağrısı yapılacak
    console.log('Kaydedilecek veri:', data)
  }

  const handleEdit = (tag: EmployeeTag) => {
    setEditingTag(tag)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingTag(null)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (tagId: string) => {
    toggleStatusMutation.mutate(tagId)
  }

  const handleDelete = (tagId: string) => {
    if (confirm('Bu etiketi silmek istediğinizden emin misiniz?')) {
      deleteTagMutation.mutate(tagId)
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
          <Tag className="h-4 w-4" />
          <span>Etiketler</span>
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
            Etiket Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm etiketleri görüntüleyin ve yönetin
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Etiket Ekle</span>
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
              placeholder="Etiket ara..."
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
          >
            <option value="all">Tüm Kategoriler</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setCategoryFilter('all')
            }}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreleri Temizle
          </button>
        </div>
      </motion.div>

      {/* Tags Grid */}
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
        ) : filteredTags.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Etiket bulunamadı
            </h3>
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun etiket bulunamadı.
            </p>
          </div>
        ) : (
          filteredTags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <h3 className="text-lg font-semibold text-foreground">
                      {tag.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kategori: {tag.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(tag.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      tag.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={tag.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {tag.isActive ? (
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
              {tag.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tag.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{tag.employeeCount} personel</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tag.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tag.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(tag)}
                  className="btn btn-sm btn-secondary flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="btn btn-sm btn-destructive"
                  disabled={tag.employeeCount > 0}
                  title={
                    tag.employeeCount > 0
                      ? 'Personeli olan etiket silinemez'
                      : 'Etiketi sil'
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Tag Modal */}
      <TagModal
        tag={editingTag}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTag(null)
        }}
        onSave={handleSaveTag}
      />
    </div>
  )
}
