"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark";
export type ThemeColor = "ocean" | "forest" | "sunset";

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tema renk paletleri
const themePalettes = {
  ocean: {
    light: {
      primary: "210 100% 50%", // Modern Ocean Blue
      "primary-foreground": "0 0% 100%",
      secondary: "210 40% 95%", // Light Ocean
      "secondary-foreground": "210 100% 20%",
      accent: "210 100% 40%", // Darker Ocean
      "accent-foreground": "0 0% 100%",
      background: "0 0% 100%",
      foreground: "210 20% 10%",
      card: "0 0% 100%",
      "card-foreground": "210 20% 10%",
      popover: "0 0% 100%",
      "popover-foreground": "210 20% 10%",
      muted: "210 40% 95%",
      "muted-foreground": "210 20% 40%",
      border: "210 20% 90%",
      input: "210 20% 90%",
      ring: "210 100% 50%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 100%",
    },
    dark: {
      primary: "210 100% 60%", // Brighter Ocean Blue
      "primary-foreground": "210 20% 10%",
      secondary: "210 20% 15%", // Dark Ocean
      "secondary-foreground": "210 40% 90%",
      accent: "210 100% 70%", // Light Ocean
      "accent-foreground": "210 20% 10%",
      background: "210 20% 8%", // Very Dark Ocean
      foreground: "210 40% 90%",
      card: "210 20% 10%",
      "card-foreground": "210 40% 90%",
      popover: "210 20% 10%",
      "popover-foreground": "210 40% 90%",
      muted: "210 20% 15%",
      "muted-foreground": "210 20% 60%",
      border: "210 20% 20%",
      input: "210 20% 20%",
      ring: "210 100% 60%",
      destructive: "0 62% 50%",
      "destructive-foreground": "210 40% 90%",
    },
  },
  forest: {
    light: {
      primary: "142 76% 36%", // Forest Green
      "primary-foreground": "0 0% 100%",
      secondary: "142 40% 95%", // Light Forest
      "secondary-foreground": "142 76% 20%",
      accent: "142 76% 28%", // Darker Forest
      "accent-foreground": "0 0% 100%",
      background: "0 0% 100%",
      foreground: "142 20% 10%",
      card: "0 0% 100%",
      "card-foreground": "142 20% 10%",
      popover: "0 0% 100%",
      "popover-foreground": "142 20% 10%",
      muted: "142 40% 95%",
      "muted-foreground": "142 20% 40%",
      border: "142 20% 90%",
      input: "142 20% 90%",
      ring: "142 76% 36%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 100%",
    },
    dark: {
      primary: "142 76% 50%", // Brighter Forest Green
      "primary-foreground": "142 20% 10%",
      secondary: "142 20% 15%", // Dark Forest
      "secondary-foreground": "142 40% 90%",
      accent: "142 76% 60%", // Light Forest
      "accent-foreground": "142 20% 10%",
      background: "142 20% 8%", // Very Dark Forest
      foreground: "142 40% 90%",
      card: "142 20% 10%",
      "card-foreground": "142 40% 90%",
      popover: "142 20% 10%",
      "popover-foreground": "142 40% 90%",
      muted: "142 20% 15%",
      "muted-foreground": "142 20% 60%",
      border: "142 20% 20%",
      input: "142 20% 20%",
      ring: "142 76% 50%",
      destructive: "0 62% 50%",
      "destructive-foreground": "142 40% 90%",
    },
  },
  sunset: {
    light: {
      primary: "25 95% 53%", // Sunset Orange
      "primary-foreground": "0 0% 100%",
      secondary: "25 40% 95%", // Light Sunset
      "secondary-foreground": "25 95% 20%",
      accent: "25 95% 40%", // Darker Sunset
      "accent-foreground": "0 0% 100%",
      background: "0 0% 100%",
      foreground: "25 20% 10%",
      card: "0 0% 100%",
      "card-foreground": "25 20% 10%",
      popover: "0 0% 100%",
      "popover-foreground": "25 20% 10%",
      muted: "25 40% 95%",
      "muted-foreground": "25 20% 40%",
      border: "25 20% 90%",
      input: "25 20% 90%",
      ring: "25 95% 53%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 100%",
    },
    dark: {
      primary: "25 95% 65%", // Brighter Sunset Orange
      "primary-foreground": "25 20% 10%",
      secondary: "25 20% 15%", // Dark Sunset
      "secondary-foreground": "25 40% 90%",
      accent: "25 95% 75%", // Light Sunset
      "accent-foreground": "25 20% 10%",
      background: "25 20% 8%", // Very Dark Sunset
      foreground: "25 40% 90%",
      card: "25 20% 10%",
      "card-foreground": "25 40% 90%",
      popover: "25 20% 10%",
      "popover-foreground": "25 40% 90%",
      muted: "25 20% 15%",
      "muted-foreground": "25 20% 60%",
      border: "25 20% 20%",
      input: "25 20% 20%",
      ring: "25 95% 65%",
      destructive: "0 62% 50%",
      "destructive-foreground": "25 40% 90%",
    },
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [color, setColorState] = useState<ThemeColor>("ocean");
  const [isInitialized, setIsInitialized] = useState(false);

  // LocalStorage'dan tema ayarlarını yükle ve sistem tercihini algıla
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("lms_theme_mode") as ThemeMode;
      const savedColor = localStorage.getItem("lms_theme_color") as ThemeColor;
      
      // Sistem tercihini algıla
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Tema modu: önce localStorage, sonra sistem tercihi
      if (savedMode && ["light", "dark"].includes(savedMode)) {
        setModeState(savedMode);
      } else {
        setModeState(systemPrefersDark ? "dark" : "light");
      }
      
      // Renk teması: önce localStorage, sonra varsayılan
      if (savedColor && ["ocean", "forest", "sunset"].includes(savedColor)) {
        setColorState(savedColor);
      } else {
        setColorState("ocean"); // Varsayılan tema
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Tema değişikliklerini uygula
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      const root = document.documentElement;
      const palette = themePalettes[color][mode];
      
      // CSS değişkenlerini güncelle
      Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      
      // Dark mode class'ını ekle/çıkar
      if (mode === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      // LocalStorage'a kaydet
      localStorage.setItem("lms_theme_mode", mode);
      localStorage.setItem("lms_theme_color", color);
      
    }
  }, [mode, color, isInitialized]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
  };

  const toggleMode = () => {
    setModeState(prev => prev === "light" ? "dark" : "light");
  };

  // SSR sırasında loading state göster
  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
