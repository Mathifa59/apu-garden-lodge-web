"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ComplaintApiError,
  submitComplaint,
  type ComplaintKind,
  type DocumentType,
} from "@/lib/complaints";

const inputClass =
  "w-full rounded-lg border border-sage-pale bg-cream-soft px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function ComplaintsBookForm() {
  const t = useTranslations("libro");
  const locale = useLocale();

  const [kind, setKind] = useState<ComplaintKind>("reclamo");
  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("dni");
  const [documentNumber, setDocumentNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianDocumentNumber, setGuardianDocumentNumber] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [claimedAmount, setClaimedAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [request, setRequest] = useState("");
  const [company, setCompany] = useState(""); // honeypot — debe quedar vacío

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ claimCode: string; email: string } | null>(null);

  const requiredFilled =
    fullName.trim() &&
    documentNumber.trim() &&
    email.trim() &&
    detail.trim() &&
    request.trim() &&
    (!isMinor || (guardianName.trim() && guardianDocumentNumber.trim()));

  function reset() {
    setKind("reclamo");
    setFullName("");
    setDocumentType("dni");
    setDocumentNumber("");
    setAddress("");
    setPhone("");
    setEmail("");
    setIsMinor(false);
    setGuardianName("");
    setGuardianDocumentNumber("");
    setServiceDescription("");
    setClaimedAmount("");
    setDetail("");
    setRequest("");
    setResult(null);
    setError(null);
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await submitComplaint({
        kind,
        fullName,
        documentType,
        documentNumber,
        address: address || undefined,
        phone: phone || undefined,
        email,
        isMinor,
        guardianName: isMinor ? guardianName : undefined,
        guardianDocumentNumber: isMinor ? guardianDocumentNumber : undefined,
        serviceDescription: serviceDescription || undefined,
        claimedAmount: claimedAmount || undefined,
        detail,
        request,
        company: company || undefined,
      });
      setResult({ claimCode: res.claimCode, email });
    } catch (err) {
      if (err instanceof ComplaintApiError && err.message.startsWith("missing_fields") && locale === "es") {
        setError(t("errorMissingFields"));
      } else {
        setError(t("errorGeneric"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-[2rem] border border-sage-pale bg-cream-soft p-6 text-center shadow-xl shadow-ink/5 sm:p-10">
        <p className="font-display text-2xl text-sage-deep">{t("successTitle")}</p>
        <p className="mt-3 text-sm text-ink-soft">
          {t("successBody", { claimCode: result.claimCode, email: result.email })}
        </p>
        <p className="mt-2 font-display text-2xl tracking-wide text-terracotta">{result.claimCode}</p>
        <p className="mt-3 text-sm text-ink-soft">{t("successDeadline")}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg border border-sage-pale px-4 py-2 text-xs font-medium text-ink-soft hover:border-sage hover:text-sage-deep"
        >
          {t("newComplaint")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-sage-pale bg-cream-soft p-6 shadow-xl shadow-ink/5 sm:p-8">
      <p className="font-display text-2xl text-sage-deep">{t("formTitle")}</p>

      {/* Honeypot anti-bot: invisible para humanos (ver components/BookingWidget.tsx) */}
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

      <div className="mt-5">
        <Field label={t("kindLabel")}>
          <div className="flex gap-2">
            {(["reclamo", "queja"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  kind === k
                    ? "border-terracotta bg-terracotta text-cream"
                    : "border-sage-pale bg-cream text-ink-soft hover:border-sage"
                }`}
              >
                {k === "reclamo" ? t("kindReclamo") : t("kindQueja")}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label={t("fullName")}>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </Field>
        <Field label={t("email")}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>

        <Field label={t("documentType")}>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            className={inputClass}
          >
            <option value="dni">{t("docDni")}</option>
            <option value="ce">{t("docCe")}</option>
            <option value="pasaporte">{t("docPassport")}</option>
          </select>
        </Field>
        <Field label={t("documentNumber")}>
          <input
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label={t("address")}>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </Field>
        <Field label={t("phone")}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={isMinor}
          onChange={(e) => setIsMinor(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-sage-pale text-terracotta focus:ring-terracotta/40"
        />
        {t("isMinorLabel")}
      </label>

      {isMinor && (
        <div className="mt-3 grid gap-3 rounded-xl border border-sage-pale/60 bg-cream p-4 sm:grid-cols-2">
          <Field label={t("guardianName")}>
            <input
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label={t("guardianDocumentNumber")}>
            <input
              value={guardianDocumentNumber}
              onChange={(e) => setGuardianDocumentNumber(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label={t("serviceDescription")}>
          <input
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            placeholder={t("serviceDescriptionPlaceholder")}
            className={inputClass}
          />
        </Field>
        <Field label={t("claimedAmount")}>
          <input
            value={claimedAmount}
            onChange={(e) => setClaimedAmount(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-3">
        <Field label={t("detail")}>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t("detailPlaceholder")}
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label={t("request")}>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder={t("requestPlaceholder")}
            rows={3}
            className={inputClass}
          />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

      <button
        onClick={submit}
        disabled={submitting || !requiredFilled}
        className="mt-6 w-full rounded-xl bg-terracotta px-6 py-2.5 font-ui text-sm font-semibold text-cream transition-all hover:bg-terracotta-bright active:scale-95 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t("sending") : t("submit")}
      </button>
    </div>
  );
}
