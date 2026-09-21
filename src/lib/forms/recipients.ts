import { links } from "@/content/links";
import type { FormType } from "./types";

const emailAddress = (mailto: string) => mailto.replace(/^mailto:/, "");

export const FORM_RECIPIENTS = {
  contact: emailAddress(links.email.executiveDirector),
  volunteer: emailAddress(links.email.volunteer),
  travel: emailAddress(links.email.groupTravel),
  partnership: emailAddress(links.email.partnerships),
  childSponsorship: emailAddress(links.email.childSponsorship),
} as const;

export function recipientForSubmission(formType: FormType, reason?: string) {
  if (formType === "contact" && reason === "sponsorship") return FORM_RECIPIENTS.childSponsorship;
  return FORM_RECIPIENTS[formType];
}
