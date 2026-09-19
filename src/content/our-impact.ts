import type { Locale } from "@/i18n/config";
import { doveMedia, type DoveImage } from "./dove-media";
import { links } from "./links";

export type MetricItem = {
  value: string;
  label: string;
  context: string;
  sourceNote: string;
};

export type HistoricalSnapshot = {
  value: string;
  label: string;
  period: string;
  sourceNote: string;
};

export type PathwayStage = {
  number: string;
  title: string;
  description: string;
};

export type StoryFeature = {
  tag: string;
  title: string;
  narrative: string;
  linkText: string;
  linkHref: string;
  image: DoveImage;
  alt: string;
};

export type ProgramOutcome = {
  title: string;
  enables: string;
};

const en = {
  seo: {
    title: "Our Impact | Dove Youth Development",
    description:
      "See how Dove Youth Development supports children and young people in Puerto Plata through education, skills, vocational preparation, and community.",
  },
  hero: {
    eyebrow: "Our Impact",
    heading: "Opportunity becomes impact when it has room to grow.",
    description:
      "Dove walks alongside children and young people in Puerto Plata with education, skills, relationships, and a safe place to keep imagining what comes next.",
    primaryCta: { label: "Explore Stories", href: "/en/stories" },
    secondaryCta: { label: "Support the Work", href: links.giving.general },
    image: doveMedia.whatWeDo.hero,
    caption: "Children and young people participating in Dove Youth Development programs in Puerto Plata.",
  },
  impactGlance: {
    eyebrow: "Impact at a glance",
    heading: "Current Program Scale",
    metrics: [
      {
        value: "140–160",
        label: "children and young people served",
        context: "Current active program participant range across daily activities and educational support.",
        sourceNote: "Dove About documentation (2024–2026)",
      },
      {
        value: "Ages 6–18",
        label: "program population",
        context: "Comprehensive development programs spanning primary school through high school completion.",
        sourceNote: "Dove youth center program scope",
      },
      {
        value: "7 barrios",
        label: "Puerto Plata neighborhoods",
        context: "Community outreach connecting families across seven distinct local neighborhoods.",
        sourceNote: "Dove community registry",
      },
      {
        value: "20+ years",
        label: "years of commitment",
        context: "More than two decades of building opportunity with young people and families since 2002.",
        sourceNote: "Dove institutional timeline (2002–2026)",
      },
    ] satisfies MetricItem[],
    footerNote: "Current program scale and organizational history based on Dove's published information.",
  },
  pathway: {
    eyebrow: "THE DOVE PATHWAY",
    heading: "Impact is a journey, not a single moment.",
    description:
      "Every young person's path is different. The Dove Pathway illustrates how programs can connect across stages of growth rather than prescribing one linear experience.",
    stages: [
      {
        number: "01",
        title: "Safe Place",
        description: "A welcoming, supportive environment where children feel protected, valued, and encouraged.",
      },
      {
        number: "02",
        title: "Education",
        description: "Academic reinforcement, school supplies, uniforms, and essential foundations for learning.",
      },
      {
        number: "03",
        title: "English + Computer Skills",
        description: "Practical communication and digital literacy that expand future personal and career horizons.",
      },
      {
        number: "04",
        title: "Job Readiness",
        description: "Preparation for applications, interview skills, workplace expectations, and professional confidence.",
      },
      {
        number: "05",
        title: "Vocational Training",
        description: "Hands-on technical skills training designed for direct workforce entry or trade development.",
      },
      {
        number: "06",
        title: "Employment / Entrepreneurship",
        description: "Connecting to local employer roles, small business creation, or pursuing higher education.",
      },
      {
        number: "07",
        title: "A Sustainable Future",
        description: "Achieving long-term independence and contributing actively to families and community life.",
      },
    ] satisfies PathwayStage[],
  },
  featureStory1: {
    tag: "STORY OF CHANGE · 2022",
    title: "From growing with Dove to stepping into the workforce",
    narrative:
      "In 2022, Dove celebrated Jodelka and Elian among the first young people to progress through its programs from primary school through high school. Both later secured full-time work at Amber Cove in Puerto Plata, bringing with them English skills, confidence, and years of learning and support.",
    linkText: "Read full story",
    linkHref: "/en/stories/thankful-for-you",
    image: doveMedia.vocational.primary,
    alt: "Young people working together at Dove Youth Development in Puerto Plata",
  } satisfies StoryFeature,
  historicalSnapshots: {
    eyebrow: "HISTORICAL SNAPSHOTS",
    heading: "Moments we can point to",
    description:
      "Documented snapshots from specific program reports and partner initiatives throughout Dove’s history.",
    snapshots: [
      {
        value: "400+",
        label: "Students reached over the prior decade",
        period: "Reported by Dove in 2022",
        sourceNote: "Dove 20th Anniversary Service Report (2022)",
      },
      {
        value: "130",
        label: "Children supported in returning to school",
        period: "2022 back-to-school initiative",
        sourceNote: "Dove Back to School Initiative (2022)",
      },
      {
        value: "150",
        label: "Students received health screenings",
        period: "2023 partner outreach",
        sourceNote: "Nursing College Global Outreach Partnership (2023)",
      },
    ] satisfies HistoricalSnapshot[],
  },
  featureStory2: {
    tag: "ALUMNI & ENTREPRENEURSHIP",
    title: "Creating her own opportunity",
    narrative:
      "After years connected to Dove, Leonela Peña turned her skills and initiative into Lela Surprises, a small business she started while working toward university and helping support her family.",
    linkText: "Read full story",
    linkHref: "/en/stories/this-month-s-shoutout",
    image: doveMedia.vocational.development,
    alt: "A young person taking part in vocational training at Dove Youth Development",
  } satisfies StoryFeature,
  programBridge: {
    eyebrow: "PRACTICAL FOUNDATIONS",
    heading: "How impact takes shape day by day",
    description: "Connecting support directly to practical outcomes across our five core program areas.",
    outcomes: [
      {
        title: "Education",
        enables: "Consistency, learning support, and stronger foundations for school completion.",
      },
      {
        title: "English + Computer Skills",
        enables: "Practical skills that expand communication and future employment opportunities.",
      },
      {
        title: "Job Readiness",
        enables: "Preparation for job applications, workplace expectations, and professional confidence.",
      },
      {
        title: "Vocational Training",
        enables: "Hands-on skills for sustainable employment, entrepreneurship, or continued education.",
      },
      {
        title: "Family & Community Support",
        enables: "Relational and practical support that helps young people stay connected to learning.",
      },
    ] satisfies ProgramOutcome[],
  },
  storiesBridge: {
    eyebrow: "DEEPER CONTEXT",
    heading: "See the story behind the numbers.",
    description:
      "Numbers provide scale, but human stories show what that scale means in daily life. Explore published articles, program updates, and community news.",
    primaryCta: { label: "Read Stories & News", href: "/en/stories" },
    secondaryCta: { label: "Our Story & Timeline", href: "/en/our-story" },
  },
  finalCta: {
    heading: "Help create room for what comes next.",
    description:
      "Your support helps Dove continue providing education, skills, community, and opportunity for young people in Puerto Plata.",
    primaryAction: { label: "Donate", href: links.giving.general },
    secondaryAction: { label: "Sponsor a Child", href: links.giving.childSponsorship },
  },
};

