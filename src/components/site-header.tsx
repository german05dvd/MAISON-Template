import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router"; // Importamos Link
import { Search, User, Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/stores/cart-store";

const navLinks = [
  { label: "Colecciones", to: "/colecciones" }, // Cambiamos href por 'to'
  { label: "Editorial", to: "/editorial" },
  { label: "Tienda", to: "/tienda" },
  { label: "Ofertas", to: "/ofertas" },
];

interface SiteHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onOpenCart: () => void;
}

export function SiteHeader({
  searchQuery = "",
  onSearchChange,
  onOpenCart,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: Hamburger & Search */}
        <div className="flex flex-1 items-center gap-4 md:hidden">
          <button onClick={() => setOpen(!open)} className="p-1 text-foreground">
            {open ? <X strokeWidth={1} className="h-5 w-5" /> : <Menu strokeWidth={1} className="h-5 w-5" />}
          </button>
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 text-foreground">
            <Search strokeWidth={1} className="h-5 w-5" />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-1 justify-center md:justify-start">
          <Link to="/" className="font-serif text-2xl tracking-tight text-foreground md:text-3xl">
            Maison
          </Link>
        </div>

        {/* Center-Right: Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
          <div className="hidden items-center md:flex">
            <Search strokeWidth={1} className="absolute ml-2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar..."
              className="w-32 border-b border-foreground/20 bg-transparent py-1 pl-8 pr-2 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:w-48 focus:border-foreground focus:outline-none"
            />
          </div>

          <button className="hidden md:block p-1 text-foreground hover:opacity-60">
            <User strokeWidth={1} className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 p-1 text-foreground hover:opacity-60"
          >
            <ShoppingBag strokeWidth={1} className="h-5 w-5" />
            <span className="text-xs tabular-nums text-foreground">{count}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="border-t border-border/40 bg-background px-6 py-3 md:hidden">
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full border-b border-foreground/20 bg-transparent pb-1 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </div>
      )}

      {/* Mobile Nav Dropdown */}
      {open && (
        <nav className="md:hidden border-t border-border/40 bg-background">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-xs uppercase tracking-[0.22em] text-foreground hover:opacity-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px w-full bg-border/40" />
            <button className="flex items-center gap-3 py-3 text-xs uppercase tracking-[0.22em] text-foreground hover:opacity-50">
              <User strokeWidth={1} className="h-4 w-4" />
              Mi Cuenta
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}