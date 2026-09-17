"use client";

import { useState, type FormEvent } from "react";
import type { PartnershipsContent } from "@/content/partnerships";
import {
  submitPartnershipInquiry,
  validatePartnershipInquiry,
  type PartnershipInquiryErrors,
  type PartnershipInquiryField,
  type PartnershipInquiryInput,
} from "@/lib/partnership-inquiry";

export default function PartnershipInquiryForm({ content }: { content: PartnershipsContent }) {
  const copy = content.inquiry;
  const [errors, setErrors] = useState<PartnershipInquiryErrors>({});
  const [status, setStatus] = useState<"" | "invalid" | "unavailable" | "success">("");
  const [busy, setBusy] = useState(false);

  function error(field: PartnershipInquiryField) {
    return errors[field] ? <span className="form-error" id={`partner-${field}-error`}>{copy.errors[field]}</span> : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input: PartnershipInquiryInput = {
      fullName: String(data.get("fullName") ?? ""),
      workEmail: String(data.get("workEmail") ?? ""),
      phone: String(data.get("phone") ?? ""),
      organizationName: String(data.get("organizationName") ?? ""),
      website: String(data.get("website") ?? ""),
      role: String(data.get("role") ?? ""),
      interest: String(data.get("interest") ?? ""),
      message: String(data.get("message") ?? ""),
      referral: String(data.get("referral") ?? ""),
      locale: content.locale,
    };
    const nextErrors = validatePartnershipInquiry(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("invalid");
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    setBusy(true);
    const result = await submitPartnershipInquiry(input);
    setBusy(false);
    if (result.status === "accepted") {
      setStatus("success");
      form.reset();
    } else setStatus(result.status === "invalid" ? "invalid" : "unavailable");
  }

  const required = <span aria-hidden="true"> *</span>;
  return <form className="partner-inquiry-form" onSubmit={submit} noValidate aria-describedby="partner-inquiry-intro partner-inquiry-status">
    <input type="hidden" name="locale" value={content.locale} />
    <fieldset>
      <legend>{copy.sections.contact}</legend>
      <div className="partner-fields">
        <div className="field">
          <label htmlFor="partner-fullName">{copy.fields.fullName}{required}</label>
          <input id="partner-fullName" name="fullName" autoComplete="name" required maxLength={160}
            aria-invalid={errors.fullName || undefined} aria-describedby={errors.fullName ? "partner-fullName-error" : undefined} />
          {error("fullName")}
        </div>
        <div className="field">
          <label htmlFor="partner-workEmail">{copy.fields.workEmail}{required}</label>
          <input id="partner-workEmail" name="workEmail" type="email" autoComplete="email" required maxLength={254}
            aria-invalid={errors.workEmail || undefined} aria-describedby={errors.workEmail ? "partner-workEmail-error" : undefined} />
          {error("workEmail")}
        </div>
        <div className="field">
          <label htmlFor="partner-phone">{copy.fields.phone}</label>
          <input id="partner-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>{copy.sections.organization}</legend>
      <div className="partner-fields">
        <div className="field">
          <label htmlFor="partner-organizationName">{copy.fields.organizationName}{required}</label>
          <input id="partner-organizationName" name="organizationName" autoComplete="organization" required maxLength={180}
            aria-invalid={errors.organizationName || undefined} aria-describedby={errors.organizationName ? "partner-organizationName-error" : undefined} />
          {error("organizationName")}
        </div>
        <div className="field">
          <label htmlFor="partner-website">{copy.fields.website}</label>
          <input id="partner-website" name="website" type="url" autoComplete="url" maxLength={300} inputMode="url" />
        </div>
        <div className="field">
          <label htmlFor="partner-role">{copy.fields.role}</label>
          <input id="partner-role" name="role" autoComplete="organization-title" maxLength={160} />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>{copy.sections.interest}</legend>
      <div className="field">
        <label htmlFor="partner-interest">{copy.fields.interest}{required}</label>
        <select id="partner-interest" name="interest" defaultValue="" required
          aria-invalid={errors.interest || undefined} aria-describedby={errors.interest ? "partner-interest-error" : undefined}>
          <option value="" disabled>{copy.selectPlaceholder}</option>
          {copy.options.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
        {error("interest")}
      </div>
    </fieldset>

    <fieldset>
      <legend>{copy.sections.message}</legend>
      <div className="partner-fields partner-fields--message">
        <div className="field field--wide">
          <label htmlFor="partner-message">{copy.fields.message}{required}</label>
          <textarea id="partner-message" name="message" rows={7} required maxLength={3000}
            aria-invalid={errors.message || undefined} aria-describedby={errors.message ? "partner-message-error" : undefined} />
          {error("message")}
        </div>
        <div className="field field--wide">
          <label htmlFor="partner-referral">{copy.fields.referral}</label>
          <input id="partner-referral" name="referral" maxLength={500} />
        </div>
      </div>
    </fieldset>

    <div className="partner-submit-row">
      <button className="button button--primary" type="submit" disabled={busy}>{busy ? copy.busy : copy.submit}</button>
      <a className="text-link" href={content.inquiryContact.href}>{content.inquiryContact.label}<span aria-hidden="true">→</span></a>
    </div>
    <div id="partner-inquiry-status" className={`partner-inquiry-status ${status ? `is-${status}` : ""}`} role="status" aria-live="polite">
      {status === "invalid" ? copy.invalid : status === "unavailable" ? copy.unavailable : status === "success" ? copy.success : ""}
    </div>
  </form>;
}
