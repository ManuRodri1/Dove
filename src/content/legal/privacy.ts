import type { Locale } from "@/i18n/config";

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export interface LegalDocument {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  summary: string;
  sections: LegalSection[];
}

export const privacyEn: LegalDocument = {
  eyebrow: "LEGAL & GOVERNANCE",
  title: "Privacy Policy",
  lastUpdated: "September 2026",
  summary:
    "This Privacy Policy explains how Dove Youth Development collects, uses, and protects information submitted through doveyouthdevelopment.org.",
  sections: [
    {
      id: "scope",
      title: "1. Scope of This Policy",
      content: [
        "This policy applies to information collected through the public website at doveyouthdevelopment.org and our direct communication channels. It does not apply to third-party websites, external donation platforms, or offline community programs governed by separate policies.",
      ],
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      content: [
        "We collect personal information that you voluntarily provide to us when completing forms on our website:",
        "• General Contact Inquiries: First and last name, email address, optional phone number, reason for inquiry, and message content.",
        "• Volunteer Applications: Full name, email address, phone number, requested start dates, expected duration, and volunteer release acknowledgment.",
        "• Travel With Purpose Inquiries: Organizer full name, email address, phone number, organization name, group type, estimated group size, preferred dates, and interests.",
        "• Institutional Partnerships: Contact name, organization name, work email address, phone number, website, role, and partnership interest.",
        "• Newsletter: Online newsletter signup is currently inactive and does not collect or store subscriber records on this website.",
      ],
    },
    {
      id: "how-information-is-used",
      title: "3. How We Use Information",
      content: [
        "We use submitted information solely for genuine non-profit operational purposes:",
        "• To evaluate and respond to inbound inquiries and messages.",
        "• To coordinate volunteer placements, community travel experiences, and institutional alliances.",
        "• To maintain administrative records of correspondence and form submissions.",
        "We do not sell, rent, trade, or share your personal information with third-party marketing brokers or advertisers.",
      ],
    },
    {
      id: "service-providers",
      title: "4. Infrastructure & Service Providers",
      content: [
        "To host and operate our website reliably, we rely on trusted infrastructure providers:",
        "• Supabase: Secure cloud database hosting for storing form submissions and managing authenticated administrative access.",
        "• Brevo: Transactional email delivery service used to notify our team of inbound contact and application submissions.",
        "• Cloudinary & Wix Media: Content delivery networks used to host documentary photographs and approved organizational media.",
        "• Network for Good / Bonterra: Third-party donation processing platform. Online financial gifts are handled entirely on their secure checkout pages. Dove Youth Development does not process or store credit card numbers on this website.",
      ],
    },
    {
      id: "cookies-and-storage",
      title: "5. Cookies and Similar Technologies",
      content: [
        "Dove Youth Development maintains a privacy-first approach to web storage:",
        "• dove_locale: A first-party preference cookie used solely to remember your chosen language (English or Spanish).",
        "• Admin Authentication: Session tokens issued by Supabase are restricted strictly to authorized team members logging into /admin. They are not used for public visitor tracking.",
        "• User-Initiated Third-Party Embeds: Embedded YouTube videos, Google Maps, and Tripadvisor review widgets do not execute network requests on initial page load. They are loaded only after you explicitly click or activate the respective feature.",
        "We do not use automatic third-party analytics trackers, advertising cookies, or cross-site behavioral tracking scripts.",
      ],
    },
    {
      id: "children-privacy",
      title: "6. Children's Privacy Safeguards",
      content: [
        "While Dove Youth Development is dedicated to youth empowerment in the Dominican Republic, the public forms on this website are designed for adults, parents, legal guardians, prospective volunteers, and organizational representatives.",
        "We do not knowingly solicit or collect personal information directly from children under 13 years of age. If a parent or legal guardian believes that a child has submitted personal details through our forms, please contact us immediately so we can promptly inspect and delete the submission.",
      ],
    },
    {
      id: "data-retention",
      title: "7. Data Retention",
      content: [
        "Inquiry and application submissions are retained only for as long as reasonably necessary to fulfill the operational purpose for which they were collected, coordinate ongoing communications, resolve inquiries, prevent disputes, and satisfy non-profit administrative recordkeeping requirements.",
      ],
    },
    {
      id: "international-transfers",
      title: "8. International Operations & Location",
      content: [
        "Dove Youth Development operates community programs in Puerto Plata, Dominican Republic, supported by administrative channels in the United States. Information submitted to our website may be accessed and processed by authorized team members in both jurisdictions.",
      ],
    },
    {
      id: "your-rights",
      title: "9. Your Inquiries & Privacy Requests",
      content: [
        "You may contact us at any time to request access to, correction of, or deletion of personal information you previously submitted through our website.",
        "Please direct all privacy requests to our executive leadership team at executivedirector@doveyouthdevelopment.org.",
      ],
    },
    {
      id: "contact",
      title: "10. Contact Us",
      content: [
        "If you have questions about this Privacy Policy or our data handling practices, please contact:",
        "Dove Youth Development",
        "Email: executivedirector@doveyouthdevelopment.org",
        "Phone (DR): +1 (809) 676-4071",
        "Phone (US): +1 (612) 442-5974",
      ],
    },
  ],
};

