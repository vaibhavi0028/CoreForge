"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("coreforge_theme") as Theme
    const initial = stored || "dark"

    setTheme(initial)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(initial)

    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(next)
      localStorage.setItem("coreforge_theme", next)
      return next
    })
  }

  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
