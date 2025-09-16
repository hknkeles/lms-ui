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
  Building2,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Home,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Department {
  id: string
  name: string
  code: string
  description: string
  isActive: boolean
  employeeCount: number
  createdAt: string
  updatedAt: string
}

interface DepartmentFormData {
  name: string
  code: string
  description: string
  isActive: boolean
}

// Mock data - gerçek uygulamada API'den gelecek
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Adalet Bakanlığı',
    code: 'AB',
    description: 'Adalet Bakanlığı merkez birimi',
    isActive: true,
    employeeCount: 45,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Ceza İnfaz Kurumu',
    code: 'CİK',
    description: 'Ceza İnfaz Kurumu birimi',
    isActive: true,
    employeeCount: 32,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Adli Destek ve Mağdur Hizmetleri',
    code: 'ADMH',
    description: 'Adli Destek ve Mağdur Hizmetleri birimi',
    isActive: false,
    employeeCount: 18,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Birim Ekleme/Düzenleme Modal Bileşeni
const DepartmentModal = ({
  department,
  isOpen,
  onClose,
  onSave,
}: {
  department: Department | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: DepartmentFormData) => void
}) => {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    code: '',
    description: '',
    isActive: true,
  })

  // Form açıldığında mevcut veriyi yükle
  useEffect(() => {
    if (department && isOpen) {
      setFormData({
        name: department.name,
        code: department.code,
        description: department.description,
        isActive: department.isActive,
      })
    } else if (!department && isOpen) {
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true,
      })
    }
  }, [department, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Birim adı ve kodu zorunludur')
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
                  {department ? 'Birim Düzenle' : 'Yeni Birim Ekle'}
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
                    Birim Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Birim adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Birim Kodu *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="Birim kodunu girin"
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
                    placeholder="Birim açıklamasını girin"
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
                    {department ? 'Güncelle' : 'Ekle'}
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

export default function BirimlerPage() {
  const queryClient = useQueryClient()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  // Query - gerçek uygulamada API'den gelecek
  const { data: departments = mockDepartments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => Promise.resolve(mockDepartments),
  })

  // Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Birim durumu güncellendi')
    },
    onError: () => {
      toast.error('Birim durumu güncellenirken hata oluştu')
    },
  })

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      // Gerçek uygulamada API çağrısı yapılacak
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Birim silindi')
    },
    onError: () => {
      toast.error('Birim silinirken hata oluştu')
    },
  })

  // Filtered data
  const filteredDepartments = useMemo(() => {
    let filtered = departments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((dept) =>
        statusFilter === 'active' ? dept.isActive : !dept.isActive
      )
    }

    return filtered
  }, [departments, searchTerm, statusFilter])

  // Handlers
  const handleSaveDepartment = (data: DepartmentFormData) => {
    if (editingDepartment) {
      // Güncelleme işlemi
      toast.success(`Birim güncellendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    } else {
      // Ekleme işlemi
      toast.success(`Yeni birim eklendi - Durum: ${data.isActive ? 'Aktif' : 'Pasif'}`)
    }
    // Gerçek uygulamada API çağrısı yapılacak
    console.log('Kaydedilecek veri:', data)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingDepartment(null)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (departmentId: string) => {
    toggleStatusMutation.mutate(departmentId)
  }

  const handleDelete = (departmentId: string) => {
    if (confirm('Bu birimi silmek istediğinizden emin misiniz?')) {
      deleteDepartmentMutation.mutate(departmentId)
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
          <Building2 className="h-4 w-4" />
          <span>Birimler</span>
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
            Birim Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm birimleri görüntüleyin ve yönetin
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Birim Ekle</span>
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
              placeholder="Birim ara..."
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

      {/* Departments Grid */}
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
        ) : filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Birim bulunamadı
            </h3>
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun birim bulunamadı.
            </p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {department.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kod: {department.code}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(department.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      department.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={department.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {department.isActive ? (
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
              {department.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {department.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{department.employeeCount} personel</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    department.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {department.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(department)}
                  className="btn btn-sm btn-secondary flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="btn btn-sm btn-destructive"
                  disabled={department.employeeCount > 0}
                  title={
                    department.employeeCount > 0
                      ? 'Personeli olan birim silinemez'
                      : 'Birimi sil'
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Department Modal */}
      <DepartmentModal
        department={editingDepartment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDepartment(null)
        }}
        onSave={handleSaveDepartment}
      />
    </div>
  )
}
