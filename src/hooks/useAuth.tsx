"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const TOKEN_KEY = "lms_token";
const ROLE_KEY = "lms_role";

// Mock kullanıcı bilgisi
const MOCK_USER: User = {
  id: "1",
  email: "merve@example.com",
  name: "Merve Aksoy",
  role: "student"
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Token'dan kullanıcı bilgisini al
  const getUser = (): User | null => {
    if (typeof window === "undefined") return null;
    
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return MOCK_USER;
    }
    return null;
  };

  // Kullanıcının giriş yapıp yapmadığını kontrol et
  const isAuthenticated = (): boolean => {
    if (typeof window === "undefined") return false;
    
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  };

  // Rol kontrolü
  const hasRole = (...roles: string[]): boolean => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(ROLE_KEY) : '';
    const currentRole = (stored || user?.role || '').toLowerCase();
    if (!currentRole) return false;
    return roles.map(r => r.toLowerCase()).includes(currentRole);
  };

  const requireRole = (...roles: string[]): boolean => {
    if (!isAuthenticated()) return false;
    return hasRole(...roles);
  };

  // Giriş yap
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      // Mock authentication - gerçek backend yok
      if (credentials.email === "merve@example.com" && credentials.password === "password123") {
        // Token oluştur (gerçek uygulamada backend'den gelir)
        const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // LocalStorage'a token'ı kaydet
        localStorage.setItem(TOKEN_KEY, mockToken);
        // Rolü persist et (dev/test için)
        localStorage.setItem(ROLE_KEY, MOCK_USER.role);
        
        // Kullanıcı bilgisini set et
        setUser(MOCK_USER);
        
        return { success: true, message: "Giriş başarılı!" };
      } else {
        return { success: false, message: "E-posta veya şifre hatalı!" };
      }
    } catch (error) {
      return { success: false, message: "Giriş sırasında bir hata oluştu!" };
    }
  };

  // Çıkış yap
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    setUser(null);
    router.push("/login");
  };

  // Component mount olduğunda kullanıcı bilgisini kontrol et
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedRole = localStorage.getItem(ROLE_KEY);
    if (token) {
      const initial = { ...MOCK_USER, role: storedRole || MOCK_USER.role } as User;
      setUser(initial);
    }
    setIsLoading(false);
  }, []);

  // Dev helper: rolü set et
  const setRole = (role: string) => {
    // Dev/test: login yapılmadıysa mock token oluştur
    if (!localStorage.getItem(TOKEN_KEY)) {
      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(TOKEN_KEY, mockToken);
    }
    const next = { ...(user || MOCK_USER), role } as User;
    localStorage.setItem(ROLE_KEY, role);
    setUser(next);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    getUser,
    isAuthenticated,
    hasRole,
    requireRole,
    setRole,
  };
}
