"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";

const ROUTES = ["/", "/servicios", "/novedad", "/nosotros", "/reservas", "/contacto"] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al cambiar de ruta — ajustado durante el render en
  // vez de en un efecto, siguiendo el patrón recomendado por React.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Todas las páginas abren con una foto/cielo oscuro de fondo bajo el nav
  // (cada header tiene su propia imagen) — el texto del nav parte claro y
  // solo cambia a oscuro una vez que se hace scroll sobre fondo claro.
  const useLightText = !scrolled;
  const otherLocale = locale === "es" ? "en" : "es";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 shadow-[0_1px_0_0_var(--color-cream-deep)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="shrink-0 drop-shadow-sm">
          <Logo light={useLightText} />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {ROUTES.map((href) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-ui text-sm font-medium tracking-wide transition-colors drop-shadow-sm ${
                  pathname === href
                    ? "text-terracotta"
                    : useLightText
                      ? "text-cream hover:text-honey"
                      : "text-ink-soft hover:text-sage"
                }`}
              >
                {t(routeKey(href))}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={pathname}
            locale={otherLocale}
            className={`font-ui text-xs font-semibold tracking-widest transition-colors drop-shadow-sm ${
              useLightText ? "text-cream/80 hover:text-honey" : "text-ink-soft hover:text-sage"
            }`}
          >
            {otherLocale.toUpperCase()}
          </Link>
          <Link
            href="/reservas"
            className="rounded-full bg-terracotta px-5 py-2.5 font-ui text-sm font-semibold text-cream transition-all hover:bg-terracotta-bright hover:shadow-lg active:scale-95"
          >
            {t("reserve")}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className={`h-[2px] w-6 transition-colors ${useLightText && !open ? "bg-cream" : "bg-ink"}`}
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className={`h-[2px] w-6 transition-colors ${useLightText && !open ? "bg-cream" : "bg-ink"}`}
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className={`h-[2px] w-6 transition-colors ${useLightText && !open ? "bg-cream" : "bg-ink"}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-cream-deep bg-cream lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {ROUTES.map((href) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-lg px-3 py-2.5 font-ui text-base ${
                      pathname === href ? "bg-sage-pale text-sage-deep" : "text-ink-soft"
                    }`}
                  >
                    {t(routeKey(href))}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-3 px-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                  {t("language")}
                </span>
                <Link
                  href={pathname}
                  locale={otherLocale}
                  className="text-xs font-semibold uppercase tracking-widest text-terracotta"
                >
                  {otherLocale.toUpperCase()}
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/reservas"
                  className="block rounded-full bg-terracotta px-4 py-3 text-center font-ui text-sm font-semibold text-cream"
                >
                  {t("reserve")}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function routeKey(href: (typeof ROUTES)[number]) {
  const map = {
    "/": "home",
    "/servicios": "services",
    "/novedad": "whatsNew",
    "/nosotros": "about",
    "/reservas": "booking",
    "/contacto": "contact",
  } satisfies Record<(typeof ROUTES)[number], string>;
  return map[href];
}
