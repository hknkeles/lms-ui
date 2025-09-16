'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table'
import {
  Search,
  Filter,
  Plus,
  Tag,
  UserCheck,
  UserX,
  Edit,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  User,
  Clock,
  Hash,
  GraduationCap,
  Scale,
  Upload,
  Briefcase,
  ArrowUpDown,
  Home,
  ChevronRight,
  Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  loadEmployeesFromStorage,
  saveEmployeesToStorage,
  getDepartments,
  getLocations,
  getStatuses,
  getKadroTypes,
} from '@/lib/data/employees'
import { Employee, EmployeeFilters, BulkAction } from '@/lib/types/employee'

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Aktif', className: 'bg-green-100 text-green-800' }
      case 'temporary_duty':
        return { text: 'Geçici Görev', className: 'bg-blue-100 text-blue-800' }
      case 'unpaid_leave':
        return { text: 'Ücretsiz İzin', className: 'bg-orange-100 text-orange-800' }
      case 'sick_leave':
        return { text: 'Raporlu', className: 'bg-yellow-100 text-yellow-800' }
      case 'transferred':
        return { text: 'Naklen Giden', className: 'bg-red-100 text-red-800' }
      default:
        return { text: status, className: 'bg-gray-100 text-gray-800' }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
    >
      {config.text}
    </span>
  )
}

// Tags component
const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-1">
    {tags.slice(0, 3).map((tag, index) => (
      <span
        key={index}
        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
      >
        {tag}
      </span>
    ))}
    {tags.length > 3 && (
      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
        +{tags.length - 3}
      </span>
    )}
  </div>
)



// Table columns
const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm font-medium text-primary">
          {row.original.firstName[0]}
          {row.original.lastName[0]}
        </span>
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: 'sicil',
    header: 'Sicil',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.original.sicil}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'firstName',
    header: 'Ad Soyad',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground">
          {row.original.firstName} {row.original.lastName}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.phone}
        </div>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'unvan',
    header: 'Unvan',
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.unvan}</span>
    ),
    size: 150,
  },
  {
    accessorKey: 'kadro',
    header: 'Kadro',
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.kadro}</span>
    ),
    size: 120,
  },
  {
    accessorKey: 'adliye',
    header: 'Adliye',
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.adliye}</span>
    ),
    size: 180,
  },
  {
    accessorKey: 'birim',
    header: 'Birim',
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.birim}</span>
    ),
    size: 180,
  },
  {
    accessorKey: 'startDate',
    header: 'Kuruma Başlama Tarihi',
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {new Date(row.original.startDate).toLocaleDateString('tr-TR')}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    size: 120,
  },
  {
    accessorKey: 'tags',
    header: 'Etiketler',
    cell: ({ row }) => <Tags tags={row.original.tags} />,
    size: 200,
  },

]

