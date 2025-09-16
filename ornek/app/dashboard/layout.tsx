'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Home,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Building2,
  GraduationCap,
  Tag,
  Activity,
  Cog,
  Scale,
  FileText,
  Eye,
  Clock,
  ArrowRight,
  UserCheck,
  XCircle,
  MoreHorizontal,
  Briefcase,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'ANA SAYFA', href: '/dashboard', icon: Home, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
  { 
    name: 'PERSONELLER', 
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    children: [
      { name: 'Tüm Personeller', href: '/dashboard/personel', icon: Users, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Adliye Personeli', href: '/dashboard/personel/adliye', icon: Scale, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Cezaevi Personeli', href: '/dashboard/personel/cezaevi', icon: Shield, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'İcra Personeli', href: '/dashboard/personel/icra', icon: FileText, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Denetim Personeli', href: '/dashboard/personel/denetim', icon: Eye, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Geçici Görevlendirilen Personel', href: '/dashboard/personel/gecici', icon: Clock, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Naklen Giden Personel', href: '/dashboard/personel/naklen', icon: ArrowRight, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
    ]
  },
  { 
    name: 'YÖNETİM', 
    icon: Settings,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    children: [
      { name: 'Birimler', href: '/dashboard/birimler', icon: Building2, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Kadro', href: '/dashboard/kadro', icon: Users, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Ünvanlar', href: '/dashboard/unvanlar', icon: GraduationCap, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Etiketler', href: '/dashboard/etiketler', icon: Tag, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
      { name: 'Durumlar', href: '/dashboard/durumlar', icon: Activity, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-50/50 dark:bg-blue-950/20' },
    ]
  },
  { name: 'AYARLAR', href: '/dashboard/ayarlar', icon: Cog, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [managementOpen, setManagementOpen] = useState(false)
  const [personelOpen, setPersonelOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Sidebar collapsed olduğunda management ve personel menülerini kapat
  useEffect(() => {
    if (sidebarCollapsed) {
      setManagementOpen(false)
      setPersonelOpen(false)
    }
  }, [sidebarCollapsed])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/30">
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Personel Sistemi</h2>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <nav className="p-6 space-y-3">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          if (item.name === 'PERSONELLER') {
                            setPersonelOpen(!personelOpen)
                          } else if (item.name === 'YÖNETİM') {
                            setManagementOpen(!managementOpen)
                          }
                        }}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 w-full group"
                      >
                        <div className={`p-2 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 ml-auto transition-transform duration-300 ${
                            (item.name === 'PERSONELLER' && personelOpen) || 
                            (item.name === 'YÖNETİM' && managementOpen) 
                              ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {((item.name === 'PERSONELLER' && personelOpen) || (item.name === 'YÖNETİM' && managementOpen)) && (
                        <div className="ml-6 space-y-2 animate-in slide-in-from-left-2 duration-300">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 group"
                            >
                              <div className={`p-1.5 rounded-md ${child.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                <child.icon className={`h-4 w-4 ${child.color}`} />
                              </div>
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 group"
                    >
                      <div className={`p-2 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-500 ease-out ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
          <div className={`flex grow flex-col gap-y-5 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-2xl transition-all duration-500 ease-out ${sidebarCollapsed ? 'px-3 py-6' : 'px-6 py-6 overflow-y-auto'}`}>
            <div className="flex h-16 shrink-0 items-center justify-between">
              {!sidebarCollapsed ? (
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Personel Sistemi</h2>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-300 group"
                title={sidebarCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
              >
                <div className="relative">
                  {sidebarCollapsed ? (
                    <ChevronDown className="h-4 w-4 rotate-90 transition-transform duration-300 group-hover:scale-110 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 -rotate-90 transition-transform duration-300 group-hover:scale-110 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-8">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {item.children ? (
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                if (item.name === 'PERSONELLER') {
                                  setPersonelOpen(!personelOpen)
                                } else if (item.name === 'YÖNETİM') {
                                  setManagementOpen(!managementOpen)
                                }
                              }}
                              className={`group relative flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 w-full ${
                                sidebarCollapsed 
                                  ? 'justify-center p-3' 
                                  : 'space-x-3 px-4 py-3'
                              }`}
                              title={item.name}
                            >
                              <div className={`p-2 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                <item.icon className={`${sidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5'} ${item.color}`} />
                              </div>
                              {!sidebarCollapsed && (
                                <>
                                  <span>{item.name}</span>
                                  <ChevronDown
                                    className={`h-4 w-4 ml-auto transition-transform duration-300 ${
                                      (item.name === 'PERSONELLER' && personelOpen) || 
                                      (item.name === 'YÖNETİM' && managementOpen) 
                                        ? 'rotate-180' : ''
                                    }`}
                                  />
                                </>
                              )}
                              {sidebarCollapsed && (
                                <div className="absolute left-full ml-3 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                  {item.name}
                                </div>
                              )}
                            </button>
                            {((item.name === 'PERSONELLER' && personelOpen) || (item.name === 'YÖNETİM' && managementOpen)) && (
                              <div className={`space-y-2 ${sidebarCollapsed ? 'absolute left-full ml-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-3 shadow-xl z-50 min-w-48' : 'ml-8'}`}>
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    className={`group relative flex items-center rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 ${
                                      sidebarCollapsed 
                                        ? 'px-3 py-2.5' 
                                        : 'space-x-3 px-3 py-2.5'
                                    }`}
                                    title={child.name}
                                    onClick={() => {
                                      if (sidebarCollapsed) {
                                        if (item.name === 'PERSONELLER') {
                                          setPersonelOpen(false)
                                        } else if (item.name === 'YÖNETİM') {
                                          setManagementOpen(false)
                                        }
                                      }
                                    }}
                                  >
                                    <div className={`p-1.5 rounded-md ${child.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                      <child.icon className={`${sidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${child.color}`} />
                                    </div>
                                    <span>{child.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={`group relative flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 ${
                              sidebarCollapsed 
                                ? 'justify-center p-3' 
                                : 'space-x-3 px-4 py-3'
                            }`}
                            title={item.name}
                          >
                            <div className={`p-2 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                              <item.icon className={`${sidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5'} ${item.color}`} />
                            </div>
                            {!sidebarCollapsed && <span>{item.name}</span>}
                            {sidebarCollapsed && (
                              <div className="absolute left-full ml-3 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                {item.name}
                              </div>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <button
                    onClick={handleLogout}
                    className={`group relative flex items-center rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-white hover:bg-red-100 dark:hover:bg-red-800 transition-all duration-300 w-full ${
                      sidebarCollapsed 
                        ? 'justify-center p-3' 
                        : 'space-x-3 px-4 py-3'
                    }`}
                    title="Çıkış Yap"
                  >
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 group-hover:scale-110 transition-transform duration-200">
                      <LogOut className={`${sidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5'} text-red-600 dark:text-red-400`} />
                    </div>
                    {!sidebarCollapsed && <span>Çıkış Yap</span>}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                        Çıkış Yap
                      </div>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className={`transition-all duration-500 ease-out ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-slate-600 dark:text-slate-400 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-blue-500" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="input pl-10 w-full max-w-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
                <Bell className="h-5 w-5 text-orange-500" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" />
              </button>

              <ThemeToggle />

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-x-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || 'Admin'}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl py-3 z-50 animate-in slide-in-from-top-2 duration-300">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.userId || 'ab196607'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                                              <Link
                          href="/dashboard/profil"
                          className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 rounded-xl mx-2"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span>Profil</span>
                        </Link>

                        <Link
                          href="/dashboard/ayarlar"
                          className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 rounded-xl mx-2"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span>Ayarlar</span>
                        </Link>

                        <Link
                          href="/dashboard/güvenlik"
                          className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 rounded-xl mx-2"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Shield className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span>Güvenlik</span>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-2" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 w-full mx-2 rounded-xl"
                    >
                      <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
