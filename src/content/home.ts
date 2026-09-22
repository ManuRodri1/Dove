import "server-only";
import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import type { Locale } from "@/i18n/config";
import type { DoveImage } from "./dove-media";
import { links } from "./links";
export type Destination = { label: string; href: string };
export type Campaign = { title: string; category: string; image: DoveImage; description: string; route: string; goal?: number; raised?: number; progress?: number; status: "development" | "active" | "completed"; verified: boolean };
export const isDevelopment = process.env.NODE_ENV === "development";
// TODO: CLIENT CONFIRM CURRENT CAMPAIGN
export const featuredCampaign: Campaign | null = null;
export function getHome(locale: Locale) {
  const copy = locale === "es" ? es : en;
  const about = [links.ourStory(locale), links.ourTeam(locale), links.contact(locale)];
  const whatWeDo = [links.whatWeDo(locale), links.vocationalTraining(locale)];
  const destinations = [links.ourStory(locale), links.whatWeDo(locale), links.childSponsorship(locale), links.ourImpact(locale), links.stories(locale), links.campaigns(locale)];
  const support = [links.giving.general, links.giving.vocationalTraining, links.giving.general, links.partnerships(locale)];
  const experience = [links.volunteer.page(locale), links.travel.page(locale), links.partnerships(locale)];
  const footer = [links.giving.childSponsorship, links.giving.vocationalTraining, links.partnerships(locale), links.travel.page(locale), links.volunteer.page(locale)];
  return {
    ...copy, locale,
    navigation: copy.navigation.map((item, i) => ({
      ...item,
      href: destinations[i],
      children: i === 0 ? copy.aboutNavigation.map((child, childIndex) => ({ ...child, href: about[childIndex] }))
        : i === 1 ? copy.whatWeDoNavigation.map((child, childIndex) => ({ ...child, href: whatWeDo[childIndex] }))
        : i === 2 ? copy.getInvolvedNavigation.map((child, childIndex) => ({
          ...child,
          href: [links.childSponsorship(locale), links.volunteer.page(locale), links.travel.page(locale), links.partnerships(locale)][childIndex],
        }))
        : i === 3 ? copy.impactNavigation.map((child) => ({ ...child, href: links.ourImpact(locale) }))
        : undefined,
    })),
    actions: { sponsor: { ...copy.actions.sponsor, href: links.giving.childSponsorship }, donate: { ...copy.actions.donate, href: links.giving.general }, story: { ...copy.actions.story, href: links.ourStory(locale) } },
    history: { ...copy.history, link: { ...copy.history.link, href: links.ourStory(locale) } },
    support: { ...copy.support, options: copy.support.options.map((item, i) => ({ ...item, href: support[i] })) },
    experience: { ...copy.experience, items: copy.experience.items.map((item, i) => ({ ...item, link: { ...item.link, href: experience[i] } })) },
    partnership: { ...copy.partnership, link: { ...copy.partnership.link, href: links.partnerships(locale) } },
    footer: { ...copy.footer, contact: { ...copy.footer.contact, href: links.contact(locale) }, privacy: { ...copy.footer.privacy, href: links.privacy(locale) }, terms: { ...copy.footer.terms, href: links.terms(locale) }, support: copy.footer.support.map((item, i) => ({ ...item, href: footer[i] })) },
  };
}
export type HomeContent = ReturnType<typeof getHome>;
