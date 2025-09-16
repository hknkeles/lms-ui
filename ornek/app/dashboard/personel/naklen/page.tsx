'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Plus,
  Tag,
  User,
  Clock,
  ArrowRight,
  Home,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiService, Personel, PersonelFilterDto } from '@/lib/services/api'

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
const columns = [
  { id: 'avatar', header: 'Avatar', size: 80 },
  { id: 'sicil', header: 'Sicil', size: 100 },
  { id: 'name', header: 'Ad Soyad', size: 200 },
  { id: 'unvan', header: 'Unvan', size: 150 },
  { id: 'adliye', header: 'Adliye', size: 180 },
  { id: 'birim', header: 'Birim', size: 180 },
  { id: 'separationDate', header: 'Ayrılış Tarihi', size: 160 },
  { id: 'separationReason', header: 'Ayrılış Nedeni', size: 180 },
  { id: 'status', header: 'Durum', size: 120 },
  { id: 'tags', header: 'Etiketler', size: 200 },
]

export default function NaklenPersonelPage() {
  const router = useRouter()

  // State
  const [personeller, setPersoneller] = useState<Personel[]>([])
  const [filteredData, setFilteredData] = useState<Personel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<PersonelFilterDto>({
    search: '',
    birim: '',
    adliye: '',
  })
  const [sortBy, setSortBy] = useState<string>('name')
  const [birimler, setBirimler] = useState<string[]>([])
  const [adliyeler, setAdliyeler] = useState<string[]>([])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [naklenPersoneller, birimlerData, adliyelerData] = await Promise.all([
          apiService.getNaklenPersoneller(),
          apiService.getBirimler(),
          apiService.getAdliyeler()
        ])
        
        setPersoneller(naklenPersoneller)
        setBirimler(birimlerData)
        setAdliyeler(adliyelerData)
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
        toast.error('Veri yüklenirken hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtered and sorted data
  useEffect(() => {
    let filtered = [...personeller]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.sicil.includes(filters.search)
      )
    }

    // Birim filter
    if (filters.birim) {
      filtered = filtered.filter((emp) => emp.birim === filters.birim)
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
        
        case 'separationDate':
          if (!a.separationDate && !b.separationDate) return 0
          if (!a.separationDate) return 1
          if (!b.separationDate) return -1
          return new Date(a.separationDate).getTime() - new Date(b.separationDate).getTime()
        
        default:
          return 0
      }
    })

    setFilteredData(filtered)
  }, [personeller, filters, sortBy])

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
        <span className="text-foreground font-medium flex items-center space-x-1 px-2 py-1 rounded-md bg-gradient-to-r from-gray-500/10 to-gray-500/5 text-gray-600 border border-gray-500/20 shadow-sm">
          <ArrowRight className="h-4 w-4" />
          <span>Naklen Giden Personel</span>
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
            Naklen Giden Personel
          </h1>
          <p className="text-muted-foreground mt-2">
            Naklen giden ve ayrılan personeli görüntüleyin
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
            {birimler.map((birim) => (
              <option key={birim} value={birim}>
                {birim}
              </option>
            ))}
          </select>

          {/* Sort By Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="name">İsme Göre</option>
            <option value="separationDate">Ayrılış Tarihine Göre</option>
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
            {adliyeler.map((adliye) => (
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
                    Naklen giden personel bulunamadı
                  </td>
                </tr>
              ) : (
                filteredData.map((personel, index) => (
                  <tr
                    key={personel.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Personel detayına git
                      router.push(`/dashboard/personel?selected=${personel.id}`)
                    }}
                  >
                    {/* Avatar */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {personel.firstName[0]}
                          {personel.lastName[0]}
                        </span>
                      </div>
                    </td>

                    {/* Sicil */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {personel.sicil}
                      </span>
                    </td>

                    {/* Ad Soyad */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {personel.firstName} {personel.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {personel.phone}
                      </div>
                    </td>

                    {/* Unvan */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{personel.unvan}</span>
                    </td>

                    {/* Adliye */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{personel.adliye}</span>
                    </td>

                    {/* Birim */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{personel.birim}</span>
                    </td>

                    {/* Ayrılış Tarihi */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        {personel.separationDate 
                          ? new Date(personel.separationDate).toLocaleDateString('tr-TR')
                          : 'Belirtilmemiş'
                        }
                      </span>
                    </td>

                    {/* Ayrılış Nedeni */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        {personel.separationReason || 'Belirtilmemiş'}
                      </span>
                    </td>

                    {/* Durum */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={personel.status} />
                    </td>

                    {/* Etiketler */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Tags tags={personel.tags} />
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
              Toplam {filteredData.length} naklen giden personel
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
