import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "La Moto", href: "#moto" },
    { name: "Rutas", href: "#rutas" },
    { name: "Tarifas", href: "#tarifas" },
    { name: "Requisitos", href: "#requisitos" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50 relative">
          <div className="bg-primary text-primary-foreground p-1.5 shadow-xs border-2 border-primary-foreground/20">
            <MapPin className="w-6 h-6" />
          </div>
          <span className={`font-display text-2xl tracking-widest ${isScrolled ? "text-foreground" : "text-white drop-shadow-md"}`}>
            MOTOLIMA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-bold tracking-wide uppercase transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-white drop-shadow-md hover:text-primary"
              }`}
              data-testid={`nav-link-${link.name.toLowerCase()}`}
            >
              {link.name}
            </a>
          ))}
          <Button 
            asChild
            className="rounded-none border-2 border-primary shadow-xs font-display tracking-widest text-lg px-6 py-6"
            data-testid="nav-cta-reservar"
          >
            <a href="#reservar">
              RESERVAR
            </a>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden z-50 relative p-2 ${
            isScrolled || mobileMenuOpen ? "text-foreground" : "text-white"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="nav-mobile-toggle"
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-center items-center gap-8 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-3xl font-display tracking-widest uppercase text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              data-testid={`nav-mobile-link-${link.name.toLowerCase()}`}
            >
              {link.name}
            </a>
          ))}
          <Button 
            asChild
            className="rounded-none border-2 border-primary shadow-xs font-display tracking-widest text-2xl px-8 py-8 mt-8"
            data-testid="nav-mobile-cta-reservar"
          >
            <a href="#reservar" onClick={() => setMobileMenuOpen(false)}>
              RESERVAR AHORA
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
