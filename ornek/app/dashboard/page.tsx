'use client'

import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  TrendingUp,
  Building2,
  Circle,
  Home,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

// Mock data
const stats = [
  {
    title: 'Toplam Çalışan',
    value: '247',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Aktif',
    value: '234',
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: "İzin'de",
    value: '8',
    icon: UserX,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Bekleyen İzin',
    value: '5',
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
]

const recentEmployees = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    department: 'Yazılım Geliştirme',
    status: 'Aktif',
    avatar: 'AY',
  },
  {
    id: 2,
    name: 'Fatma Demir',
    department: 'İnsan Kaynakları',
    status: 'Aktif',
    avatar: 'FD',
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    department: 'Satış',
    status: 'İzin',
    avatar: 'MK',
  },
  {
    id: 4,
    name: 'Ayşe Özkan',
    department: 'Muhasebe',
    status: 'Aktif',
    avatar: 'AÖ',
  },
  {
    id: 5,
    name: 'Can Arslan',
    department: 'Pazarlama',
    status: 'Aktif',
    avatar: 'CA',
  },
]

const upcomingEvents = [
  {
    type: 'Doğum Günü',
    name: 'Elif Yıldız',
    date: '15 Aralık',
    department: 'Tasarım',
  },
  {
    type: 'İş Yıldönümü',
    name: 'Burak Şahin',
    date: '18 Aralık',
    department: 'Yazılım',
  },
  {
    type: 'Doğum Günü',
    name: 'Zeynep Korkmaz',
    date: '22 Aralık',
    department: 'Satış',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
}

export default function DashboardPage() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
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
        <span className="text-foreground font-medium flex items-center space-x-1 px-2 py-1 rounded-md bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm">
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </span>
      </motion.nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Hoş Geldiniz
          </h1>
          <p className="text-muted-foreground mt-2">
            Personel yönetim sistemine hoş geldiniz
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className={`${stat.bgColor} rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl bg-white/80`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Employees */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Son Eklenen Çalışanlar
              </h2>
              <button className="text-sm text-primary hover:underline">
                Tümünü Gör
              </button>
            </div>
            <div className="space-y-4">
              {recentEmployees.map((employee) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {employee.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {employee.name}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {employee.department}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'Aktif'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {employee.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Yaklaşan Etkinlikler
              </h2>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === 'Doğum Günü'
                        ? 'bg-pink-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.department}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {event.date}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {event.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Placeholder */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Performans Grafiği
          </h2>
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="h-64 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Grafik Alanı</p>
            <p className="text-sm text-muted-foreground">Gelecekte eklenecek</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
