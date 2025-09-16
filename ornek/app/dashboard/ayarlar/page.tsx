'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Sun, Moon, Monitor, CheckCircle, Home, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export default function AyarlarPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'Genel', icon: Monitor },
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'notifications', label: 'Bildirimler', icon: CheckCircle },
  ]

  const colorTokens = [
    {
      name: 'Primary',
      light: 'hsl(221.2 83.2% 53.3%)',
      dark: 'hsl(217.2 91.2% 59.8%)',
    },
    {
      name: 'Secondary',
      light: 'hsl(210 40% 96%)',
      dark: 'hsl(217.2 32.6% 17.5%)',
    },
    {
      name: 'Success',
      light: 'hsl(142.1 76.2% 36.3%)',
      dark: 'hsl(142.1 70.6% 45.3%)',
    },
    { name: 'Warning', light: 'hsl(38 92% 50%)', dark: 'hsl(38 92% 50%)' },
    {
      name: 'Destructive',
      light: 'hsl(0 84.2% 60.2%)',
      dark: 'hsl(0 62.8% 30.6%)',
    },
    {
      name: 'Muted',
      light: 'hsl(210 40% 96%)',
      dark: 'hsl(217.2 32.6% 17.5%)',
    },
  ]

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
          <Settings className="h-4 w-4" />
          <span>Ayarlar</span>
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
          <h1 className="text-3xl font-bold text-foreground">Ayarlar</h1>
          <p className="text-muted-foreground mt-2">
            Uygulama ayarlarını yapılandırın ve özelleştirin
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {activeTab === 'general' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dil</label>
                <select className="input w-full max-w-xs">
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Zaman Dilimi
                </label>
                <select className="input w-full max-w-xs">
                  <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Tema Seçimi</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="font-medium">Açık Tema</p>
                  <p className="text-sm text-muted-foreground">
                    Parlak ve temiz görünüm
                  </p>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Moon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Koyu Tema</p>
                  <p className="text-sm text-muted-foreground">
                    Göz yormayan karanlık mod
                  </p>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'system'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Sistem</p>
                  <p className="text-sm text-muted-foreground">
                    Otomatik tema seçimi
                  </p>
                </button>
              </div>
            </div>

            {/* Color Token Preview */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">
                Renk Token&apos;ları ve Kontrast Testi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorTokens.map((token) => (
                  <div key={token.name} className="space-y-3">
                    <h3 className="font-medium text-sm">{token.name}</h3>

                    {/* Light Theme Preview */}
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Açık Tema
                      </div>
                      <div
                        className="h-16 rounded-lg border flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: token.light, color: 'white' }}
                      >
                        {token.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        HSL: {token.light}
                      </div>
                    </div>

                    {/* Dark Theme Preview */}
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Koyu Tema
                      </div>
                      <div
                        className="h-16 rounded-lg border flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: token.dark, color: 'white' }}
                      >
                        {token.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        HSL: {token.dark}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility Test */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">
                Erişilebilirlik Testi
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                    <h3 className="font-semibold mb-2">Primary Background</h3>
                    <p>
                      Bu metin primary background üzerinde primary-foreground
                      rengi ile yazılmıştır.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
                    <h3 className="font-semibold mb-2">Secondary Background</h3>
                    <p>
                      Bu metin secondary background üzerinde
                      secondary-foreground rengi ile yazılmıştır.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-green-100 text-green-800 border border-green-300">
                    <h3 className="font-semibold mb-2">Success Badge</h3>
                    <p>Onaylandı</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300">
                    <h3 className="font-semibold mb-2">Warning Badge</h3>
                    <p>Beklemede</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-100 text-red-800 border border-red-300">
                    <h3 className="font-semibold mb-2">Error Badge</h3>
                    <p>Hata</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Bildirim Ayarları</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">E-posta Bildirimleri</h3>
                  <p className="text-sm text-muted-foreground">
                    Önemli güncellemeler için e-posta al
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Bildirimleri</h3>
                  <p className="text-sm text-muted-foreground">
                    Anlık bildirimler al
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
