"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";

const ROUTES = ["/", "/servicios", "/novedad", "/nosotros", "/reservas", "/contacto"] as const;
const ROUTE_KEYS = {
  "/": "home", "/servicios": "services", "/novedad": "whatsNew",
  "/nosotros": "about", "/reservas": "booking", "/contacto": "contact",
} as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const hasPhotoHeader = ROUTES.some((href) => href === pathname);
  const useLightText = hasPhotoHeader && !scrolled && !open;
  const solidHeader = !useLightText;
  const otherLocale = locale === "es" ? "en" : "es";
  const duration = reduceMotion ? 0 : 0.2;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${solidHeader ? "border-b border-tan/15 bg-cream-soft/95 backdrop-blur-md" : "border-b border-transparent bg-transparent"}`}>
      <nav aria-label={t("mainNavigation")} className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
        <Link href="/" className="shrink-0"><Logo light={useLightText} /></Link>
        <ul className="hidden items-center gap-5 lg:flex">
          {ROUTES.map((href) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border-b-2 text-[13px] font-medium transition-colors ${active
                    ? useLightText ? "border-honey text-cream" : "border-sage text-sage-deep"
                    : useLightText ? "border-transparent text-cream/90 hover:border-cream/50 hover:text-cream" : "border-transparent text-ink-soft hover:border-sage-pale hover:text-sage-deep"}`}>
                  {t(ROUTE_KEYS[href])}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <Link href={pathname} locale={otherLocale} aria-label={t("switchLanguage")}
            className={`inline-flex min-h-11 items-center text-xs font-semibold tracking-widest ${useLightText ? "text-cream hover:text-honey" : "text-ink-soft hover:text-sage-deep"}`}>
            {otherLocale.toUpperCase()}
          </Link>
          <Link href="/reservas" className="btn-primary px-5">{t("reserve")}</Link>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)}
          aria-label={open ? t("closeMenu") : t("openMenu")} aria-expanded={open} aria-controls="mobile-navigation"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden">
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} transition={{ duration }}
            className={`h-[2px] w-6 ${useLightText ? "bg-cream" : "bg-ink"}`} />
          <motion.span animate={{ opacity: open ? 0 : 1 }} transition={{ duration }}
            className={`h-[2px] w-6 ${useLightText ? "bg-cream" : "bg-ink"}`} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} transition={{ duration }}
            className={`h-[2px] w-6 ${useLightText ? "bg-cream" : "bg-ink"}`} />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration }}
            className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-tan/20 bg-cream-soft lg:hidden">
            <ul className="flex flex-col gap-1 px-5 py-4">
              {ROUTES.map((href) => (
                <li key={href}>
                  <Link href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 text-base ${pathname === href ? "bg-sage-pale/60 text-sage-deep" : "text-ink-soft"}`}>
                    {t(ROUTE_KEYS[href])}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-4 px-3 py-3">
                <span className="text-xs font-medium uppercase tracking-widest text-ink-soft">{t("language")}</span>
                <Link href={pathname} locale={otherLocale} onClick={() => setOpen(false)} aria-label={t("switchLanguage")}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-sage-deep">{otherLocale.toUpperCase()}</Link>
              </li>
              <li className="pt-2"><Link href="/reservas" onClick={() => setOpen(false)} className="btn-primary w-full">{t("reserve")}</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
