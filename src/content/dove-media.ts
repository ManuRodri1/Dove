/** Approved remote media. Never associate a generic portrait with a named person.
 * Source: client-supplied implementation request, September 2026.
 * Wix originals remain remote; next/image generates cached delivery variants.
 */
export type DoveImage = { src: string; alt: string; position?: string };
const wix = "https://static.wixstatic.com/media/";
const videoRoot = "https://res.cloudinary.com/vloh9uw1/video/upload/";
const videoId = "v1789135765/entrega_utiles_DOVE_OF";

export const doveMedia = {
  logo: {
    main: {
      src: `${wix}294108_5540425cbe8648ff94b4acce95758bf1~mv2.png`,
      alt: "Dove Youth Development",
    },
    alternative: {
      src: `${wix}294108_a4f8197ae58c42fbadbafdb815887ad5~mv2.jpg`,
      alt: "Dove Youth Development",
    },
    mark: {
      src: `${wix}294108_171ed12cf55349de8efc36bf51267540~mv2.png`,
      alt: "",
    },
  },
  hero: {
    video: `${videoRoot}${videoId}.mp4`,
    // A still from the actual video; no unrelated photograph masquerades as a frame.
    poster: {
      src: `${videoRoot}so_1,w_1600,q_auto,f_jpg/${videoId}.jpg`,
      alt: "",
    },
    mobileVideo: `${videoRoot}w_720,q_auto,f_mp4/${videoId}.mp4`,
    desktopVideo: `${videoRoot}w_1440,q_auto,f_mp4/${videoId}.mp4`,
  },
  donate: {
    hero: {
      youtubeId: "rjFUSW-1xmA",
      poster: "https://i.ytimg.com/vi/rjFUSW-1xmA/maxresdefault.jpg",
    },
  },
  whatWeDo: {
    hero: {
      src: `${wix}d88784_44242d83e5054c4b8c70b72f04061da1~mv2.jpg`,
      alt: "Young people smiling together outdoors at Dove Youth Development",
      position: "center 38%",
    },
    youth: {
      src: `${wix}d88784_d9e2faf456d6418eab1ecf21ea2390d2~mv2.jpg`,
      alt: "Children participating together in a Dove Youth Development activity",
      position: "center center",
    },
    education: {
      src: `${wix}294108_7a6539ca50ac4116838606139b596706~mv2.png`,
      alt: "A group gathered in a Dove classroom",
      position: "center center",
    },
    jobReadiness: {
      src: `${wix}d88784_f8c3172be1074bfb8d851ab7451d9dfe~mv2.jpg`,
      alt: "A Dove archive photograph representing young people preparing for what comes next",
      position: "center center",
    },
    vocational: {
      src: `${wix}d88784_d7cfee1200f24009b3bc3a46f30c5fec~mv2.jpg`,
      alt: "Young women working together on a laptop during a Dove program",
      position: "center 42%",
    },
    community: {
      src: `${wix}d88784_985bc8e5e2e14354bcad30400568cc04~mv2.jpg`,
      alt: "The Dove Youth Development Center in Puerto Plata",
      position: "center center",
    },
  },
  history: {
    community: {
      src: `${wix}d88784_a7a23d90612842f49fe85e293cbdeb41~mv2.jpeg`,
      alt: "An archival photograph of the Dove community",
    },
    center: {
      src: `${wix}d88784_994a60f1a39446c9b65c0c5b152080ac~mv2.jpg`,
      alt: "An archival photograph from Dove’s Youth Development Center",
    },
    primary: {
      src: `${wix}d88784_c623d3c93caa478dada0b6bfbe9c25c1~mv2.jpeg`,
      alt: "An archival photograph from Dove Missions in Puerto Plata",
    },
    fallbackOne: {
      src: `${wix}d88784_048134964e06446d87c23fb8f9d93c18~mv2.jpg`,
      alt: "Liz visiting the Puerto Plata community",
    },
    fallbackTwo: {
      src: `${wix}d88784_2cd4cd9a5ae54131b184d23c6bf67938~mv2.jpg`,
      alt: "Dove’s community in Puerto Plata",
    },
  },
  // TODO: REPLACE WITH VERIFIED LEONELA PHOTO
  leonela: null as DoveImage | null,
  sponsorship: {
    primary: {
      src: `${wix}d88784_44242d83e5054c4b8c70b72f04061da1~mv2.jpg`,
      alt: "Two boys smiling together outdoors at Dove",
    },
    support: {
      src: `${wix}d88784_19861c09b3324722a3a6893de9fa1333~mv2.jpg`,
      alt: "A child greeting a visitor during a Dove community activity",
    },
    testimonials: {
      yarleni: {
        src: `${wix}d88784_cdca2707b757425687ea38981e20ac38~mv2.jpg`,
        alt: "Yarleni smiling outside the Dove Youth Development Center",
        position: "center 38%",
      },
      carlos: {
        src: `${wix}d88784_a7000d366af64992a3f2dee8d62fafcc~mv2.jpg`,
        alt: "Carlos playing basketball outdoors",
        position: "center 34%",
      },
      darianny: {
        src: `${wix}d88784_f5242b3ebd6e478591cc12309f2f93f6~mv2.jpg`,
        alt: "Darianny with a Dove visitor in front of a classroom board",
        position: "center 30%",
      },
      chrismason: {
        src: `${wix}d88784_fbbd5ce7bec54f30bade57186403a14a~mv2.jpg`,
        alt: "Chrismason sitting with friends in the Dove playground",
        position: "center 42%",
      },
    },
  },
  volunteer: {
    hero: {
      youtubeId: "aCY1225xEWc",
      poster: "https://i.ytimg.com/vi/aCY1225xEWc/maxresdefault.jpg",
    },
    primary: {
      src: `${wix}d88784_10b87cc651b8478b964bbb90adb56a63~mv2.jpg`,
      alt: "Volunteers taking part in Dove’s community activities",
    },
    facePainting: {
      src: `${wix}d88784_ed999cda183348e1861ed5940a550516~mv2.jpg`,
      alt: "A Dove community activity with face painting",
      position: "center center",
    },
    snackPreparation: {
      src: `${wix}d88784_83b606acf2294b8185a77b49b4a470c8~mv2.jpg`,
      alt: "Volunteers and the Dove community preparing snacks together",
      position: "center center",
    },
    groupCircle: {
      src: `${wix}d88784_f01b04e0f24e47b09cfaedcc44f31160~mv2.jpg`,
      alt: "Dove participants and visitors gathered in a community circle",
      position: "center center",
    },
  },
  travel: {
    hero: {
      src: `${wix}d88784_10b87cc651b8478b964bbb90adb56a63~mv2.jpg`,
      alt: "A visiting group participating together in a Dove community activity",
      position: "center 42%",
    },
    primary: {
      src: `${wix}d88784_ad2f24185b9343c0977bcf0f61c12795~mv2.jpg`,
      alt: "A visiting group sharing the Dove experience in Puerto Plata",
    },
    facePainting: {
      src: `${wix}d88784_ed999cda183348e1861ed5940a550516~mv2.jpg`,
      alt: "An adult visitor and a Dove student taking part in a face-painting activity",
      position: "center center",
    },
    snackPreparation: {
      src: `${wix}d88784_83b606acf2294b8185a77b49b4a470c8~mv2.jpg`,
      alt: "A visitor participating in snack preparation during a Dove program day",
      position: "center center",
    },
    groupCircle: {
      src: `${wix}d88784_f01b04e0f24e47b09cfaedcc44f31160~mv2.jpg`,
      alt: "Dove children and visitors gathered together in a circle",
      position: "center center",
    },
  },
  partnerships: {
    hero: {
      src: `${wix}d88784_f01b04e0f24e47b09cfaedcc44f31160~mv2.jpg`,
      alt: "Dove participants and visitors gathered in a community circle",
      position: "center center",
    },
    workforce: {
      src: `${wix}d88784_d7cfee1200f24009b3bc3a46f30c5fec~mv2.jpg`,
      alt: "Young people working together during a Dove skills program",
      position: "center 42%",
    },
  },
  vocational: {
    primary: {
      src: `${wix}d88784_d7cfee1200f24009b3bc3a46f30c5fec~mv2.jpg`,
      alt: "Two young women working together on a laptop at Dove",
    },
    development: {
      src: `${wix}d88784_f8c3172be1074bfb8d851ab7451d9dfe~mv2.jpg`,
      alt: "A Dove archive photograph used to preview the campaign layout",
    },
    centerCommunity: {
      src: `${wix}d88784_994a60f1a39446c9b65c0c5b152080ac~mv2.jpg`,
      alt: "Young people, staff and visitors gathered outside the Dove Youth Development Center",
      position: "center 52%",
    },
    programGroup: {
      src: `${wix}294108_7a6539ca50ac4116838606139b596706~mv2.png`,
      alt: "A group gathered in a Dove classroom",
      position: "center center",
    },
    founder: {
      src: `${wix}d88784_19fae333afbd456dabb421a84595e7e2~mv2.jpg`,
      alt: "Dove founder Liz Rooney at a community event",
      position: "center 38%",
    },
  },
} satisfies Record<string, unknown>;
