"use client";

import { useState, type FormEvent } from "react";
import type { VolunteerContent } from "@/content/volunteer";
import { VOLUNTEER_RELEASE_VERSION } from "@/content/volunteer-release";
import { submitVolunteerApplication, validateVolunteerApplication, type VolunteerApplicationInput, type VolunteerErrors, type VolunteerField } from "@/lib/volunteer-application";

export default function VolunteerApplicationForm({ content }: { content: VolunteerContent }) {
  const copy = content.application;
  const [errors, setErrors] = useState<VolunteerErrors>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"" | "invalid" | "unavailable" | "success">("");

  function message(field: VolunteerField) {
    return errors[field] ? <span className="form-error" id={`${field}-error`}>{copy.errors[field]}</span> : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input: VolunteerApplicationInput = {
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      requestedStartDate: String(data.get("requestedStartDate") ?? ""),
      numberOfDays: String(data.get("numberOfDays") ?? ""),
      acceptedRelease: data.get("acceptedRelease") === "on",
      locale: content.locale,
      releaseVersion: VOLUNTEER_RELEASE_VERSION,
      honeypot: String(data.get("honeypot") ?? ""),
    };
    const nextErrors = validateVolunteerApplication(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("invalid");
      const first = Object.keys(nextErrors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setBusy(true);
    const result = await submitVolunteerApplication(input);
    setBusy(false);
    if (result.status === "accepted") {
      setStatus("success");
      form.reset();
    } else {
      setStatus(result.status === "invalid" ? "invalid" : "unavailable");
    }
  }

  return <form className="volunteer-form" onSubmit={submit} noValidate aria-describedby="volunteer-form-intro volunteer-form-status">
    <input type="hidden" name="locale" value={content.locale} />
    <input type="hidden" name="releaseVersion" value={VOLUNTEER_RELEASE_VERSION} />
    <label className="sr-only" aria-hidden="true">Leave this field blank<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>
    <div className="volunteer-fields">
      <div className="field field--wide">
        <label htmlFor="fullName">{copy.fields.fullName}</label>
        <input id="fullName" name="fullName" autoComplete="name" required maxLength={160}
          aria-invalid={errors.fullName || undefined} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
        {message("fullName")}
      </div>
      <div className="field">
        <label htmlFor="volunteer-email">{copy.fields.email}</label>
        <input id="volunteer-email" name="email" type="email" autoComplete="email" required maxLength={254}
          aria-invalid={errors.email || undefined} aria-describedby={errors.email ? "email-error" : undefined} />
        {message("email")}
      </div>
      <div className="field">
        <label htmlFor="phone">{copy.fields.phone}</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={40}
          aria-invalid={errors.phone || undefined} aria-describedby={errors.phone ? "phone-error" : undefined} />
        {message("phone")}
      </div>
      <div className="field">
        <label htmlFor="requestedStartDate">{copy.fields.requestedStartDate}</label>
        <input id="requestedStartDate" name="requestedStartDate" type="date" required
          aria-invalid={errors.requestedStartDate || undefined} aria-describedby={errors.requestedStartDate ? "requestedStartDate-error" : undefined} />
        {message("requestedStartDate")}
      </div>
      <div className="field">
        <label htmlFor="numberOfDays">{copy.fields.numberOfDays}</label>
        <input id="numberOfDays" name="numberOfDays" type="number" min="1" step="1" inputMode="numeric" required
          aria-invalid={errors.numberOfDays || undefined} aria-describedby={`numberOfDays-help${errors.numberOfDays ? " numberOfDays-error" : ""}`} />
        <span className="field-help" id="numberOfDays-help">{copy.daysHelp}</span>
        {message("numberOfDays")}
      </div>
    </div>

    <section className="volunteer-release" aria-labelledby="release-heading">
      <div className="volunteer-release-head">
        <div><p className="eyebrow">{content.hero.eyebrow}</p><h3 id="release-heading">{copy.releaseHeading}</h3></div>
        <p>{copy.releaseIntro}</p>
      </div>
      <div className="volunteer-release-document" lang="en" tabIndex={0} aria-label={copy.releaseHeading}>
        {content.release.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <p className="volunteer-release-version">Version {content.release.version} · Source: {content.release.source} · Effective date: pending</p>
      <p className="volunteer-legal-pending">{copy.legalPending}</p>
    </section>

    <div className="field volunteer-acceptance">
      <label><input name="acceptedRelease" type="checkbox" required aria-invalid={errors.acceptedRelease || undefined}
        aria-describedby={errors.acceptedRelease ? "acceptedRelease-error" : undefined} /><span>{copy.acceptance}</span></label>
      {message("acceptedRelease")}
    </div>
    <p className="form-privacy-notice" style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #666)", margin: "0.5rem 0" }}>
      {content.locale === "es"
        ? "Al enviar esta solicitud, reconoces que Dove Youth Development utilizará la información provista para evaluar y coordinar el voluntariado. Las solicitudes están destinadas a adultos. "
        : "By submitting this application, you acknowledge that Dove Youth Development will use your information to evaluate and coordinate volunteer participation. Applications are intended for adults. "}
      <a href={`/${content.locale}/privacy`} style={{ textDecoration: "underline" }}>
        {content.locale === "es" ? "Política de Privacidad" : "Privacy Policy"}
      </a>
      .
    </p>
    <div className="volunteer-submit-row">
      <button className="button button--primary" type="submit" disabled={busy}>{busy ? copy.busy : copy.submit}</button>
      <a className="text-link" href={content.contactLink.href}>{content.contactLink.label}<span aria-hidden="true">→</span></a>
    </div>
    <div id="volunteer-form-status" className={`volunteer-form-status ${status ? `is-${status}` : ""}`} role="status" aria-live="polite">
      {status === "invalid" ? copy.invalid : status === "unavailable" ? copy.unavailable : status === "success" ? copy.success : ""}
    </div>
  </form>;
}
