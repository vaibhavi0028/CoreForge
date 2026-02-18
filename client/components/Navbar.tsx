"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  BarChart3,
  Activity,
  Home,
  FlaskConical,
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/benchmark", label: "Benchmark", icon: FlaskConical },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/logs", label: "Logs", icon: Activity },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const links = isAuthenticated
    ? [...publicLinks.filter((link) => link.label !== "Home"), ...authLinks]
    : publicLinks;

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="gradient-bg p-2 rounded-lg transition-transform group-hover:scale-110">
            <img src="/icon.png" alt="CoreForge logo" className="h-9 w-9 rounded-lg object-contain" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">
            CoreForge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="cursor-pointer">
              <Button
                variant={isActive(href) ? "secondary" : "ghost"}
                size="sm"
                className="cursor-pointer gap-2 transition-all"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="cursor-pointer transition-all hover:scale-110"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : null}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="gap-1"
              >
                <LogOut className="h-3 w-3" /> Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="gradient-bg border-0 text-primary-foreground hover:opacity-90"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50"
          >
            <div className="container mx-auto p-4 flex flex-col gap-2">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="cursor-pointer"
                >
                  <Button
                    variant={isActive(href) ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {mounted ? (
                    theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )
                  ) : null}
                </Button>
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileOpen(false);
                    }}
                    className="gap-1"
                  >
                    <LogOut className="h-3 w-3" /> Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      size="sm"
                      className="gradient-bg border-0 text-primary-foreground"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
