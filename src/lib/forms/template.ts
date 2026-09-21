import "server-only";

import type { FormSubmission } from "./types";

const labels = { contact: "Contact Message", volunteer: "Volunteer Application", travel: "Travel Inquiry", partnership: "Partnership Inquiry" } as const;
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

export function formNotification(submission: FormSubmission, submittedAt: string) {
  const fields = [
    ["Form type", labels[submission.formType]], ["Name", submission.name], ["Email", submission.email],
    ["Phone", submission.phone], ["Organization", submission.organization], ["Reason", submission.reason],
    ["Message", submission.message], ["Locale", submission.locale], ["Submission timestamp", submittedAt],
  ].filter(([, value]) => value);
  const textContent = fields.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const htmlContent = `<h2>Dove Website — ${labels[submission.formType]}</h2><table>${fields.map(([label, value]) => `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value!)}</td></tr>`).join("")}</table>`;
  return { subject: `[Dove Website] New ${labels[submission.formType]}`, textContent, htmlContent };
}
