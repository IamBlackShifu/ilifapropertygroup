'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeType = 'blue' | 'earth' | 'warm'

interface ThemeColors {
  primary: string
  primaryDark: string
  primaryLight: string
  secondary: string
  accent: string
}

const themes: Record<ThemeType, ThemeColors> = {
  blue: {
    primary: '#2563eb',      // Blue-600
    primaryDark: '#1e40af',  // Blue-700
    primaryLight: '#3b82f6', // Blue-500
    secondary: '#10b981',    // Emerald-500
    accent: '#f59e0b',       // Amber-500
  },
  earth: {
    primary: '#778667',      // Sage green
    primaryDark: '#10160B',  // Dark forest
    primaryLight: '#8a9978', // Light sage
    secondary: '#D1C295',    // Warm beige
    accent: '#778667',       // Sage green
  },
  warm: {
    primary: '#f8b04b',      // Golden amber (primary-500)
    primaryDark: '#c97d28',  // Dark golden (primary-700)
    primaryLight: '#fac574', // Light golden (primary-400)
    secondary: '#cd8357',    // Terracotta (secondary-500)
    accent: '#e69937',       // Amber accent (primary-600)
  },
}

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('warm')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('site-theme') as ThemeType
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Apply theme colors to CSS variables
    const colors = themes[theme]
    const root = document.documentElement
    
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-primary-dark', colors.primaryDark)
    root.style.setProperty('--color-primary-light', colors.primaryLight)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    
    // Save to localStorage
    localStorage.setItem('site-theme', theme)
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
