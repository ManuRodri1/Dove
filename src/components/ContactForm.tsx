"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import { submitContactInquiry, validateContactInquiry, type ContactInquiryInput, type ContactInquiryErrors } from "@/lib/contact-inquiry";
import { links } from "@/content/links";
import { contactEn } from "@/i18n/messages/contact-copy";
import { contactEs } from "@/i18n/messages/contact-es-copy";

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = locale === "es" ? contactEs : contactEn;
  const [errors, setErrors] = useState<ContactInquiryErrors>({});
  const [status, setStatus] = useState<"" | "invalid" | "success" | "error">("");
  const [busy, setBusy] = useState(false);
  const email = links.email.executiveDirector.replace("mailto:", "");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const input: ContactInquiryInput = { firstName: String(data.get("firstName") ?? ""), lastName: String(data.get("lastName") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), reason: String(data.get("reason") ?? "general") as ContactInquiryInput["reason"], message: String(data.get("message") ?? ""), locale };
    const nextErrors = validateContactInquiry(input); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setStatus("invalid"); form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return; }
    setBusy(true); const result = await submitContactInquiry(input, String(data.get("honeypot") ?? "")); setBusy(false);
    if (result.status === "accepted") { setStatus("success"); form.reset(); } else setStatus(result.status);
  }
  const invalid = (field: keyof ContactInquiryErrors) => errors[field] || undefined;
  return <form className="contact-form" onSubmit={submit} noValidate aria-describedby="contact-form-status">
    <div className="form-grid"><label>{copy.form.firstName}<input name="firstName" required autoComplete="given-name" maxLength={80} aria-invalid={invalid("firstName")} /></label><label>{copy.form.lastName}<input name="lastName" required autoComplete="family-name" maxLength={80} aria-invalid={invalid("lastName")} /></label></div>
    <label>{copy.form.email}<input name="email" type="email" required autoComplete="email" maxLength={254} aria-invalid={invalid("email")} /></label><label>{copy.form.phone}<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
    <label>{copy.form.reason}<select name="reason" defaultValue="general"><option value="general">{copy.form.general}</option><option value="programs">{copy.form.programs}</option><option value="volunteer">{copy.form.volunteer}</option><option value="travel">{copy.form.travel}</option><option value="sponsorship">{copy.form.sponsorship}</option><option value="partnership">{copy.form.partnership}</option><option value="donation">{copy.form.donation}</option><option value="other">{copy.form.other}</option></select></label><label>{copy.form.message}<textarea name="message" rows={6} required maxLength={3000} aria-invalid={invalid("message")} /></label>
    <label className="sr-only" aria-hidden="true">Leave this field blank<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>
    <button className="button button--primary" type="submit" disabled={busy}>{busy ? copy.form.busy : copy.form.submit}</button><p className="form-fallback">{copy.form.fallback} <a href={`mailto:${email}`}>{email}</a></p>
    <p id="contact-form-status" role="status" aria-live="polite">{status === "success" ? copy.form.success : status === "invalid" ? copy.form.invalid : status === "error" ? copy.form.error : ""}</p>
  </form>;
}
