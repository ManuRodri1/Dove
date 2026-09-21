import type { Locale } from "@/i18n/config";

const copy = {
  en: {
    seo: { title: "Campaigns | Dove Youth Development", description: "Explore current, upcoming, and past Dove Youth Development campaigns in Puerto Plata." },
    eyebrow: "Campaigns", heading: "When a specific need calls for collective action.",
    intro: "Dove campaigns bring our community together around particular moments, goals, events, and needs.",
    current: "Current campaigns", upcoming: "Upcoming campaigns", past: "Past campaigns",
    empty: "No active campaign right now — but there are always ways to support Dove.",
    donate: "Donate", sponsor: "Sponsor a Child", view: "View campaign", viewAll: "View all past campaigns",
    supportDove: "Support Dove", exploreCampaigns: "Explore Current Campaigns",
    updates: "Campaign updates", back: "All campaigns", goal: "Campaign goal", raised: "Raised", updated: "Updated",
    states: { active: "Active campaign", upcoming: "Upcoming campaign", ended: "Past campaign" },
  },
  es: {
    seo: { title: "Campañas | Dove Youth Development", description: "Conoce las campañas actuales, próximas e históricas de Dove Youth Development en Puerto Plata." },
    eyebrow: "Campañas", heading: "Cuando una necesidad concreta requiere una acción colectiva.",
    intro: "Las campañas de Dove reúnen a nuestra comunidad en torno a momentos, metas, eventos y necesidades específicas.",
    current: "Campañas actuales", upcoming: "Próximas campañas", past: "Campañas anteriores",
    empty: "No hay una campaña activa en este momento, pero siempre hay formas de apoyar a Dove.",
    donate: "Dona", sponsor: "Apadrina a un niño", view: "Ver campaña", viewAll: "Ver todas las campañas anteriores",
    supportDove: "Apoyar a Dove", exploreCampaigns: "Ver campañas actuales",
    updates: "Actualizaciones de la campaña", back: "Todas las campañas", goal: "Meta de la campaña", raised: "Recaudado", updated: "Actualizado",
    states: { active: "Campaña activa", upcoming: "Próxima campaña", ended: "Campaña anterior" },
  },
} as const;

export function getCampaignsCopy(locale: Locale) { return copy[locale]; }
