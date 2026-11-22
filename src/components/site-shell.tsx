import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { brandLogo, nav } from "@/data/site";
import { whatsappLink } from "@/lib/contact-info";
import { useContactInfo } from "@/lib/use-contact-info";
import { btnGold, btnOutline, d } from "@/components/site-ui";

export function Logo() {
  return (
    <Link to="/" className="block w-[170px] shrink-0 sm:w-[190px]" aria-label="Giovanne Camargo — início">
      <img src={brandLogo} alt="Giovanne Camargo" width={1110} height={380} className="block h-auto w-full object-contain" />
    </Link>
  );
}

function NavLink({ to, label, onClick, mobile }: { to: string; label: string; onClick?: () => void; mobile?: boolean }) {
  return (
    <Link to={to} onClick={onClick} activeOptions={{ exact: true }} className={mobile ? "nav-link-mobile" : "nav-link"} activeProps={{ "data-active": "true" } as any}>
      {label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { data: contact } = useContactInfo();
  const hiringLink = whatsappLink(contact?.whatsapp);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const solid = scrolled || open || pathname !== "/";
  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "border-b border-border bg-background/90 backdrop-blur" : "border-b border-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">{nav.map((item) => <NavLink key={item.to} {...item} />)}</nav>
        <div className="flex items-center gap-3">
          {hiringLink ? <a href={hiringLink} target="_blank" rel="noreferrer" className={`${btnOutline} hidden px-5 py-2 sm:inline-flex`}><MessageCircle className="h-4 w-4" /> Contratar</a> : <Link to="/contato" className={`${btnOutline} hidden px-5 py-2 sm:inline-flex`}><MessageCircle className="h-4 w-4" /> Contratar</Link>}
          <button className="relative h-6 w-6 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
            <Menu className={`absolute inset-0 transition duration-300 ${open ? "rotate-90 opacity-0" : "opacity-100"}`} />
            <X className={`absolute inset-0 transition duration-300 ${open ? "opacity-100" : "-rotate-90 opacity-0"}`} />
          </button>
        </div>
      </div>
      <div className={`mobile-menu grid lg:hidden ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`} aria-hidden={!open}>
        <nav className="overflow-hidden"><div className="border-t border-border bg-background px-5 pb-6">
          {nav.map((item, index) => <div key={item.to} className={`menu-item ${open ? "is-open" : ""}`} style={d(index)}><NavLink {...item} mobile onClick={() => setOpen(false)} /></div>)}
          {hiringLink ? <a href={hiringLink} target="_blank" rel="noreferrer" className={`${btnGold} mt-5 w-full`}><MessageCircle className="h-4 w-4" /> Contratar</a> : <Link to="/contato" onClick={() => setOpen(false)} className={`${btnGold} mt-5 w-full`}><MessageCircle className="h-4 w-4" /> Contratar</Link>}
        </div></nav>
      </div>
    </header>
  );
}

export function RouteProgress() {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-line" aria-hidden />;
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-10 md:flex-row md:justify-between">
        <Logo />
        <nav className="flex flex-wrap justify-center gap-6">{nav.map((item) => <Link key={item.to} to={item.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">{item.label}</Link>)}</nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Giovanne Camargo</p>
      </div>
    </footer>
  );
}
