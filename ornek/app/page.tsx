'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="card p-8 max-w-md w-full mx-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Personel Yönetim Sistemi</h1>
        <p className="text-muted-foreground mb-6">
          Modern ve kullanıcı dostu personel yönetim uygulamasına hoş geldiniz.
        </p>
        <div className="space-y-3">
          <Link href="/login" className="btn btn-primary w-full">
            Giriş Yap
          </Link>
          <Link href="/dashboard" className="btn btn-secondary w-full">
            Dashboard&apos;a Git
          </Link>
        </div>
      </div>
    </div>
  )
}
