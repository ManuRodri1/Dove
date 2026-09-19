import { doveMedia } from "@/content/dove-media";
import type { en } from "./en";
/** Editorial Spanish; stored copy, never runtime machine translation. */
export const es: typeof en = {
  ui: { skip: "Saltar al contenido", home: "Inicio", mainNav: "Navegación principal", mobileNav: "Navegación móvil", footerNav: "Navegación del pie de página", supportNav: "Formas de apoyar a Dove", openMenu: "Abrir menú de navegación", closeMenu: "Cerrar menú de navegación", unpublished: "Aún no publicado", readStory: "Leer historia", play: "Reproducir video", pause: "Pausar video" },
  newsletter: { heading: "Mantente conectado con Dove", description: "Historias, novedades y formas de generar un impacto, directamente desde Puerto Plata.", email: "Correo electrónico", submit: "Únete a la comunidad de Dove", busy: "Enviando…", unavailable: "La suscripción en línea aún no está disponible. Inténtalo más adelante. No hemos guardado tu correo.", invalid: "Escribe una dirección de correo válida.", notice: "Pronto podrás suscribirte a nuestro boletín." },
  seo: { title: "Dove Youth Development | Creando futuros en Puerto Plata", description: "Acompañamos a niños y jóvenes de Puerto Plata con educación, desarrollo de habilidades, formación vocacional y oportunidades para crecer en comunidad." },
  navigation: [{ label: "Nosotros", href: "" }, { label: "Qué hacemos", href: "" }, { label: "Participa", href: "" }, { label: "Nuestro impacto", href: "" }, { label: "Campañas", href: "" }],
  getInvolvedNavigation: [
    { label: "Voluntariado", href: "" },
    { label: "Viaja con propósito", href: "" },
    { label: "Alianzas corporativas y comunitarias", href: "" },
  ],
  actions: { sponsor: { label: "Apadrina a un niño", href: "" }, donate: { label: "Dona", href: "" }, story: { label: "Conoce nuestra historia", href: "" } },
  language: { english: "English", spanish: "Español", current: "EN", alternate: "ES" },
  hero: { location: "Puerto Plata, República Dominicana", heading: "Creando futuros que de otra manera no serían posibles.", description: "Desde hace más de 20 años, Dove Youth Development crea oportunidades para niños y jóvenes de Puerto Plata a través de la educación, los vínculos, el desarrollo de habilidades y la vida en comunidad.", play: "Reproducir video de fondo", pause: "Pausar video de fondo", unavailable: "El video de fondo no está disponible. Se muestra una imagen." },
  history: { eyebrow: "Nuestras raíces · Una visión que nació en 2002", heading: "Una visión que abrió nuevas posibilidades", description: "La visión de Dove nació en 2002. El primer Centro Juvenil abrió en 2009 con un grupo de 15 niños. Con el tiempo, ese esfuerzo inicial se convirtió en una comunidad que acompaña a los jóvenes con educación, vínculos, habilidades y oportunidades.", caption: "Puerto Plata, República Dominicana", longevity: "Más de 20 años de trayectoria", link: { label: "Nuestra historia", href: "" } },
  pathway: { eyebrow: "El camino con Dove", heading: "De la niñez a la independencia", description: "En Dove, acompañamos el desarrollo de cada joven a lo largo del tiempo. Nuestro camino conecta un espacio seguro para aprender con la educación, las habilidades y las oportunidades para construir un futuro más independiente.", note: "Cada joven recorre su propio camino.", steps: [
    { title: "Un lugar seguro", description: "Una comunidad acogedora donde niños y jóvenes se sienten parte de algo.", theme: "Pertenencia" },
    { title: "Educación", description: "Aprendizaje y apoyo educativo para construir una base sólida.", theme: "Bases para crecer" },
    { title: "Inglés e informática", description: "Habilidades de idioma y tecnología que abren nuevas posibilidades.", theme: "Nuevas habilidades" },
    { title: "Preparación laboral", description: "Herramientas para dar los primeros pasos hacia el mundo del trabajo.", theme: "Preparación" },
    { title: "Formación vocacional", description: "Aprendizaje práctico que conecta las habilidades con las oportunidades.", theme: "Aprender haciendo" },
    { title: "Empleo y emprendimiento", description: "Caminos hacia el empleo y la creación de un negocio propio.", theme: "Oportunidades" },
    { title: "Un futuro sostenible", description: "Más independencia y la posibilidad de contribuir a la comunidad.", theme: "Mirando al futuro" },
  ] },
  support: { eyebrow: "Impacto directo", heading: "Lo que tu apoyo hace posible", description: "Ayuda a crear oportunidades a través de la educación, el desarrollo de habilidades y una comunidad que acompaña a los jóvenes de Puerto Plata.", label: "Apoyo mensual", headingSponsor: "Apadrina a un niño", price: "$50", period: "/ mes", sponsorCopy: "Forma parte del camino de un niño con Dove. El apadrinamiento mensual contribuye a crear oportunidades para niños y jóvenes de Puerto Plata.", options: [
    { title: "Apoya la educación", description: "Contribuye a sostener oportunidades educativas para niños y jóvenes.", label: "Aporta a la educación", href: "", icon: "education" },
    { title: "Apoya la formación vocacional", description: "Impulsa las habilidades prácticas y el Centro de Formación Vocacional de Dove.", label: "Apoya la formación", href: "", icon: "tools" },
    { title: "Apoya un programa", description: "Contribuye al trabajo de Dove en educación, desarrollo juvenil y comunidad.", label: "Apoya nuestros programas", href: "", icon: "program" },
    { title: "Conviértete en aliado estratégico", description: "Descubre cómo tu organización puede ayudar a crear oportunidades duraderas.", label: "Crea una alianza con Dove", href: "", icon: "partner" },
  ] },
  impact: { eyebrow: "Una presencia que perdura", heading: "Con raíces en Puerto Plata", description: "Más de dos décadas construyendo vínculos, comunidad y posibilidades.", metrics: [{ value: "140–160", label: "Niños y jóvenes acompañados" }, { value: "6–18", label: "Edades atendidas" }, { value: "7", label: "Barrios de Puerto Plata" }, { value: "20+", label: "Años de compromiso" }] },
  experience: { eyebrow: "Vive Dove", heading: "No solo visites Puerto Plata. Forma parte de ella.", description: "Acércate a las personas y al trabajo de Dove a través de un intercambio cultural con propósito.", items: [
    { title: "Voluntariado", description: "Comparte tu tiempo y tus habilidades junto a la comunidad de Dove en Puerto Plata.", link: { label: "Conoce el voluntariado", href: "" }, image: { ...doveMedia.volunteer.primary, alt: "Una voluntaria participa en actividades educativas de Dove" } },
    { title: "Viaja con propósito", description: "Descubre una forma más cercana de conocer Puerto Plata con una experiencia grupal en Dove.", link: { label: "Planifica tu viaje", href: "" }, image: { ...doveMedia.travel.primary, alt: "Un encuentro entre una visitante y un niño de la comunidad de Dove" } },
    { title: "Alianzas empresariales y comunitarias", description: "Conecta a las personas, las ideas y el compromiso de tu organización con el trabajo de Dove.", link: { label: "Explora las alianzas", href: "" }, image: null },
  ] },
  partnership: { eyebrow: "Alianzas institucionales", heading: "Crea una alianza con Dove", description: "Queremos conversar con empresas, fundaciones e instituciones educativas que compartan nuestro compromiso con los jóvenes de Puerto Plata.", link: { label: "Conversemos", href: "" } },
  stories: { eyebrow: "Historias y noticias", heading: "Historias de la comunidad Dove", introduction: "Noticias, logros y momentos cotidianos desde Puerto Plata.", link: { label: "Ver todas las historias", href: "" }, pending: "Vista de desarrollo · Historia pendiente de migración", mediaPending: "Fotografía verificada pendiente" },
  final: { eyebrow: "Deja una huella duradera", heading: "Cada niño merece la oportunidad de imaginar un futuro con más posibilidades.", description: "Tu apoyo ayuda a hacer posible ese futuro." },
  footer: { mission: "Una comunidad de esperanza y oportunidades para niños y jóvenes, a través de la educación, los vínculos y el desarrollo de habilidades en Puerto Plata, República Dominicana.", navigationLabel: "Navegación", supportLabel: "Apóyanos", locationLabel: "Nuestra comunidad", location: "Puerto Plata", country: "República Dominicana", copyright: "Dove Youth Development. Todos los derechos reservados.", contact: { label: "Contacto", href: "" }, privacy: { label: "Política de privacidad", href: "" }, support: [
    { label: "Apadrina a un niño ($50/mes)", href: "" }, { label: "Formación vocacional", href: "" }, { label: "Alianzas empresariales", href: "" }, { label: "Viaja con propósito", href: "" }, { label: "Voluntariado", href: "" },
  ] },
};
