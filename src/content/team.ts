import "server-only";
import type { Locale } from "@/i18n/config";
import { teamEn } from "@/i18n/messages/team.en";
import { teamEs } from "@/i18n/messages/team.es";
import type { DoveImage } from "./dove-media";
import { links } from "./links";

type LocalizedText = Readonly<Record<Locale, string>>;
type TeamGroup = "staff" | "board" | "dominican-board";
type SourcePerson = {
  id: string;
  name: string;
  role: LocalizedText | null;
  email?: string;
  image?: DoveImage;
  imageAlt?: LocalizedText;
  context?: readonly LocalizedText[];
  group: TeamGroup;
  sortOrder: number;
};

const wix = "https://static.wixstatic.com/media/";
const image = (path: string, alt: string, position?: string): DoveImage => ({ src: `${wix}${path}`, alt, position });
const media = {
  hero: { youtubeId: "sfWjNavvpcU", poster: "https://i.ytimg.com/vi/sfWjNavvpcU/maxresdefault.jpg", start: 31 },
  liz: image("d88784_7778844f33de4d758ffc6716870f8c2d~mv2.jpg", "Portrait of Liz Rooney", "center 59%"),
  vicky: image("d88784_fefa40778622481d82e420287f0b1173~mv2.jpg", "Portrait of Vicky Mowl", "center 62%"),
  stina: image("294108_ce727aa643b7466ba01e604d03fd1d5d~mv2.jpeg", "Portrait of Stina Johansson"),
  regis: image("d88784_5c09e4a410184483ab9f1b957e17c19c~mv2.jpg", "Portrait of Régis Buzenet", "center 66%"),
  teresa: image("d88784_03de129422654c18b2f0f178fbc9ea05~mv2.jpg", "Portrait of Teresa Cabrera Bonilla", "center 59%"),
  nemesis: image("d88784_2fd5cd4b7b614f9a8b6aa9897cb64bad~mv2.jpg", "Portrait of Némesis Sánchez", "center 61%"),
  leonela: image("294108_57e242194dce4044b589a7295c6aa217~mv2.jpeg", "Portrait of Leonela Pena"),
  gustavo: image("0d11bb_af6a5328e5e9490b8c546f58ce8246a0~mv2.jpg", "Portrait of Gustavo Reynoso"),
  amy: image("911777_e5551c17017d457e87d933fe8101d670~mv2.jpg", "Portrait of Amy Burkhalter"),
  deb: image("294108_45aeab9bdd2d43a882751ed6fcb860d9~mv2.png", "Portrait of Deb Srbich"),
  edward: image("294108_0fe67c89d8264997b655fbacb6c3f6bf~mv2.jpg", "Portrait of Edward Davison-Gwynn"),
  dawn: image("294108_fc2b8529a0474f09b0d950e8182c7e8f~mv2.jpg", "Portrait of Dawn Kane"),
  caroline: image("294108_4769df6e7c7d4c0cba44f4e33ceb8ce0~mv2.png", "Portrait of Caroline Gould", "center 64%"),
  lauren: image("294108_d5769c008bc24684a6d3a27b598389c3~mv2.png", "Portrait of Lauren Belardinelli", "center 64%"),
} as const;

const text = (en: string, es: string): LocalizedText => ({ en, es });

const staff: readonly SourcePerson[] = [
  { id: "liz-rooney", name: "Liz Rooney", role: text("Executive Director and Founder", "Directora Ejecutiva y Fundadora"), email: "executivedirector@doveyouthdevelopment.org", image: media.liz, imageAlt: text("Portrait of Liz Rooney, Executive Director and Founder of Dove Youth Development", "Retrato de Liz Rooney, Directora Ejecutiva y Fundadora de Dove Youth Development"), group: "staff", sortOrder: 1 },
  { id: "vicky-mowl", name: "Vicky Mowl", role: text("Director of Operations DR", "Directora de Operaciones en RD"), email: "vicky@doveyouthdevelopment.org", image: media.vicky, imageAlt: text("Portrait of Vicky Mowl, Director of Operations DR", "Retrato de Vicky Mowl, Directora de Operaciones en RD"), group: "staff", sortOrder: 2 },
  { id: "stina-johansson", name: "Stina Johansson", role: text("Program Manager", "Gerente de Programas"), email: "stina@doveyouthdevelopment.org", image: media.stina, imageAlt: text("Portrait of Stina Johansson, Program Manager", "Retrato de Stina Johansson, Gerente de Programas"), group: "staff", sortOrder: 3 },
  { id: "regis-buzenet", name: "Régis Buzenet", role: text("Youth Center Manager", "Gerente del Centro Juvenil"), image: media.regis, imageAlt: text("Portrait of Régis Buzenet, Youth Center Manager", "Retrato de Régis Buzenet, Gerente del Centro Juvenil"), group: "staff", sortOrder: 4 },
  { id: "teresa-cabrera-bonilla", name: "Teresa Cabrera Bonilla", role: text("Primary School Teacher", "Docente de Primaria"), image: media.teresa, imageAlt: text("Portrait of Teresa Cabrera Bonilla, Primary School Teacher", "Retrato de Teresa Cabrera Bonilla, Docente de Primaria"), group: "staff", sortOrder: 5 },
  { id: "carmen-wamre", name: "Carmen Wamre", role: null, group: "staff", sortOrder: 6 },
  { id: "nemesis-sanchez", name: "Némesis Sánchez", role: text("Job Readiness Program Teacher", "Docente del Programa de Preparación Laboral"), image: media.nemesis, imageAlt: text("Portrait of Némesis Sánchez, Job Readiness Program Teacher", "Retrato de Némesis Sánchez, Docente del Programa de Preparación Laboral"), group: "staff", sortOrder: 7 },
  { id: "leonela-pena", name: "Leonela Pena", role: text("School Teacher", "Docente"), image: media.leonela, imageAlt: text("Portrait of Leonela Pena, School Teacher", "Retrato de Leonela Pena, Docente"), group: "staff", sortOrder: 8 },
  { id: "gustavo-reynoso", name: "Gustavo Reynoso", role: text("Social Media", "Redes Sociales"), image: media.gustavo, imageAlt: text("Portrait of Gustavo Reynoso, Social Media", "Retrato de Gustavo Reynoso, Redes Sociales"), group: "staff", sortOrder: 9 },
];

