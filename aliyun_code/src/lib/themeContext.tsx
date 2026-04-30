import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getSiteConfig, type SiteConfigFromAPI } from '@/lib/queries';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  isLight: boolean;
  siteConfig: SiteConfigFromAPI | null;
  colors: typeof darkColors;
}

const ThemeCtx = createContext<ThemeContextType>({
  theme: 'dark',
  isLight: false,
  siteConfig: null,
  colors: {} as any,
});

export const useThemeContext = () => useContext(ThemeCtx);

const darkColors = {
  bg: '#050505',
  bgAlt: '#080808',
  bgCard: '#080808',
  bgCardHover: '#0c0a08',
  bgBrandCard: '#0F0F0F',
  text: 'white',
  textMuted: 'rgb(156 163 175)',
  textSub: 'rgb(120 130 140)',
  accent: '#C9A96E',
  accentHover: '#D4B87A',
  border: 'rgba(255,255,255,0.04)',
  borderHover: 'rgba(201,169,110,0.20)',
  borderAccent: 'rgba(201,169,110,0.30)',
  borderAccentLight: 'rgba(201,169,110,0.06)',
  gradientFrom: '#050505',
  gradientVia: '#0a0805',
  gradientTo: '#050505',
  heroBottomFade: '#050505',
  ctaText: 'black',
};

const lightColors = {
  bg: '#F5F0E8',
  bgAlt: '#EBE4D9',
  bgCard: '#FDFAF5',
  bgCardHover: '#F8F3EB',
  bgBrandCard: '#FDFAF5',
  text: '#1A1408',
  textMuted: '#4A4030',
  textSub: '#6B5F4F',
  accent: '#6B4F3A',
  accentHover: '#5A4230',
  border: 'rgba(107,79,58,0.12)',
  borderHover: 'rgba(107,79,58,0.28)',
  borderAccent: 'rgba(107,79,58,0.35)',
  borderAccentLight: 'rgba(107,79,58,0.08)',
  gradientFrom: '#F5F0E8',
  gradientVia: '#EDE6DA',
  gradientTo: '#F5F0E8',
  heroBottomFade: '#F5F0E8',
  ctaText: 'white',
};

export { darkColors, lightColors };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfigFromAPI | null>(null);

  useEffect(() => {
    getSiteConfig().then(setSiteConfig);
  }, []);

  const theme: ThemeMode = siteConfig?.theme === 'light' ? 'light' : 'dark';
  const isLight = theme === 'light';
  const colors = isLight ? lightColors : darkColors;

  return (
    <ThemeCtx.Provider value={{ theme, isLight, siteConfig, colors }}>
      {children}
    </ThemeCtx.Provider>
  );
}
