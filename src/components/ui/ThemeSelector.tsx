"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Palette } from "lucide-react";

const themeOptions = [
  {
    id: "ocean" as const,
    name: "Okyanus",
    description: "Modern mavi tonları",
    colors: {
      primary: "hsl(210, 100%, 50%)",
      secondary: "hsl(210, 40%, 95%)",
    },
  },
  {
    id: "forest" as const,
    name: "Orman",
    description: "Doğal yeşil tonları",
    colors: {
      primary: "hsl(142, 76%, 36%)",
      secondary: "hsl(142, 40%, 95%)",
    },
  },
  {
    id: "sunset" as const,
    name: "Gün Batımı",
    description: "Sıcak turuncu tonları",
    colors: {
      primary: "hsl(25, 95%, 53%)",
      secondary: "hsl(25, 40%, 95%)",
    },
  },
];

export default function ThemeSelector() {
  const { mode, color, setMode, setColor, toggleMode } = useTheme();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Tema Ayarları
        </CardTitle>
        <CardDescription>
          Uygulamanızın görünümünü kişiselleştirin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark/Light Mode Toggle */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Görünüm Modu</h3>
          <div className="flex gap-2">
            <Button
              variant={mode === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("light")}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Açık
            </Button>
            <Button
              variant={mode === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Koyu
            </Button>
          </div>
        </div>

        {/* Color Theme Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Renk Teması</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {themeOptions.map((theme) => (
              <div
                key={theme.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  color === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setColor(theme.id)}
              >
                <div className="space-y-3">
                  {/* Color Preview */}
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                  </div>
                  
                  {/* Theme Info */}
                  <div>
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Selected Indicator */}
                {color === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Toggle Button */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={toggleMode}
            className="w-full flex items-center gap-2"
          >
            {mode === "light" ? (
              <>
                <Moon className="h-4 w-4" />
                Koyu Moda Geç
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                Açık Moda Geç
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
