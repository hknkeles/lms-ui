'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const success = await login(data.userId, data.password)

      if (success) {
        toast.success("Giriş başarılı! Dashboard'a yönlendiriliyorsunuz...")
        router.push('/dashboard')
      } else {
        toast.error('Kullanıcı ID veya şifre hatalı!')
      }
    } catch (error) {
      toast.error('Giriş sırasında bir hata oluştu!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Giriş Yap</h1>
          <p className="text-muted-foreground">
            Hesabınıza erişmek için giriş yapın
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2">
              Kullanıcı ID
            </label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 bg-muted border border-r-0 border-input rounded-l-xl text-sm font-mono text-muted-foreground">
                ab
              </div>
              <input
                {...register('userId')}
                id="userId"
                type="text"
                maxLength={6}
                className={`input rounded-l-none font-mono ${
                  errors.userId ? 'border-destructive' : ''
                }`}
                placeholder="196607"
                disabled={isLoading}
              />
            </div>
            {errors.userId && (
              <p className="text-sm text-destructive mt-1">
                {errors.userId.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Örnek: ab196607, ab123456, ab42
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input pl-10 pr-10 ${
                  errors.password ? 'border-destructive' : ''
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Test için: Kullanıcı ID: 196607, Şifre: 123456
          </p>
        </div>
      </div>
    </div>
  )
}
