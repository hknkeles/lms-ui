"use client";

import { useEffect } from "react";

export default function DarkModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Dark mode kontrolü - önce localStorage'dan kontrol et
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('lms_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // localStorage'da tema varsa onu kullan, yoksa sistem tercihini kullan
      const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Media query listener - sadece localStorage'da tema yoksa dinle
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // Sadece localStorage'da tema yoksa sistem değişikliğini dinle
        if (!localStorage.getItem('lms_theme')) {
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return <>{children}</>;
}
