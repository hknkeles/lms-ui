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

  // Giriş yap
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      // Mock authentication - gerçek backend yok
      if (credentials.email === "merve@example.com" && credentials.password === "password123") {
        // Token oluştur (gerçek uygulamada backend'den gelir)
        const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // LocalStorage'a token'ı kaydet
        localStorage.setItem(TOKEN_KEY, mockToken);
        
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
    setUser(null);
    router.push("/login");
  };

  // Component mount olduğunda kullanıcı bilgisini kontrol et
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    getUser,
    isAuthenticated,
  };
}
