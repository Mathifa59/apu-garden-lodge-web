"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ContactMessageApiError, submitContactMessage } from "@/lib/contactMessage";

const inputClass =
  "w-full rounded-lg border border-sage-pale bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function ContactMessageForm() {
  const t = useTranslations("contactForm");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — debe quedar vacío

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const requiredFilled = name.trim() && email.trim() && message.trim();

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSent(false);
    setError(null);
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      await submitContactMessage({
        name,
        email,
        phone: phone || undefined,
        message,
        company: company || undefined,
      });
      setSent(true);
    } catch (err) {
      if (err instanceof ContactMessageApiError && err.message.startsWith("missing_fields")) {
        setError(t("errorMissingFields"));
      } else {
        setError(t("errorGeneric"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-sage-pale bg-cream-soft p-6 text-center shadow-lg shadow-ink/5 sm:p-8">
        <p className="font-display text-xl text-sage-deep">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-ink-soft">{t("successBody", { email })}</p>
        <button
          onClick={reset}
          className="mt-5 rounded-lg border border-sage-pale px-4 py-2 text-xs font-medium text-ink-soft hover:border-sage hover:text-sage-deep"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sage-pale bg-cream-soft p-6 shadow-lg shadow-ink/5 sm:p-8">
      {/* Honeypot anti-bot: invisible para humanos (mismo patrón que
          ComplaintsBookForm.tsx / BookingWidget.tsx). */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("name")}>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label={t("email")}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="mt-3">
        <Field label={t("phone")}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="mt-3">
        <Field label={t("message")}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messagePlaceholder")}
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

      <button
        onClick={submit}
        disabled={submitting || !requiredFilled}
        className="mt-5 w-full rounded-xl bg-terracotta px-6 py-2.5 font-ui text-sm font-semibold text-cream transition-all hover:bg-terracotta-bright active:scale-95 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t("sending") : t("submit")}
      </button>
    </div>
  );
}
