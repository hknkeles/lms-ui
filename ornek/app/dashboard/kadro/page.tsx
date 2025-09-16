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
  Users,
  UserCheck,
  XCircle,
  MoreHorizontal,
  Home,
  ChevronRight,
  Briefcase,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Kadro {
  id: string
  name: string
  code: string
  description: string
  isActive: boolean
  employeeCount: number
  createdAt: string
  updatedAt: string
}

interface KadroFormData {
  name: string
  code: string
  description: string
  isActive: boolean
}

// Mock data - gerçek uygulamada API'den gelecek
const mockKadro: Kadro[] = [
  {
    id: '1',
    name: 'Kadrolu',
    code: 'KD',
    description: 'Kadrolu personel statüsü',
    isActive: true,
    employeeCount: 156,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Sözleşmeli',
    code: 'SZ',
    description: 'Sözleşmeli personel statüsü',
    isActive: true,
    employeeCount: 89,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Geçici',
    code: 'GC',
    description: 'Geçici personel statüsü',
    isActive: true,
    employeeCount: 23,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'İşçi',
    code: 'IC',
    description: 'İşçi personel statüsü',
    isActive: false,
    employeeCount: 12,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'Stajyer',
    code: 'ST',
    description: 'Stajyer personel statüsü',
    isActive: true,
    employeeCount: 8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Kadro Ekleme/Düzenleme Modal Bileşeni
const KadroModal = ({
  kadro,
  isOpen,
  onClose,
  onSave,
}: {
  kadro: Kadro | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: KadroFormData) => void
}) => {
  const [formData, setFormData] = useState<KadroFormData>({
    name: '',
    code: '',
    description: '',
    isActive: true,
  })

  // Form açıldığında mevcut veriyi yükle
  useEffect(() => {
    if (kadro && isOpen) {
      setFormData({
        name: kadro.name,
        code: kadro.code,
        description: kadro.description,
        isActive: kadro.isActive,
      })
    } else if (!kadro && isOpen) {
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true,
      })
    }
  }, [kadro, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Kadro adı ve kodu zorunludur')
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
                  {kadro ? 'Kadro Düzenle' : 'Yeni Kadro Ekle'}
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
                    Kadro Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Kadro adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Kadro Kodu *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Kadro kodunu girin"
                    required
                  />
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
                    placeholder="Kadro açıklamasını girin"
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
                    {kadro ? 'Güncelle' : 'Ekle'}
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

export default function KadroPage() {
  const queryClient = useQueryClient()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKadro, setEditingKadro] = useState<Kadro | null>(null)

  // Query - gerçek uygulamada API'den gelecek
  const { data: kadroList = mockKadro, isLoading } = useQuery({
    queryKey: ['kadro'],
    queryFn: () => Promise.resolve(mockKadro),
  })

  // Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: async (kadroId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadro'] })
      toast.success('Kadro durumu güncellendi')
    },
    onError: () => {
      toast.error('Kadro durumu güncellenirken hata oluştu')
    },
  })

  const deleteKadroMutation = useMutation({
    mutationFn: async (kadroId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadro'] })
      toast.success('Kadro silindi')
    },
    onError: () => {
      toast.error('Kadro silinirken hata oluştu')
    },
  })

  // Filtered data
  const filteredKadro = useMemo(() => {
    let filtered = kadroList

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (kadro) =>
          kadro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kadro.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((kadro) =>
        statusFilter === 'active' ? kadro.isActive : !kadro.isActive
      )
    }

    return filtered
  }, [kadroList, searchTerm, statusFilter])

  // Handlers
  const handleSaveKadro = (data: KadroFormData) => {
    if (editingKadro) {
      // Güncelleme işlemi
      toast.success(`Kadro güncellendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    } else {
      // Ekleme işlemi
      toast.success(`Yeni kadro eklendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    }
    // Gerçek uygulamada API çağrısı yapılacak
    console.log('Kaydedilecek veri:', data)
  }

  const handleEdit = (kadro: Kadro) => {
    setEditingKadro(kadro)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingKadro(null)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (kadroId: string) => {
    toggleStatusMutation.mutate(kadroId)
  }

  const handleDelete = (kadroId: string) => {
    if (confirm('Bu kadroyu silmek istediğinizden emin misiniz?')) {
      deleteKadroMutation.mutate(kadroId)
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
          <Users className="h-4 w-4" />
          <span>Kadro</span>
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
            Kadro Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm kadro türlerini görüntüleyin ve yönetin
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Kadro Ekle</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card p-6 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Kadro ara..."
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

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
            }}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreleri Temizle
          </button>
        </div>
      </motion.div>

      {/* Kadro Grid */}
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
        ) : filteredKadro.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Kadro bulunamadı
            </h3>
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun kadro bulunamadı.
            </p>
          </div>
        ) : (
          filteredKadro.map((kadro) => (
            <motion.div
              key={kadro.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {kadro.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kod: {kadro.code}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(kadro.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      kadro.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={kadro.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {kadro.isActive ? (
                      <UserCheck className="h-5 w-5" />
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
              {kadro.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {kadro.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{kadro.employeeCount} personel</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    kadro.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {kadro.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(kadro)}
                  className="btn btn-sm btn-secondary flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(kadro.id)}
                  className="btn btn-sm btn-destructive"
                  disabled={kadro.employeeCount > 0}
                  title={
                    kadro.employeeCount > 0
                      ? 'Personeli olan kadro silinemez'
                      : 'Kadroyu sil'
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Kadro Modal */}
      <KadroModal
        kadro={editingKadro}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingKadro(null)
        }}
        onSave={handleSaveKadro}
      />
    </div>
  )
}
