"use client";

import { useState, type FormEvent } from "react";
import type { TravelWithPurposeContent } from "@/content/travel-with-purpose";
import { submitGroupExperienceInquiry, validateGroupExperienceInquiry, type GroupExperienceInquiryInput, type GroupInquiryErrors, type GroupInquiryField } from "@/lib/group-experience-inquiry";

export default function GroupExperienceInquiryForm({ content }: { content: TravelWithPurposeContent }) {
  const copy = content.inquiry;
  const [errors, setErrors] = useState<GroupInquiryErrors>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"" | "invalid" | "unavailable" | "success">("");

  function error(field: GroupInquiryField) {
    return errors[field] ? <span className="form-error" id={`group-${field}-error`}>{copy.errors[field]}</span> : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input: GroupExperienceInquiryInput = {
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      organizationName: String(data.get("organizationName") ?? ""),
      groupType: String(data.get("groupType") ?? ""),
      estimatedGroupSize: String(data.get("estimatedGroupSize") ?? ""),
      preferredStartDate: String(data.get("preferredStartDate") ?? ""),
      alternateDates: String(data.get("alternateDates") ?? ""),
      approximateDuration: String(data.get("approximateDuration") ?? ""),
      aboutGroup: String(data.get("aboutGroup") ?? ""),
      skillsInterests: String(data.get("skillsInterests") ?? ""),
      discussLodging: data.get("discussLodging") === "on",
      discussTransportation: data.get("discussTransportation") === "on",
      discussExcursions: data.get("discussExcursions") === "on",
      locale: content.locale,
      honeypot: String(data.get("honeypot") ?? ""),
    };
    const nextErrors = validateGroupExperienceInquiry(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("invalid");
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    setBusy(true);
    const result = await submitGroupExperienceInquiry(input);
    setBusy(false);
    if (result.status === "accepted") {
      setStatus("success");
      form.reset();
    } else setStatus(result.status === "invalid" ? "invalid" : "unavailable");
  }

  const required = <span aria-hidden="true"> *</span>;
  return <form className="group-inquiry-form" onSubmit={submit} noValidate aria-describedby="group-inquiry-intro group-inquiry-status">
    <input type="hidden" name="locale" value={content.locale} />
    <label className="sr-only" aria-hidden="true">Leave this field blank<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>

    <fieldset>
      <legend>{copy.sections.contact}</legend>
      <div className="group-fields">
        <div className="field">
          <label htmlFor="group-fullName">{copy.fields.fullName}{required}</label>
          <input id="group-fullName" name="fullName" autoComplete="name" required maxLength={160}
            aria-invalid={errors.fullName || undefined} aria-describedby={errors.fullName ? "group-fullName-error" : undefined} />
          {error("fullName")}
        </div>
        <div className="field">
          <label htmlFor="group-email">{copy.fields.email}{required}</label>
          <input id="group-email" name="email" type="email" autoComplete="email" required maxLength={254}
            aria-invalid={errors.email || undefined} aria-describedby={errors.email ? "group-email-error" : undefined} />
          {error("email")}
        </div>
        <div className="field">
          <label htmlFor="group-phone">{copy.fields.phone}</label>
          <input id="group-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>{copy.sections.group}</legend>
      <div className="group-fields">
        <div className="field">
          <label htmlFor="organizationName">{copy.fields.organizationName}</label>
          <input id="organizationName" name="organizationName" autoComplete="organization" maxLength={180} />
        </div>
        <div className="field">
          <label htmlFor="groupType">{copy.fields.groupType}</label>
          <select id="groupType" name="groupType" defaultValue="">
            {copy.groupTypes.map((type, index) => <option value={type} key={type || "placeholder"} disabled={index === 0}>{type || copy.selectPlaceholder}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="estimatedGroupSize">{copy.fields.estimatedGroupSize}{required}</label>
          <input id="estimatedGroupSize" name="estimatedGroupSize" type="number" min="1" step="1" inputMode="numeric" required
            aria-invalid={errors.estimatedGroupSize || undefined} aria-describedby={errors.estimatedGroupSize ? "group-estimatedGroupSize-error" : undefined} />
          {error("estimatedGroupSize")}
        </div>
        <div className="field">
          <label htmlFor="preferredStartDate">{copy.fields.preferredStartDate}{required}</label>
          <input id="preferredStartDate" name="preferredStartDate" type="date" required
            aria-invalid={errors.preferredStartDate || undefined} aria-describedby={errors.preferredStartDate ? "group-preferredStartDate-error" : undefined} />
          {error("preferredStartDate")}
        </div>
        <div className="field">
          <label htmlFor="alternateDates">{copy.fields.alternateDates}</label>
          <input id="alternateDates" name="alternateDates" maxLength={240} />
        </div>
        <div className="field">
          <label htmlFor="approximateDuration">{copy.fields.approximateDuration}</label>
          <input id="approximateDuration" name="approximateDuration" maxLength={120} />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>{copy.sections.about}</legend>
      <div className="group-fields group-fields--textareas">
        <div className="field">
          <label htmlFor="aboutGroup">{copy.fields.aboutGroup}</label>
          <textarea id="aboutGroup" name="aboutGroup" rows={5} maxLength={2000} />
        </div>
        <div className="field">
          <label htmlFor="skillsInterests">{copy.fields.skillsInterests}</label>
          <textarea id="skillsInterests" name="skillsInterests" rows={5} maxLength={2000} />
        </div>
      </div>
    </fieldset>

    <fieldset className="group-logistics-interest">
      <legend>{copy.sections.planning}</legend>
      <div className="group-checkboxes">
        {(["lodging", "transportation", "excursions"] as const).map((item) => <label key={item}>
          <input type="checkbox" name={`discuss${item[0].toUpperCase()}${item.slice(1)}`} />
          <span>{copy.logistics[item]}</span>
        </label>)}
      </div>
      <p>{copy.logisticsNote}</p>
    </fieldset>

    <div className="group-submit-row">
      <button className="button button--primary" type="submit" disabled={busy}>{busy ? copy.busy : copy.submit}</button>
      <a className="text-link" href={content.inquiryContact.href}>{content.inquiryContact.label}<span aria-hidden="true">→</span></a>
    </div>
    <div id="group-inquiry-status" className={`group-inquiry-status ${status ? `is-${status}` : ""}`} role="status" aria-live="polite">
      {status === "invalid" ? copy.invalid : status === "unavailable" ? copy.unavailable : status === "success" ? copy.success : ""}
    </div>
  </form>;
}
