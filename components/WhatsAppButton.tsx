"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./SocialIcons";

const GREETING_KEY = "apu-whatsapp-greeted";

export function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(GREETING_KEY)) return;
    } catch {
      // The contact link also works when browser storage is unavailable.
    }
    const reveal = window.setTimeout(() => {
      try { sessionStorage.setItem(GREETING_KEY, "1"); } catch {}
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && (focused.matches("input, textarea, select") || focused.closest("#reservar"))) return;
      setShowGreeting(true);
    }, 4000);
    const hide = window.setTimeout(() => setShowGreeting(false), 11000);
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.closest("#reservar"))) setShowGreeting(false);
    };
    document.addEventListener("focusin", onFocus);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(hide);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-end gap-3 sm:bottom-6 sm:right-6">
      {showGreeting && (
        <div className="animate-whatsapp-greet-in relative max-w-[min(15rem,calc(100vw-6.5rem))] rounded-xl border border-sage-pale bg-cream-soft p-4 pr-9 text-sm leading-relaxed text-ink shadow-lg shadow-ink/10">
          {t("greeting")}
          <button type="button" onClick={() => setShowGreeting(false)} aria-label={t("dismiss")}
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:text-sage-deep">×</button>
        </div>
      )}
      <a href={whatsappHref(t("defaultMessage"))} target="_blank" rel="noopener noreferrer" aria-label={t("label")}
        onClick={() => setShowGreeting(false)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-deep text-cream shadow-md shadow-ink/20 transition-colors hover:bg-sage sm:h-13 sm:w-13">
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
