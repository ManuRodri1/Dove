import "server-only";
import type { Locale } from "@/i18n/config";
import { sponsorshipEn } from "@/i18n/messages/child-sponsorship.en";
import { sponsorshipEs } from "@/i18n/messages/child-sponsorship.es";
import { doveMedia } from "./dove-media";
import { links } from "./links";

const testimonialMedia = [
  doveMedia.sponsorship.testimonials.yarleni,
  doveMedia.sponsorship.testimonials.carlos,
  doveMedia.sponsorship.testimonials.darianny,
  doveMedia.sponsorship.testimonials.chrismason,
];

export function getChildSponsorship(locale: Locale) {
  const copy = locale === "es" ? sponsorshipEs : sponsorshipEn;
  return {
    ...copy,
    locale,
    sponsorLink: { label: copy.hero.primary, href: links.giving.childSponsorship },
    anchorLink: { label: copy.anchor.cta, href: links.giving.childSponsorship },
    processLink: { label: copy.process.cta, href: links.giving.childSponsorship },
    finalSponsorLink: { label: copy.final.primary, href: links.giving.childSponsorship },
    contactLink: { label: copy.final.secondary, href: links.email.childSponsorship },
    faqContactLink: { label: copy.faq.contact, href: links.email.childSponsorship },
    heroImage: { ...doveMedia.sponsorship.primary, alt: copy.hero.imageAlt },
    supportImage: { ...doveMedia.sponsorship.support, alt: copy.support.imageAlt },
    voices: {
      ...copy.voices,
      testimonials: copy.voices.testimonials.map((testimonial, index) => ({
        ...testimonial,
        image: {
          ...testimonialMedia[index],
          alt: locale === "es"
            ? testimonialMedia[index].alt
                .replace("smiling outside the", "sonríe frente al")
                .replace("playing basketball outdoors", "juega baloncesto al aire libre")
                .replace("with a Dove visitor in front of a classroom board", "acompaña a una visitante de Dove frente al pizarrón")
                .replace("sitting with friends in the Dove playground", "se sienta con amigos en el área de juegos de Dove")
            : testimonialMedia[index].alt,
        },
      })),
    },
  };
}

export type ChildSponsorshipContent = ReturnType<typeof getChildSponsorship>;
