import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";
import DevRoleSwitcher from "@/components/ui/DevRoleSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors />
          <DevRoleSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
