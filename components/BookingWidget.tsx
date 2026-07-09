"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { ApiError, checkAvailability, createBookingRequest, type AvailabilityResponse, type RoomType } from "@/lib/api";
import { RoomDetailModal } from "./RoomDetailModal";
import { roomPhotos } from "@/lib/roomPhotos";

const CHECK_IN_TIME = "15:00:00";
const CHECK_OUT_TIME = "11:00:00";

function toIso(date: string, time: string) {
  return `${date}T${time}`;
}

export function BookingWidget() {
  const t = useTranslations("booking");
  const tr = useTranslations("rooms");
  const locale = useLocale();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AvailabilityResponse | null>(null);
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [previewType, setPreviewType] = useState<RoomType | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  // Los mensajes de error que vienen del backend siempre están en español
  // (es un sistema interno del hotel) — en inglés mostramos un mensaje
  // genérico traducido en vez del texto crudo del API.
  function apiErrorMessage(err: unknown): string {
    if (err instanceof ApiError && locale === "es") return err.message;
    return t("genericError");
  }

  async function search() {
    setError(null);
    if (!checkIn || !checkOut) {
      setError(t("pickDates"));
      return;
    }
    if (checkOut <= checkIn) {
      setError(t("checkoutAfterCheckin"));
      return;
    }
    setLoading(true);
    setSelectedType(null);
    try {
      const res = await checkAvailability(toIso(checkIn, CHECK_IN_TIME), toIso(checkOut, CHECK_OUT_TIME));
      setResult(res);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="reservar" className="rounded-[2rem] border border-sage-pale bg-cream-soft p-6 shadow-xl shadow-ink/5 sm:p-8">
      <p className="font-display text-2xl text-sage-deep">{t("title")}</p>
      <p className="mt-1 text-sm text-ink-soft">{t("subtitle")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
        <Field label={t("arrival")}>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-xl border border-sage-pale bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/25"
          />
        </Field>
        <Field label={t("departure")}>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border border-sage-pale bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/25"
          />
        </Field>
        <Field label={t("guests")}>
          <div className="flex items-center justify-between rounded-xl border border-sage-pale bg-cream px-1">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-sage-deep transition hover:bg-sage-pale hover:text-terracotta"
              aria-label={t("fewerGuests")}
            >
              −
            </button>
            <span className="text-center text-sm">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(8, g + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-sage-deep transition hover:bg-sage-pale hover:text-terracotta"
              aria-label={t("moreGuests")}
            >
              +
            </button>
          </div>
        </Field>

        <div className="flex items-end">
          <button
            onClick={search}
            disabled={loading}
            className="w-full rounded-xl bg-terracotta px-6 py-2.5 font-ui text-sm font-semibold text-cream transition-all hover:bg-terracotta-bright active:scale-95 disabled:opacity-60 sm:w-auto"
          >
            {loading ? t("searching") : t("search")}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {result.room_types.map((rt) => (
              <div
                key={rt.type}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  rt.available ? "border-sage-pale bg-cream" : "border-cream-deep bg-cream/40 opacity-60"
                }`}
              >
                <button
                  onClick={() => setPreviewType(rt.type)}
                  aria-label={tr(`${rt.type}.label`)}
                  className="relative block aspect-[16/10] w-full"
                >
                  <Image
                    src={roomPhotos(rt.type)[0]}
                    alt={tr(`${rt.type}.label`)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </button>
                <div className="p-4">
                  <p className="font-display text-lg text-ink">{tr(`${rt.type}.label`)}</p>
                  <p className="mt-1 text-xs text-ink-soft">{tr(`${rt.type}.description`)}</p>
                  <p className="mt-2 font-display text-base text-sage-deep">
                    {t("perNight", { price: rt.price_pen })}
                  </p>
                  <p
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      rt.available ? "bg-sage-pale text-sage-deep" : "bg-terracotta/10 text-terracotta"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${rt.available ? "bg-sage" : "bg-terracotta"}`} />
                    {rt.available ? t("available") : t("unavailable")}
                  </p>
                  {/* Aunque no haya cupo, se puede enviar la solicitud igual —
                      queda en lista de espera y recepción la resuelve a mano,
                      en vez de simplemente cerrarle la puerta al huésped. */}
                  <button
                    onClick={() => setSelectedType(rt.type)}
                    className={`mt-4 w-full rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      rt.available
                        ? "border-sage text-sage-deep hover:bg-sage hover:text-cream"
                        : "border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-cream"
                    }`}
                  >
                    {rt.available ? t("requestBooking") : t("waitlistBooking")}
                  </button>
                  {!rt.available && <p className="mt-2 text-[11px] text-ink-soft">{t("waitlistNote")}</p>}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedType && (
          <RequestForm
            roomType={selectedType}
            checkIn={toIso(checkIn, CHECK_IN_TIME)}
            checkOut={toIso(checkOut, CHECK_OUT_TIME)}
            guests={guests}
            onClose={() => setSelectedType(null)}
          />
        )}
      </AnimatePresence>

      {previewType && (
        <RoomDetailModal
          type={previewType}
          photos={roomPhotos(previewType)}
          priceLabel={
            result
              ? t("perNight", { price: result.room_types.find((rt) => rt.type === previewType)?.price_pen ?? "" })
              : undefined
          }
          onClose={() => setPreviewType(null)}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function RequestForm({
  roomType,
  checkIn,
  checkOut,
  guests,
  onClose,
}: {
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  guests: number;
  onClose: () => void;
}) {
  const t = useTranslations("booking");
  const tr = useTranslations("rooms");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState(""); // honeypot — debe quedar vacío
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [roomAssigned, setRoomAssigned] = useState(true);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await createBookingRequest({
        guest_name: name,
        guest_email: email,
        guest_phone: phone || undefined,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        room_type: roomType,
        notes: notes || undefined,
        company: company || undefined,
      });
      setRoomAssigned(res.room_assigned);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError && locale === "es" ? err.message : t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-6 rounded-2xl border border-sage-pale bg-cream p-5 sm:p-6">
        {done ? (
          <div className="py-4 text-center">
            <p className="font-display text-xl text-sage-deep">{t("sent")}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {t(roomAssigned ? "sentDetail" : "sentWaitlistDetail", {
                email,
                roomType: tr(`${roomType}.label`).toLowerCase(),
              })}
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded-lg border border-sage-pale px-4 py-2 text-xs font-medium text-ink-soft hover:border-sage hover:text-sage-deep"
            >
              {t("close")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-ink">
                {t("yourDetails")} — {tr(`${roomType}.label`)}
              </p>
              <button onClick={onClose} aria-label={t("close")} className="text-ink-soft hover:text-terracotta">
                ✕
              </button>
            </div>

            {/* Honeypot anti-bot: invisible para humanos (fuera de pantalla,
                sin tab ni autocompletado). Si llega lleno, el backend lo
                descarta. No usamos display:none porque algunos bots lo saltan. */}
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("fullName")}
                className="rounded-lg border border-sage-pale bg-cream-soft px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 sm:col-span-2"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="rounded-lg border border-sage-pale bg-cream-soft px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phone")}
                className="rounded-lg border border-sage-pale bg-cream-soft px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notes")}
                rows={2}
                className="rounded-lg border border-sage-pale bg-cream-soft px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 sm:col-span-2"
              />
            </div>

            {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

            <button
              onClick={submit}
              disabled={submitting || !name || !email}
              className="mt-4 w-full rounded-lg bg-sage py-2.5 text-sm font-semibold text-cream transition hover:bg-sage-deep active:scale-[0.98] disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {submitting ? t("sending") : t("send")}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
