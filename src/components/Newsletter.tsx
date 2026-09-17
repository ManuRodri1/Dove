"use client";
import { useState, type FormEvent } from "react";
import type { HomeContent } from "@/content/home";
import { submitNewsletter } from "@/lib/newsletter";

export default function Newsletter({ home }: { home: Pick<HomeContent, "newsletter" | "locale"> }) {
  const copy = home.newsletter;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const result = await submitNewsletter({ email, locale: home.locale });
      setMessage(result.status === "invalid" ? copy.invalid : copy.unavailable);
    } catch { setMessage(copy.unavailable); }
    finally { setBusy(false); }
  }
  return <section className="newsletter section" aria-labelledby="newsletter-heading">
    <div className="container newsletter-inner">
      <div><h2 id="newsletter-heading">{copy.heading}</h2><p>{copy.description}</p></div>
      <form onSubmit={submit} aria-describedby="newsletter-notice newsletter-status">
        <label htmlFor="newsletter-email">{copy.email}</label>
        <input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        <button className="button button--teal" type="submit" disabled={busy}>{busy ? copy.busy : copy.submit}</button>
        <p id="newsletter-notice" className="newsletter-note">{copy.notice}</p>
        <p id="newsletter-status" role="status" aria-live="polite">{message}</p>
      </form>
    </div>
  </section>;
}
