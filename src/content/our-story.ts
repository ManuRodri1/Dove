import type { Locale } from "@/i18n/config";
import { doveMedia } from "./dove-media";

// Source: client-approved chronology and https://www.doveyouthdevelopment.org/about-us
// Archive images illustrate the story; placement does not assert a photograph's date.
const en = {
  seo: { title: "Our Story | Dove Youth Development", description: "Discover how Dove Youth Development grew from a vision in 2002 into a community supporting children and young people in Puerto Plata through education, relationships and skills development." },
  eyebrow: "Our story", heading: "More Than Two Decades Rooted in Puerto Plata.",
  introduction: "A vision that began in 2002 became a place to learn, build relationships and discover new possibilities. This is the story of Dove’s growing commitment to children and young people in Puerto Plata.",
  archive: "From the Dove archive · Puerto Plata", timeline: "A vision, a home, a future",
  heroAlt: "Children and adults gathered outside the Dove Missions center",
  eras: [
    { number: "01", years: "2002–2009", heading: "The Vision", narrative: "Before there was a Youth Center, there was a vision. Service trips connected people from the United States with the Dominican Republic’s North Coast. Over the following years, that connection became a lasting presence in Puerto Plata.", image: doveMedia.history.fallbackTwo, alt: "A group gathered together in a photograph from the Dove archive", milestones: [
      { date: "2002", label: "Dove plan established" }, { date: "2003", label: "First youth group sent from the U.S." },
      { date: "2004", label: "501(c)(3) status obtained in the U.S." }, { date: "2004–2007", label: "Ongoing service trips to the North Coast" },
      { date: "2008", label: "Dove’s founder moves to the Dominican Republic" }, { date: "2009", label: "First Youth Development Center opens in rented space" },
    ] },
    { number: "02", years: "2010–2016", heading: "Putting Down Roots", narrative: "Dove’s work became more firmly rooted in the community. Registration in the Dominican Republic, continued community engagement and a permanent Youth Center created a foundation for the years ahead.", image: doveMedia.history.community, alt: "Children and visitors together in an archival Dove community photograph", milestones: [
      { date: "2010", label: "Registered NGO status in the Dominican Republic" }, { date: "2010–2016", label: "Voluntourism and community engagement" }, { date: "2016", label: "New Youth Development Center purchased and remodeled" },
    ] },
    { number: "03", years: "2019–2021", heading: "Growth & Sustainability", narrative: "With a place to call home, the focus turned to growth and sustainability. Renovating the club was another step in caring for the spaces where young people could learn and connect.", image: doveMedia.history.center, alt: "The Dove center shown in an archival photograph", milestones: [
      { date: "2019–2020", label: "Focus on growth and sustainability" }, { date: "2021", label: "Club renovation" },
    ] },
    { number: "04", years: "2022 →", heading: "The Next Chapter", narrative: "As students became teenagers and prepared for adulthood, Dove saw the need for a next step. The Vocational Training Center opened a new chapter: helping young people develop skills for working life and greater independence.", image: doveMedia.vocational.development, alt: "A young person taking part in an activity at Dove", milestones: [
      { date: "2022", label: "Vocational Training Center launch" },
    ] },
  ],
  first: { eyebrow: "A place to begin · 2009", heading: "The First Youth Center Generation", text: "The first Youth Center group in 2009 included 15 boys. They became part of Dove’s early story as a vision that began in 2002 took shape in a shared space for young people.", number: "15", caption: "boys in the first Youth Center group" },
  skillsLabel: "Learning for the next step", skills: ["English as a Second Language", "Computer Skills", "Cosmetology", "Job Readiness"],
  today: { eyebrow: "Dove today", heading: "The Story Is Still Being Written.", text: "Education, skills development and vocational training are part of the same commitment: walking alongside young people as they discover what comes next. Relationships and community connect Dove’s history to the opportunities still ahead." },
  closing: { eyebrow: "Be part of what comes next", heading: "Our past built the foundation. Help shape what comes next.", description: "Continue the story with the children and young people of Puerto Plata." },
  videoPlay: "Watch video", videoConsent: "Playing this video connects to YouTube. YouTube’s privacy policy applies.", videosHeading: "Voices from Dove",
};
const es: typeof en = {
  seo: { title: "Nuestra Historia | Dove Youth Development", description: "Conoce cómo una visión que nació en 2002 se convirtió en una comunidad que acompaña a niños y jóvenes de Puerto Plata con educación, vínculos y desarrollo de habilidades." },
  eyebrow: "Nuestra historia", heading: "Más de dos décadas creciendo junto a Puerto Plata.",
  introduction: "Una visión que nació en 2002 se convirtió en un lugar para aprender, crear vínculos y descubrir nuevas posibilidades. Esta es la historia del compromiso de Dove con los niños y jóvenes de Puerto Plata.",
  archive: "Del archivo de Dove · Puerto Plata", timeline: "Una visión, un hogar, un futuro",
  heroAlt: "Niños y adultos reunidos frente al centro de Dove Missions",
  eras: [
    { number: "01", years: "2002–2009", heading: "La visión", narrative: "Antes de tener un Centro Juvenil, había una visión. Los viajes de servicio conectaron a personas de Estados Unidos con la costa norte de la República Dominicana. Con los años, ese vínculo se convirtió en una presencia duradera en Puerto Plata.", image: doveMedia.history.fallbackTwo, alt: "Un grupo reunido en una fotografía del archivo de Dove", milestones: [
      { date: "2002", label: "Se establece el plan de Dove" }, { date: "2003", label: "Llega el primer grupo de jóvenes de Estados Unidos" },
      { date: "2004", label: "Se obtiene el estatus 501(c)(3) en Estados Unidos" }, { date: "2004–2007", label: "Continúan los viajes de servicio a la costa norte" },
      { date: "2008", label: "La fundadora de Dove se muda a la República Dominicana" }, { date: "2009", label: "Abre el primer Centro de Desarrollo Juvenil en un local alquilado" },
    ] },
    { number: "02", years: "2010–2016", heading: "Echando raíces", narrative: "El trabajo de Dove se afianzó en la comunidad. El registro en la República Dominicana, la participación comunitaria y un Centro Juvenil propio sentaron las bases para seguir creciendo.", image: doveMedia.history.community, alt: "Niños y visitantes juntos en una fotografía del archivo comunitario de Dove", milestones: [
      { date: "2010", label: "Registro como ONG en la República Dominicana" }, { date: "2010–2016", label: "Turismo de voluntariado y participación comunitaria" }, { date: "2016", label: "Compra y remodelación del nuevo Centro de Desarrollo Juvenil" },
    ] },
    { number: "03", years: "2019–2021", heading: "Crecimiento y sostenibilidad", narrative: "Con un espacio propio, Dove puso la mirada en el crecimiento y la sostenibilidad. La renovación del club fue un paso más para cuidar los espacios donde los jóvenes aprenden y comparten.", image: doveMedia.history.center, alt: "El centro de Dove en una fotografía de archivo", milestones: [
      { date: "2019–2020", label: "Enfoque en el crecimiento y la sostenibilidad" }, { date: "2021", label: "Renovación del club" },
    ] },
    { number: "04", years: "2022 →", heading: "El próximo capítulo", narrative: "A medida que los estudiantes llegaban a la adolescencia y se preparaban para la vida adulta, Dove identificó la necesidad de acompañarlos en esa nueva etapa. El Centro de Formación Vocacional abrió un nuevo capítulo: desarrollar habilidades para el trabajo y una mayor independencia.", image: doveMedia.vocational.development, alt: "Un joven participa en una actividad de Dove", milestones: [
      { date: "2022", label: "Apertura del Centro de Formación Vocacional" },
    ] },
  ],
  first: { eyebrow: "Un lugar para comenzar · 2009", heading: "La primera generación del Centro Juvenil", text: "El primer grupo del Centro Juvenil, en 2009, estaba formado por 15 niños. Ellos fueron parte de los primeros pasos de Dove, cuando la visión que había nacido en 2002 tomó forma en un espacio compartido para los jóvenes.", number: "15", caption: "niños en el primer grupo del Centro Juvenil" },
  skillsLabel: "Aprender para seguir adelante", skills: ["Inglés como segundo idioma", "Informática", "Cosmetología", "Preparación laboral"],
  today: { eyebrow: "Dove hoy", heading: "La historia se sigue escribiendo.", text: "La educación, el desarrollo de habilidades y la formación vocacional son parte de un mismo compromiso: acompañar a los jóvenes mientras descubren sus próximos pasos. Los vínculos y la comunidad conectan la historia de Dove con las oportunidades que aún están por venir." },
  closing: { eyebrow: "Sé parte de lo que viene", heading: "Nuestra historia sentó las bases. Ayúdanos a construir lo que viene.", description: "Sigue escribiendo esta historia junto a los niños y jóvenes de Puerto Plata." },
  videoPlay: "Ver video", videoConsent: "Al reproducir este video te conectas a YouTube. Se aplica su política de privacidad.", videosHeading: "Voces de Dove",
};
// TODO: CLIENT CONFIRM CURRENT IMPACT NUMBERS. Do not publish the legacy counts as current.
export function getOurStory(locale: Locale) { return locale === "es" ? es : en; }
export type OurStoryContent = typeof en;
export type StoryVideoData = { youtubeId: string; title: string; caption: string; locale: Locale; verified: boolean };
// TODO: CLIENT VERIFY VIDEO OWNERSHIP AND CONTENT RELEVANCE
export const ourStoryVideos: StoryVideoData[] = [];
