import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { deliverStoredFormSubmission, type SubmissionStore } from "../src/lib/forms/delivery";
import { FORM_RECIPIENTS, recipientForSubmission } from "../src/lib/forms/recipients";
import type { FormSubmission } from "../src/lib/forms/types";
import { validateContactInquiry } from "../src/lib/contact-inquiry";

const submission: FormSubmission = { formType: "contact", name: "Ada Lovelace", email: "ada@example.test", phone: "+1 555 0100", reason: "general", message: "Hello Dove", locale: "en", payload: {} };

function store(events: string[]): SubmissionStore {
  return {
    async insert(value) { events.push(`insert:${value.status}`); return { id: "submission-1" }; },
    async update(_id, status, details) { events.push(`update:${status}:${details?.providerMessageId ?? details?.error ?? ""}`); },
  };
}

test("resolves only verified form recipients", () => {
  assert.equal(recipientForSubmission("contact", "general"), FORM_RECIPIENTS.contact);
  assert.equal(recipientForSubmission("contact", "sponsorship"), FORM_RECIPIENTS.childSponsorship);
  assert.equal(recipientForSubmission("volunteer"), FORM_RECIPIENTS.volunteer);
  assert.equal(recipientForSubmission("travel"), FORM_RECIPIENTS.travel);
  assert.equal(recipientForSubmission("partnership"), FORM_RECIPIENTS.partnership);
});

test("rejects an invalid contact payload before delivery", () => {
  const errors = validateContactInquiry({ firstName: "", lastName: "", email: "not-an-email", phone: "", reason: "general", message: "", locale: "en" });
  assert.deepEqual(errors, { firstName: true, lastName: true, email: true, message: true });
});

test("persists before Brevo delivery and uses visitor email only as Reply-To", async () => {
  const events: string[] = []; let replyTo = "";
  const result = await deliverStoredFormSubmission(submission, { store: store(events), provider: { async send(email) { replyTo = email.replyTo; return { messageId: "brevo-123" }; } } });
  assert.deepEqual(result, { status: "delivered" });
  assert.equal(replyTo, submission.email);
  assert.deepEqual(events, ["insert:received", "update:delivered:brevo-123"]);
});

test("preserves a submission and records delivery_failed when Brevo fails", async () => {
  const events: string[] = [];
  const result = await deliverStoredFormSubmission(submission, { store: store(events), provider: { async send() { throw new Error("provider unavailable"); } } });
  assert.deepEqual(result, { status: "delivery_failed" });
  assert.deepEqual(events, ["insert:received", "update:delivery_failed:provider unavailable"]);
});

test("honeypot submissions are retained as spam and never delivered", async () => {
  const events: string[] = [];
  const result = await deliverStoredFormSubmission(submission, { honeypot: "bot value", store: store(events), provider: { async send() { throw new Error("must not send"); } } });
  assert.deepEqual(result, { status: "spam" });
  assert.deepEqual(events, ["insert:spam"]);
});

test("migration keeps submissions private while permitting only admins to inspect", () => {
  const sql = readFileSync("supabase/migrations/20260922142632_create_dove_form_submissions.sql", "utf8");
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
  assert.match(sql, /REVOKE ALL ON TABLE dove\.form_submissions FROM anon, authenticated/);
  assert.match(sql, /GRANT ALL ON TABLE dove\.form_submissions TO service_role/);
  assert.match(sql, /FOR SELECT TO authenticated\s+USING \(dove\.is_admin\(\)\)/);
});

test("form implementation does not expose Brevo or service-role keys to browser code", () => {
  const clientSources = ["src/components/ContactForm.tsx", "src/components/VolunteerApplicationForm.tsx", "src/components/GroupExperienceInquiryForm.tsx", "src/components/PartnershipInquiryForm.tsx"];
  for (const path of clientSources) assert.doesNotMatch(readFileSync(path, "utf8"), /BREVO_API_KEY|SUPABASE_SERVICE_ROLE_KEY/);
});