const board: readonly SourcePerson[] = [
  { id: "amy-burkhalter", name: "Amy Burkhalter", role: text("Board Chair", "Presidenta de la Junta Directiva"), image: media.amy, imageAlt: text("Portrait of Amy Burkhalter, Board Chair", "Retrato de Amy Burkhalter, Presidenta de la Junta Directiva"), context: [text("Executive Leadership Coach", "Coach de Liderazgo Ejecutivo"), text("Vital Focus, LLC", "Vital Focus, LLC")], group: "board", sortOrder: 1 },
  { id: "deb-srbich", name: "Deb Srbich", role: text("Board Treasurer", "Tesorera de la Junta Directiva"), image: media.deb, imageAlt: text("Portrait of Deb Srbich, Board Treasurer", "Retrato de Deb Srbich, Tesorera de la Junta Directiva"), context: [text("Small Business Owner", "Propietaria de una pequeña empresa"), text("Accountant / Bookkeeper", "Contadora / encargada de libros")], group: "board", sortOrder: 2 },
  { id: "edward-davison-gwynn", name: "Edward Davison-Gwynn", role: text("Board Secretary", "Secretario de la Junta Directiva"), image: media.edward, imageAlt: text("Portrait of Edward Davison-Gwynn, Board Secretary", "Retrato de Edward Davison-Gwynn, Secretario de la Junta Directiva"), context: [text("President, Lead Peak Performance, LLC", "Presidente, Lead Peak Performance, LLC"), text("CEO, Peaceful Horizon, LLC", "CEO, Peaceful Horizon, LLC")], group: "board", sortOrder: 3 },
  { id: "dawn-kane", name: "Dawn Kane", role: text("Marketing Committee Chair", "Presidenta del Comité de Marketing"), image: media.dawn, imageAlt: text("Portrait of Dawn Kane, Marketing Committee Chair", "Retrato de Dawn Kane, Presidenta del Comité de Marketing"), context: [text("CEO, Hot Dish Advertising", "CEO, Hot Dish Advertising")], group: "board", sortOrder: 4 },
];

const dominicanBoard: readonly SourcePerson[] = [
  { id: "liz-rooney-dr-board", name: "Liz Rooney", role: text("President", "Presidenta"), image: media.liz, imageAlt: text("Portrait of Liz Rooney, President of the Dominican Board", "Retrato de Liz Rooney, Presidenta de la Junta Dominicana"), group: "dominican-board", sortOrder: 1 },
  { id: "caroline-gould", name: "Caroline Gould", role: text("Secretary", "Secretaria"), image: media.caroline, imageAlt: text("Portrait of Caroline Gould, Secretary of the Dominican Board", "Retrato de Caroline Gould, Secretaria de la Junta Dominicana"), group: "dominican-board", sortOrder: 2 },
  { id: "cinzia-vittorio", name: "Cinzia Vittorio", role: text("Treasurer", "Tesorera"), group: "dominican-board", sortOrder: 3 },
  { id: "lauren-belardinelli", name: "Lauren Belardinelli", role: text("Lifestyles Liaison", "Enlace con Lifestyles"), image: media.lauren, imageAlt: text("Portrait of Lauren Belardinelli, Lifestyles Liaison", "Retrato de Lauren Belardinelli, Enlace con Lifestyles"), group: "dominican-board", sortOrder: 4 },
  { id: "gustavo-reynoso-dr-board", name: "Gustavo Reynoso", role: text("Media & Marketing", "Medios y Marketing"), image: media.gustavo, imageAlt: text("Portrait of Gustavo Reynoso, Media and Marketing", "Retrato de Gustavo Reynoso, Medios y Marketing"), group: "dominican-board", sortOrder: 5 },
  { id: "erika-camps", name: "Erika Camps", role: text("Job Readiness Program", "Programa de Preparación Laboral"), group: "dominican-board", sortOrder: 6 },
];

function localizePerson(person: SourcePerson, locale: Locale) {
  return {
    id: person.id, name: person.name, role: person.role?.[locale] ?? null, email: person.email,
    image: person.image ? { ...person.image, alt: person.imageAlt?.[locale] ?? person.image.alt } : null,
    context: person.context?.map((line) => line[locale]) ?? [], group: person.group, sortOrder: person.sortOrder,
  };
}

export function getTeam(locale: Locale) {
  const copy = locale === "es" ? teamEs : teamEn;
  return {
    ...copy, locale, video: media.hero, leader: localizePerson(staff[0], locale),
    staffPeople: staff.slice(1).map((person) => localizePerson(person, locale)),
    boardPeople: board.map((person) => localizePerson(person, locale)),
    dominicanBoardPeople: dominicanBoard.map((person) => localizePerson(person, locale)),
    leadershipLinks: { story: { label: copy.leadership.storyCta, href: links.ourStory(locale) } },
    closingLinks: { contact: { label: copy.closing.primary, href: links.contact(locale) }, story: { label: copy.closing.secondary, href: links.ourStory(locale) } },
  };
}

export type TeamContent = ReturnType<typeof getTeam>;
export type TeamPerson = TeamContent["staffPeople"][number];
