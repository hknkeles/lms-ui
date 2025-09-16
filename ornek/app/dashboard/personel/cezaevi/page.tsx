'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
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
  Shield,
  Upload,
  Briefcase,
  ArrowUpDown,
  Home,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  loadEmployeesFromStorage,
  getDepartments,
  getLocations,
  getStatuses,
} from '@/lib/data/employees'
import { Employee, EmployeeFilters } from '@/lib/types/employee'

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

export default function CezaeviPersonelPage() {
  const router = useRouter()

  // State
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    birim: '',
    status: '',
    adliye: '',
  })
  const [sortBy, setSortBy] = useState<string>('name')

  // Query - Sadece cezaevi personelini getir
  const { data: allEmployees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: loadEmployeesFromStorage,
  })

  // Cezaevi personelini filtrele
  const cezaeviEmployees = useMemo(() => {
    return allEmployees.filter(emp => 
      emp.birim && emp.birim.toLowerCase().includes('cezaevi') ||
      emp.birim && emp.birim.toLowerCase().includes('infaz') ||
      emp.unvan && emp.unvan.toLowerCase().includes('gardiyan') ||
      emp.unvan && emp.unvan.toLowerCase().includes('müdür') ||
      emp.unvan && emp.unvan.toLowerCase().includes('müdür yardımcısı')
    )
  }, [allEmployees])

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = cezaeviEmployees

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

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
          return nameA.localeCompare(nameB, 'tr')
        
        case 'unvan':
          return a.unvan.localeCompare(b.unvan, 'tr')
        
        case 'birim':
          return a.birim.localeCompare(b.birim, 'tr')
        
        case 'status':
          return a.status.localeCompare(b.status, 'tr')
        
        default:
          return 0
      }
    })

    return filtered
  }, [cezaeviEmployees, filters, sortBy])

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
        <a
          href="/dashboard/personel"
          className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50 hover:shadow-sm group"
        >
          <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Personeller</span>
        </a>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="text-foreground font-medium flex items-center space-x-1 px-2 py-1 rounded-md bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-600 border border-red-500/20 shadow-sm">
          <Shield className="h-4 w-4" />
          <span>Cezaevi Personeli</span>
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
            Cezaevi Personeli
          </h1>
          <p className="text-muted-foreground mt-2">
            Cezaevi ve infaz kurumlarında çalışan personeli görüntüleyin
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                    Cezaevi personeli bulunamadı
                  </td>
                </tr>
              ) : (
                filteredData.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Personel detayına git
                      router.push(`/dashboard/personel?selected=${employee.id}`)
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
              Toplam {filteredData.length} cezaevi personeli
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
    </div>
  )
}
