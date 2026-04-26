import Link from "next/link";
import { themeConfig } from "@/config/theme.config";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/support", label: "Support" },
];

export const PublicNavbar = () => (
  <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(245,247,242,0.92)] backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex flex-col">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">{themeConfig.brand.shortName}</span>
        <span className="text-lg font-bold">{themeConfig.brand.name}</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/register" className="hidden sm:block">
          <Button>Start Ordering</Button>
        </Link>
      </div>
    </div>
  </header>
);