export const privacyEs: LegalDocument = {
  eyebrow: "LEGAL Y GOBERNANZA",
  title: "Política de Privacidad",
  lastUpdated: "Septiembre 2026",
  summary:
    "Esta Política de Privacidad explica cómo Dove Youth Development recopila, utiliza y protege la información enviada a través de doveyouthdevelopment.org.",
  sections: [
    {
      id: "scope",
      title: "1. Alcance de esta Política",
      content: [
        "Esta política aplica a la información recopilada mediante el sitio web público en doveyouthdevelopment.org y nuestros canales de comunicación directa. No aplica a sitios de terceros, plataformas externas de donación ni programas comunitarios presenciales regidos por políticas independientes.",
      ],
    },
    {
      id: "information-we-collect",
      title: "2. Información que Recopilamos",
      content: [
        "Recopilamos datos personales que usted proporciona voluntariamente al completar formularios en nuestro sitio:",
        "• Consultas Generales de Contacto: Nombre, apellido, correo electrónico, teléfono opcional, motivo de consulta y mensaje.",
        "• Solicitudes de Voluntariado: Nombre completo, correo electrónico, teléfono, fechas solicitadas, duración estimada y aceptación del descargo de voluntariado.",
        "• Consultas de Viajes con Propósito: Nombre del organizador, correo electrónico, teléfono, organización, tipo de grupo, tamaño estimado, fechas deseadas e intereses.",
        "• Alianzas Institucionales: Nombre del contacto, nombre de la organización, correo laboral, teléfono, sitio web, rol e interés de colaboración.",
        "• Boletín / Newsletter: El registro en línea para boletines está actualmente inactivo y no recopila ni almacena registros de suscriptores en este sitio.",
      ],
    },
    {
      id: "how-information-is-used",
      title: "3. Cómo Utilizamos la Información",
      content: [
        "Utilizamos la información recibida exclusivamente para fines operativos de nuestra labor sin fines de lucro:",
        "• Evaluar y responder a consultas y mensajes recibidos.",
        "• Coordinar programas de voluntariado, experiencias de viaje comunitario y alianzas institucionales.",
        "• Mantener registros administrativos de correspondencia y solicitudes.",
        "No vendemos, alquilamos ni comercializamos su información personal con agencias publicitarias o intermediarios de mercadeo.",
      ],
    },
    {
      id: "service-providers",
      title: "4. Infraestructura y Proveedores de Servicio",
      content: [
        "Para operar nuestro sitio web de manera segura y confiable, utilizamos proveedores de infraestructura reconocidos:",
        "• Supabase: Alojamiento de base de datos en la nube para resguardar solicitudes y gestionar el acceso administrativo autenticado.",
        "• Brevo: Servicio de entrega de correos transaccionales para notificar a nuestro equipo sobre nuevas consultas.",
        "• Cloudinary y Wix Media: Redes de entrega de contenido para alojar fotografías documentales y medios institucionales autorizados.",
        "• Network for Good / Bonterra: Plataforma externa para el procesamiento seguro de donaciones. Las donaciones se realizan directamente en su plataforma segura; Dove Youth Development no procesa ni almacena números de tarjeta de crédito en este sitio web.",
      ],
    },
    {
      id: "cookies-and-storage",
      title: "5. Cookies y Tecnologías Similares",
      content: [
        "Dove Youth Development mantiene un enfoque estricto de privacidad en el almacenamiento web:",
        "• dove_locale: Cookie propia de preferencia utilizada únicamente para recordar el idioma seleccionado (inglés o español).",
        "• Autenticación Administrativa: Las sesiones de Supabase se limitan estrictamente al personal autorizado que accede a /admin. No se utilizan para rastreo de visitantes públicos.",
        "• Elementos de Terceros Activados por el Usuario: Los videos de YouTube, Google Maps y opiniones de Tripadvisor no ejecutan solicitudes al cargar la página. Solo se cargan tras una acción explícita del usuario.",
        "No utilizamos rastreadores publicitarios automáticos ni cookies de seguimiento publicitario entre sitios.",
      ],
    },
    {
      id: "children-privacy",
      title: "6. Protección de la Privacidad de Menores",
      content: [
        "Aunque Dove Youth Development se dedica al desarrollo integral de la juventud en la República Dominicana, los formularios públicos de este sitio están dirigidos a adultos, padres, tutores legales, voluntarios y representantes institucionales.",
        "No solicitamos ni recopilamos intencionalmente datos personales directamente de menores de 13 años. Si un padre o tutor considera que un menor ha enviado información personal, puede contactarnos para su inmediata revisión y eliminación.",
      ],
    },
    {
      id: "data-retention",
      title: "7. Retención de Datos",
      content: [
        "Las solicitudes y consultas se conservan únicamente durante el tiempo razonablemente necesario para cumplir el propósito para el que fueron provistas, coordinar comunicaciones, resolver inquietudes y mantener registros institucionales adecuados.",
      ],
    },
    {
      id: "international-transfers",
      title: "8. Operaciones Internacionales",
      content: [
        "Dove Youth Development opera programas comunitarios en Puerto Plata, República Dominicana, con apoyo administrativo en los Estados Unidos. La información enviada puede ser gestionada por miembros autorizados del equipo en ambas ubicaciones.",
      ],
    },
    {
      id: "your-rights",
      title: "9. Solicitudes de Privacidad",
      content: [
        "Puede comunicarse con nosotros en cualquier momento para solicitar el acceso, corrección o eliminación de información provista previamente.",
        "Dirija sus solicitudes a la dirección ejecutiva en executivedirector@doveyouthdevelopment.org.",
      ],
    },
    {
      id: "contact",
      title: "10. Contacto",
      content: [
        "Para consultas sobre esta Política de Privacidad o el tratamiento de datos, comuníquese con:",
        "Dove Youth Development",
        "Correo: executivedirector@doveyouthdevelopment.org",
        "Teléfono (RD): +1 (809) 676-4071",
        "Teléfono (EE. UU.): +1 (612) 442-5974",
      ],
    },
  ],
};

export function getPrivacyContent(locale: Locale): LegalDocument {
  return locale === "es" ? privacyEs : privacyEn;
}
