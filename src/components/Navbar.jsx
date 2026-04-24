"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { name: "Home",     path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Contact",  path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname              = usePathname();
  const { theme, toggle }     = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink-900/95 backdrop-blur-md border-b border-ink-600 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl text-cream-100 hover:text-electric-400 transition-colors"
        >
          Jalade<span className="text-electric-400 font-mono text-base">.</span>dev
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`font-mono text-sm tracking-wide transition-colors ${
                pathname === item.path
                  ? "text-electric-400"
                  : "text-cream-200/60 hover:text-cream-100"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-ink-600 flex items-center justify-center
                       text-cream-200/50 hover:text-electric-400 hover:border-electric-400/40
                       transition-all duration-200"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* CTA */}
          <Link
            href="/quote"
            className="font-mono text-sm px-4 py-2 border border-electric-500 text-electric-500
                       rounded hover:shadow-[0_0_30px_rgba(79,158,255,0.4)] transition-all duration-300"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-ink-600 flex items-center justify-center
                       text-cream-200/50 hover:text-electric-400 transition-all duration-200"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-cream-100 p-1"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-ink-800 border-t border-ink-600 px-4 pb-6 pt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block py-3 font-mono text-sm border-b border-ink-600 transition-colors ${
                pathname === item.path
                  ? "text-electric-400"
                  : "text-cream-200/60 hover:text-cream-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/quote"
            className="mt-4 block text-center font-mono text-sm px-4 py-3 border border-electric-500
                       text-electric-500 rounded hover:bg-electric-500/10 transition-all duration-300"
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
}