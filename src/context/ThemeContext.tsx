"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
  type FC,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback hook values if used outside provider
    return {
      theme: "light" as Theme,
      toggleTheme: () => {
        console.warn(
          "useTheme must be used within a ThemeProvider to toggle theme"
        );
      },
      setTheme: () => {
        console.warn(
          "useTheme must be used within a ThemeProvider to set theme"
        );
      },
      mounted: false,
    };
  }
  return context;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && (stored === "light" || stored === "dark")) {
      return stored;
    }

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  } catch (error) {
    console.warn("Error reading theme from localStorage:", error);
  }

  return "light";
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_CHANGE_EVENT = "spinoza-theme-change";
const noopSubscribe = (): (() => void) => () => undefined;

/** The theme lives outside React (localStorage and the OS setting): React reads it with useSyncExternalStore. */
function subscribeToTheme(onChange: () => void): () => void {
  const media = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  media?.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    media?.removeEventListener("change", onChange);
  };
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  // The server (and the first client render, so hydration matches) uses "light"; the real value follows.
  const theme = useSyncExternalStore<Theme>(subscribeToTheme, getInitialTheme, () => "light");
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Keep the data-theme attribute on <html> in step with the theme
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn("Error saving theme to localStorage:", error);
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
