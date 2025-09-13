"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardPage from "./(dashboard)/page";
import DashboardLayout from "./(dashboard)/layout";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      // Kullanıcı giriş yapmamışsa login'e yönlendir
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Authenticated değilse hiçbir şey render etme (redirect olacak)
  if (!isAuthenticated()) {
    return null;
  }

  // Authenticated ise dashboard'ı layout ile birlikte göster
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