const es: typeof en = {
  seo: {
    title: "Nuestro Impacto | Dove Youth Development",
    description:
      "Conoce cómo Dove Youth Development acompaña a niños y jóvenes de Puerto Plata a través de educación, habilidades, preparación vocacional y comunidad.",
  },
  hero: {
    eyebrow: "Nuestro Impacto",
    heading: "La oportunidad se convierte en impacto cuando tiene espacio para crecer.",
    description:
      "Dove acompaña a niños y jóvenes de Puerto Plata con educación, habilidades, relaciones y un espacio seguro donde seguir imaginando lo que viene después.",
    primaryCta: { label: "Conoce sus historias", href: "/es/stories" },
    secondaryCta: { label: "Apoya nuestro trabajo", href: links.giving.general },
    image: doveMedia.whatWeDo.hero,
    caption: "Niños y jóvenes participando en los programas de Dove Youth Development en Puerto Plata.",
  },
  impactGlance: {
    eyebrow: "Impacto en cifras",
    heading: "Escala actual del programa",
    metrics: [
      {
        value: "140–160",
        label: "niños y jóvenes atendidos",
        context: "Rango activo de participantes en actividades diarias y apoyo educativo.",
        sourceNote: "Documentación oficial de Dove (2024–2026)",
      },
      {
        value: "6 a 18 años",
        label: "población del programa",
        context: "Programas de desarrollo integral desde la escuela primaria hasta completar la secundaria.",
        sourceNote: "Alcance del Centro Juvenil de Dove",
      },
      {
        value: "7 barrios",
        label: "barrios de Puerto Plata",
        context: "Presencia comunitaria que conecta a familias en siete barrios locales.",
        sourceNote: "Registro comunitario de Dove",
      },
      {
        value: "20+ años",
        label: "años de compromiso",
        context: "Más de dos décadas creando oportunidades con jóvenes y familias desde 2002.",
        sourceNote: "Cronología institucional de Dove (2002–2026)",
      },
    ],
    footerNote: "Escala actual del programa e historia organizacional según la información publicada por Dove.",
  },
  pathway: {
    eyebrow: "EL CAMINO DE DOVE",
    heading: "El impacto es un camino, no un solo momento.",
    description:
      "El camino de cada joven es diferente. El Camino de Dove ilustra cómo los programas se conectan a lo largo de las etapas de crecimiento, sin prescribir una experiencia lineal única.",
    stages: [
      {
        number: "01",
        title: "Espacio Seguro",
        description: "Un entorno acogedor y seguro donde los niños se sienten protegidos, valorados y motivados.",
      },
      {
        number: "02",
        title: "Educación",
        description: "Refuerzo académico, útiles escolares, uniformes y bases sólidas para el aprendizaje.",
      },
      {
        number: "03",
        title: "Inglés y Computación",
        description: "Comunicación práctica y alfabetización digital para ampliar horizontes personales y laborales.",
      },
      {
        number: "04",
        title: "Preparación Laboral",
        description: "Preparación para solicitudes de empleo, entrevistas, expectativas del lugar de trabajo y confianza.",
      },
      {
        number: "05",
        title: "Formación Vocacional",
        description: "Capacitación práctica en habilidades técnicas orientadas a la inserción laboral directa.",
      },
      {
        number: "06",
        title: "Empleo o Emprendimiento",
        description: "Conexión con empleos en empresas locales, creación de pequeños negocios o estudios superiores.",
      },
      {
        number: "07",
        title: "Un Futuro Sostenible",
        description: "Alcanzar la independencia a largo plazo y contribuir activamente con sus familias y comunidad.",
      },
    ],
  },
  featureStory1: {
    tag: "HISTORIA DE CAMBIO · 2022",
    title: "De crecer junto a Dove a dar el paso al mundo laboral",
    narrative:
      "En 2022, Dove celebró a Jodelka y Elian entre los primeros jóvenes que recorrieron sus programas desde la escuela primaria hasta completar la secundaria. Ambos posteriormente consiguieron empleos de tiempo completo en Amber Cove, en Puerto Plata, llevando consigo sus conocimientos de inglés, confianza y años de aprendizaje y acompañamiento.",
    linkText: "Leer historia completa",
    linkHref: "/es/stories/thankful-for-you",
    image: doveMedia.vocational.primary,
    alt: "Jóvenes trabajando juntos en Dove Youth Development en Puerto Plata",
  },
  historicalSnapshots: {
    eyebrow: "MOMENTOS DESTACADOS",
    heading: "Momentos que podemos señalar",
    description:
      "Cifras documentadas provenientes de informes de programas e iniciativas colaborativas específicas en la historia de Dove.",
    snapshots: [
      {
        value: "400+",
        label: "Estudiantes alcanzados durante la década anterior",
        period: "Cifra reportada por Dove en 2022",
        sourceNote: "Informe del 20 aniversario de Dove (2022)",
      },
      {
        value: "130",
        label: "Niños apoyados en su regreso a clases",
        period: "Iniciativa escolar de 2022",
        sourceNote: "Iniciativa de regreso a clases de Dove (2022)",
      },
      {
        value: "150",
        label: "Estudiantes recibieron evaluaciones de salud",
        period: "Colaboración de 2023",
        sourceNote: "Alianza de salud universitaria (2023)",
      },
    ],
  },
  featureStory2: {
    tag: "EGRESADOS Y EMPRENDIMIENTO",
    title: "Creando su propia oportunidad",
    narrative:
      "Después de años vinculada a Dove, Leonela Peña convirtió sus habilidades e iniciativa en Lela Surprises, un pequeño negocio que inició mientras avanzaba en sus estudios universitarios y contribuía con su familia.",
    linkText: "Leer historia completa",
    linkHref: "/es/stories/this-month-s-shoutout",
    image: doveMedia.vocational.development,
    alt: "Un joven participando en talleres de formación en Dove Youth Development",
  },
  programBridge: {
    eyebrow: "BASES PRÁCTICAS",
    heading: "Cómo toma forma el impacto día a día",
    description: "Conectando el apoyo directamente con resultados prácticos en nuestras cinco áreas clave de desarrollo.",
    outcomes: [
      {
        title: "Educación",
        enables: "Constancia, apoyo escolar y bases más sólidas para completar los estudios.",
      },
      {
        title: "Inglés y Computación",
        enables: "Habilidades prácticas que amplían la comunicación y las oportunidades de empleo.",
      },
      {
        title: "Preparación Laboral",
        enables: "Preparación para solicitudes de empleo, expectativas laborales y confianza profesional.",
      },
      {
        title: "Formación Vocacional",
        enables: "Capacitación técnica para el empleo sostenible, el emprendimiento o la educación superior.",
      },
      {
        title: "Apoyo Familiar y Comunitario",
        enables: "Acompañamiento relacional y práctico que ayuda a los jóvenes a mantenerse vinculados al estudio.",
      },
    ],
  },
  storiesBridge: {
    eyebrow: "MÁS SOBRE NUESTRO TRABAJO",
    heading: "Conoce la historia detrás de las cifras.",
    description:
      "Las cifras muestran la escala, pero las historias humanas muestran lo que significa en la vida diaria. Explora artículos publicados, actualizaciones de programas y noticias comunitarias.",
    primaryCta: { label: "Leer Historias y Noticias", href: "/es/stories" },
    secondaryCta: { label: "Nuestra Historia y Cronología", href: "/es/our-story" },
  },
  finalCta: {
    heading: "Ayuda a crear espacio para lo que viene.",
    description:
      "Tu apoyo ayuda a Dove a seguir ofreciendo educación, habilidades, comunidad y oportunidades a niños y jóvenes de Puerto Plata.",
    primaryAction: { label: "Donar", href: links.giving.general },
    secondaryAction: { label: "Apadrina a un niño", href: links.giving.childSponsorship },
  },
};

export function getOurImpact(locale: Locale) {
  return locale === "es" ? es : en;
}

export type OurImpactContent = typeof en;