// Personel Detay Modal Bileşeni
const EmployeeDetailModal = ({
  employee,
  isOpen,
  onClose,
}: {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  
  if (!employee) return null

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'Aktif',
          className: 'bg-green-100 text-green-800 border-green-200',
        }
      case 'temporary_duty':
        return {
          text: 'Geçici Görev',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        }
      case 'unpaid_leave':
        return {
          text: 'Ücretsiz İzin',
          className: 'bg-orange-100 text-orange-800 border-orange-200',
        }
      case 'sick_leave':
        return {
          text: 'Raporlu',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        }
      case 'transferred':
        return {
          text: 'Naklen Giden',
          className: 'bg-red-100 text-red-800 border-red-200',
        }
      default:
        return {
          text: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        }
    }
  }

  const statusConfig = getStatusConfig(employee.status)

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
            <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {employee.firstName[0]}
                      {employee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {employee.firstName} {employee.lastName}
                    </h2>
                    <p className="text-muted-foreground">Sicil: {employee.sicil}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 pl-8 space-y-6">
                {/* Temel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          E-posta
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {employee.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Sicil
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.sicil}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Telefon
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.phone || 'Belirtilmemiş'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Adres
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.address || 'Belirtilmemiş'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Birim
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.birim}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Unvan
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.unvan}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Kadro
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.kadro}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Scale className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Adliye
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.adliye}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarih Bilgileri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Kuruma Başlama Tarihi
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(employee.startDate).toLocaleDateString(
                          'tr-TR'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Durum
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
                      >
                        {statusConfig.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Etiketler */}
                {employee.tags.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Etiketler
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {employee.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notlar */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Notlar
                      </p>
                      {employee.notes ? (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {employee.notes}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Not bulunmuyor
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Geçici Görev Bilgileri */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Geçici Görev Bilgileri
                      </p>
                      {(employee.temporaryDutyLocation || employee.temporaryDutyEndDate) ? (
                        <div className="space-y-2">
                          {employee.temporaryDutyLocation && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-foreground">Görev Yeri:</span>
                              <span className="text-sm text-muted-foreground">{employee.temporaryDutyLocation}</span>
                            </div>
                          )}
                          {employee.temporaryDutyEndDate && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-foreground">Ayrılış Tarihi:</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(employee.temporaryDutyEndDate).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Geçici görev bilgisi bulunmuyor
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t bg-muted/30">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          id: employee.id,
                          firstName: employee.firstName,
                          lastName: employee.lastName,
                          email: employee.email,
                          phone: employee.phone || '',
                          sicil: employee.sicil,
                          unvan: employee.unvan,
                          kadro: employee.kadro,
                          adliye: employee.adliye,
                          birim: employee.birim,
                          startDate: employee.startDate,
                          status: employee.status,
                          separationDate: employee.separationDate || '',
                          separationReason: employee.separationReason || '',
                          tags: employee.tags.join(','),
                          notes: employee.notes || '',
                          temporaryDutyLocation: employee.temporaryDutyLocation || '',
                          temporaryDutyEndDate: employee.temporaryDutyEndDate || '',
                        })
                        router.push(`/dashboard/personel/guncelle?${params.toString()}`)
                        onClose()
                      }}
                      className="btn btn-primary"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                      Kapat
                    </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function PersonelPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // State
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    birim: '',
    status: '',
    adliye: '',
    kadro: '',
  })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  )
  const [sortBy, setSortBy] = useState<string>('name')

  // Query
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: loadEmployeesFromStorage,
  })

  // Mutations
  const bulkActionMutation = useMutation({
    mutationFn: async (action: BulkAction) => {
      const updatedEmployees = employees.map((emp) => {
        if (action.employeeIds.includes(emp.id)) {
          switch (action.type) {
            case 'add_tag':
              return {
                ...emp,
                tags: [...emp.tags, action.value],
              }
            case 'remove_tag':
              return {
                ...emp,
                tags: emp.tags.filter((tag) => tag !== action.value),
              }
            case 'change_status':
              return {
                ...emp,
                status: action.value as Employee['status'],
              }
            default:
              return emp
          }
        }
        return emp
      })

      saveEmployeesToStorage(updatedEmployees)
      return updatedEmployees
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['employees'], data)
      toast.success('Toplu işlem başarıyla tamamlandı')
      setRowSelection({})
    },
    onError: () => {
      toast.error('Toplu işlem sırasında hata oluştu')
    },
  })

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = employees

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Birim filter
    if (filters.birim) {
      filtered = filtered.filter((emp) => emp.birim === filters.birim)
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((emp) => emp.status === filters.status)
    }

    // Adliye filter
    if (filters.adliye) {
      filtered = filtered.filter((emp) => emp.adliye === filters.adliye)
    }

    // Kadro filter
    if (filters.kadro) {
      filtered = filtered.filter((emp) => emp.kadro === filters.kadro)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
          return nameA.localeCompare(nameB, 'tr')
        
        case 'unvan':
          return a.unvan.localeCompare(b.unvan, 'tr')
        
        case 'kadro':
          return a.kadro.localeCompare(b.kadro, 'tr')
        
        case 'birim':
          return a.birim.localeCompare(b.birim, 'tr')
        
        case 'status':
          return a.status.localeCompare(b.status, 'tr')
        
        default:
          return 0
      }
    })

    return filtered
  }, [employees, filters, sortBy])

  // Bulk actions
  const handleBulkAction = (action: BulkAction['type'], value: string) => {
    const selectedIds = Object.keys(rowSelection)
    if (selectedIds.length === 0) {
      toast.error('Lütfen en az bir personel seçin')
      return
    }

    bulkActionMutation.mutate({
      type: action,
      value,
      employeeIds: selectedIds,
    })
  }

  const selectedCount = Object.keys(rowSelection).length

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
          <User className="h-4 w-4" />
          <span>Personel</span>
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
            Personel Listesi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm personeli görüntüleyin ve yönetin
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/personel/yeni')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Personel Ekle</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card p-6 w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ara..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="input pl-10 w-full"
            />
          </div>

          {/* Birim Filter */}
          <select
            value={filters.birim}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, birim: e.target.value }))
            }
            className="input"
          >
            <option value="">Tüm Birimler</option>
            {getDepartments().map((birim) => (
              <option key={birim} value={birim}>
                {birim}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="input"
          >
            <option value="">Tüm Durumlar</option>
            {getStatuses().map((status) => (
              <option key={status} value={status}>
                {status === 'active'
                  ? 'Aktif'
                  : status === 'temporary_duty'
                    ? 'Geçici Görev'
                  : status === 'unpaid_leave'
                    ? 'Ücretsiz İzin'
                  : status === 'sick_leave'
                    ? 'Raporlu'
                    : 'Naklen Giden'}
              </option>
            ))}
          </select>

          {/* Adliye Filter */}
          <select
            value={filters.adliye}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, adliye: e.target.value }))
            }
            className="input"
          >
            <option value="">Tüm Adliyeler</option>
            {getLocations().map((adliye) => (
              <option key={adliye} value={adliye}>
                {adliye}
              </option>
            ))}
          </select>

          {/* Kadro Filter */}
          <select
            value={filters.kadro}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, kadro: e.target.value }))
            }
            className="input"
          >
            <option value="">Tüm Kadrolar</option>
            {getKadroTypes().map((kadro) => (
              <option key={kadro} value={kadro}>
                {kadro}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <div className="relative group" title="Personel listesini sıralamak için seçim yapın">
            <ArrowUpDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors ${
              isLoading ? 'text-muted-foreground/50' : 'text-muted-foreground group-hover:text-primary'
            }`} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isLoading}
              aria-label="Personel listesini sıralama seçeneği"
              className="input pl-10 w-full cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 active:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="name">İsme Göre Sırala</option>
              <option value="unvan">Unvana Göre Sırala</option>
              <option value="kadro">Kadroya Göre Sırala</option>
              <option value="birim">Birime Göre Sırala</option>
              <option value="status">Seviyeye Göre Sırala</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setFilters({
                search: '',
                birim: '',
                status: '',
                adliye: '',
                kadro: '',
              })
              setSortBy('name')
            }}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreleri Temizle
          </button>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-4 bg-primary/5 border-primary/20 w-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {selectedCount} personel seçildi
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('add_tag', 'Önemli')}
                className="btn btn-sm btn-secondary"
                disabled={bulkActionMutation.isPending}
              >
                <Tag className="h-4 w-4 mr-2" />
                Etiket Ekle
              </button>
              <button
                onClick={() => handleBulkAction('change_status', 'active')}
                className="btn btn-sm btn-secondary"
                disabled={bulkActionMutation.isPending}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Aktif Yap
              </button>
              <button
                onClick={() => handleBulkAction('change_status', 'inactive')}
                className="btn btn-sm btn-secondary"
                disabled={bulkActionMutation.isPending}
              >
                <UserX className="h-4 w-4 mr-2" />
                Pasif Yap
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card overflow-hidden w-full"
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full">
            <thead className="bg-muted/50">
              {columns.map((column, index) => (
                <th
                  key={column.id || index}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  style={{ width: column.size ? `${column.size}px` : 'auto' }}
                >
                  {typeof column.header === 'string' ? column.header : 'Kolon'}
                </th>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    Sonuç bulunamadı
                  </td>
                </tr>
              ) : (
                filteredData.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedEmployee(employee)
                    }}
                  >
                    {/* Avatar */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </span>
                      </div>
                    </td>

                    {/* Sicil */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {employee.sicil}
                      </span>
                    </td>

                    {/* Ad Soyad */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {employee.phone}
                      </div>
                    </td>

                    {/* Unvan */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{employee.unvan}</span>
                    </td>

                    {/* Kadro */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{employee.kadro}</span>
                    </td>

                    {/* Adliye */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{employee.adliye}</span>
                    </td>

                    {/* Birim */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{employee.birim}</span>
                    </td>

                    {/* Kuruma Başlama Tarihi */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        {new Date(employee.startDate).toLocaleDateString(
                          'tr-TR'
                        )}
                      </span>
                    </td>

                    {/* Durum */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={employee.status} />
                    </td>

                    {/* Etiketler */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Tags tags={employee.tags} />
                    </td>


                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Toplam {filteredData.length} personel
            </div>
            <div className="flex items-center space-x-2">
              <button className="btn btn-sm btn-secondary" disabled={true}>
                Önceki
              </button>
              <span className="text-sm text-muted-foreground">Sayfa 1 / 1</span>
              <button className="btn btn-sm btn-secondary" disabled={true}>
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personel Detay Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  )
}
