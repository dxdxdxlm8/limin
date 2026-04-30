import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageTransition } from "@/components/generated/PageTransition";
import { ThemeProvider } from "@/lib/themeContext";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </ThemeProvider>
  );
}
