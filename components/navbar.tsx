"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/language-provider";

type NavItemKey = "home" | "about" | "blog" | "projects" | "favorites" | "contact";

type NavItem = {
  key: NavItemKey;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { key: "home", href: "/#home" },
  { key: "about", href: "/#about" },
  {
    key: "blog",
    href: "https://github.com/Aprivity",
    external: true,
  },
  { key: "projects", href: "/projects" },
  { key: "favorites", href: "/favorites" },
  { key: "contact", href: "/contact" },
];

export function Navbar() {
  const { messages } = useLanguage();

  return (
    <header className="sticky top-0 z-50 pt-6">
      <nav className="site-navbar glow-ring flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:px-5">
        <a
          href="/#home"
          className="site-brand hover-smooth font-[family-name:var(--font-space-grotesk)] text-lg font-semibold tracking-[0.24em] text-white/90 hover:text-white hover:[text-shadow:0_0_16px_rgba(148,197,255,0.3)]"
        >
          APRIVITY_
        </a>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="site-nav-link nav-link-glow hover-smooth relative rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white hover:[text-shadow:0_0_14px_rgba(191,219,254,0.2)]"
              >
                {messages.nav[item.key]}
              </a>
            ))}
          </div>

          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

