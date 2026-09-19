import type { HomeContent } from "@/content/home";
import { getStoriesCopy } from "@/content/stories-ui";
import { Action } from "@/components/ui";

export default function StoriesSupportCTA({ home }: { home: HomeContent }) {
  const copy = getStoriesCopy(home.locale).index;

  return (
    <section className="stories-support" aria-labelledby="stories-support-heading">
      <div className="container stories-support-inner">
        <div>
          <p className="eyebrow">{copy.ctaEyebrow}</p>
          <h2 id="stories-support-heading">{copy.ctaTitle}</h2>
        </div>
        <div className="stories-support-actions">
          <Action link={home.actions.donate} />
          <Action link={home.actions.sponsor} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
