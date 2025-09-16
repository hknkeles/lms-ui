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
  Activity,
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

interface EmployeeStatus {
  id: string
  name: string
  code: string
  description: string
  isActive: boolean
  employeeCount: number
  color: string
  category: string
  createdAt: string
  updatedAt: string
}

interface StatusFormData {
  name: string
  code: string
  description: string
  isActive: boolean
  color: string
  category: string
}

// Mock data - gerçek uygulamada API'den gelecek
const mockStatuses: EmployeeStatus[] = [
  {
    id: '1',
    name: 'Aktif',
    code: 'active',
    description: 'Aktif çalışan personel durumu',
    isActive: true,
    employeeCount: 120,
    color: '#10b981',
    category: 'Çalışma',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Geçici Görev',
    code: 'temporary_duty',
    description: 'Geçici görevde olan personel durumu',
    isActive: true,
    employeeCount: 8,
    color: '#3b82f6',
    category: 'Çalışma',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Ücretsiz İzin',
    code: 'unpaid_leave',
    description: 'Ücretsiz izinde olan personel durumu',
    isActive: true,
    employeeCount: 5,
    color: '#f59e0b',
    category: 'İzin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Raporlu',
    code: 'sick_leave',
    description: 'Sağlık raporunda olan personel durumu',
    isActive: true,
    employeeCount: 12,
    color: '#ef4444',
    category: 'İzin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'Naklen Giden',
    code: 'transferred',
    description: 'Başka kuruma naklen giden personel durumu',
    isActive: false,
    employeeCount: 3,
    color: '#6b7280',
    category: 'Transfer',
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
  'Çalışma', 'İzin', 'Transfer', 'Eğitim', 'Disiplin', 'Diğer'
]

// Durum Ekleme/Düzenleme Modal Bileşeni
const StatusModal = ({
  status,
  isOpen,
  onClose,
  onSave,
}: {
  status: EmployeeStatus | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: StatusFormData) => void
}) => {
  const [formData, setFormData] = useState<StatusFormData>({
    name: '',
    code: '',
    description: '',
    isActive: true,
    color: '#3b82f6',
    category: 'Çalışma',
  })

  // Form açıldığında mevcut veriyi yükle
  useEffect(() => {
    if (status && isOpen) {
      setFormData({
        name: status.name,
        code: status.code,
        description: status.description,
        isActive: status.isActive,
        color: status.color,
        category: status.category,
      })
    } else if (!status && isOpen) {
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true,
        color: '#3b82f6',
        category: 'Çalışma',
      })
    }
  }, [status, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Durum adı ve kodu zorunludur')
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
                  {status ? 'Durum Düzenle' : 'Yeni Durum Ekle'}
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
                    Durum Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Durum adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Durum Kodu *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Durum kodunu girin"
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
                    placeholder="Durum açıklamasını girin"
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
                    {status ? 'Güncelle' : 'Ekle'}
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

export default function DurumlarPage() {
  const queryClient = useQueryClient()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<EmployeeStatus | null>(null)

  // Query - gerçek uygulamada API'den gelecek
  const { data: statuses = mockStatuses, isLoading } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => Promise.resolve(mockStatuses),
  })

  // Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: async (statusId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      toast.success('Durum durumu güncellendi')
    },
    onError: () => {
      toast.error('Durum durumu güncellenirken hata oluştu')
    },
  })

  const deleteStatusMutation = useMutation({
    mutationFn: async (statusId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      toast.success('Durum silindi')
    },
    onError: () => {
      toast.error('Durum silinirken hata oluştu')
    },
  })

  // Filtered data
  const filteredStatuses = useMemo(() => {
    let filtered = statuses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (status) =>
          status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((status) =>
        statusFilter === 'active' ? status.isActive : !status.isActive
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((status) => status.category === categoryFilter)
    }

    return filtered
  }, [statuses, searchTerm, statusFilter, categoryFilter])

  // Handlers
  const handleSaveStatus = (data: StatusFormData) => {
    if (editingStatus) {
      // Güncelleme işlemi
      toast.success(`Durum güncellendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    } else {
      // Ekleme işlemi
      toast.success(`Yeni durum eklendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    }
    // Gerçek uygulamada API çağrısı yapılacak
    console.log('Kaydedilecek veri:', data)
  }

  const handleEdit = (status: EmployeeStatus) => {
    setEditingStatus(status)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingStatus(null)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (statusId: string) => {
    toggleStatusMutation.mutate(statusId)
  }

  const handleDelete = (statusId: string) => {
    if (confirm('Bu durumu silmek istediğinizden emin misiniz?')) {
      deleteStatusMutation.mutate(statusId)
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
          <Activity className="h-4 w-4" />
          <span>Durumlar</span>
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
            Durum Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm durumları görüntüleyin ve yönetin
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Durum Ekle</span>
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
              placeholder="Durum ara..."
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

      {/* Statuses Grid */}
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
        ) : filteredStatuses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Durum bulunamadı
            </h3>
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun durum bulunamadı.
            </p>
          </div>
        ) : (
          filteredStatuses.map((status) => (
            <motion.div
              key={status.id}
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
                      style={{ backgroundColor: status.color }}
                    />
                    <h3 className="text-lg font-semibold text-foreground">
                      {status.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kod: {status.code} | Kategori: {status.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(status.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      status.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={status.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {status.isActive ? (
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
              {status.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {status.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{status.employeeCount} personel</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {status.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(status)}
                  className="btn btn-sm btn-secondary flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(status.id)}
                  className="btn btn-sm btn-destructive"
                  disabled={status.employeeCount > 0}
                  title={
                    status.employeeCount > 0
                      ? 'Personeli olan durum silinemez'
                      : 'Durumu sil'
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Status Modal */}
      <StatusModal
        status={editingStatus}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStatus(null)
        }}
        onSave={handleSaveStatus}
      />
    </div>
  )
}
