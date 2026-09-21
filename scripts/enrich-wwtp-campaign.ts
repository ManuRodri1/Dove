import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
// @ts-ignore
import { Client } from "pg";

const env = parse(readFileSync(resolve(process.cwd(), ".env.local")));
if (!env.POSTGRES_URL_NON_POOLING) throw new Error("Missing POSTGRES_URL_NON_POOLING");
const connectionString = env.POSTGRES_URL_NON_POOLING.replace(/([?&])sslmode=[^&]+&?/, (_match, lead) => lead === "?" ? "?" : "").replace(/\?$/, "");
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();
  console.log("Connected to database.");

  // 1. Check existing campaign
  const campaignRes = await client.query(
    "SELECT c.id, c.hero_media_id FROM dove.campaigns c JOIN dove.campaign_translations ct ON ct.campaign_id = c.id WHERE ct.slug = 'weekend-with-the-pros-2025' LIMIT 1"
  );
  if (!campaignRes.rows.length) {
    console.log("Campaign weekend-with-the-pros-2025 not found.");
    await client.end();
    return;
  }
  const campaignId = campaignRes.rows[0].id;
  console.log("Found campaign ID:", campaignId);

  // 2. Find a suitable media asset for hero if not set
  let heroMediaId = campaignRes.rows[0].hero_media_id;
  if (!heroMediaId) {
    const mediaRes = await client.query(
      "SELECT id, url, original_filename FROM dove.media_assets WHERE url LIKE '%d88784%' OR url LIKE '%294108%' ORDER BY created_at ASC LIMIT 5"
    );
    if (mediaRes.rows.length) {
      // Pick a community photo
      heroMediaId = mediaRes.rows[0].id;
      await client.query("UPDATE dove.campaigns SET hero_media_id = $1 WHERE id = $2", [heroMediaId, campaignId]);
      console.log("Updated hero_media_id to:", heroMediaId);
    }
  }

  // 3. Check translations
  const transRes = await client.query(
    "SELECT id, locale FROM dove.campaign_translations WHERE campaign_id = $1",
    [campaignId]
  );
  console.log("Found translations:", transRes.rows.map((r: { locale: string }) => r.locale));

  for (const trans of transRes.rows) {
    const translationId = trans.id;
    const locale = trans.locale;

    // Check existing blocks
    const blocksRes = await client.query(
      "SELECT id, block_type FROM dove.campaign_blocks WHERE campaign_translation_id = $1",
      [translationId]
    );
    console.log(`Translation ${locale} currently has ${blocksRes.rows.length} blocks.`);

    if (blocksRes.rows.length <= 1) {
      // Delete minimal single block and insert rich, editorial CMS blocks
      await client.query("DELETE FROM dove.campaign_blocks WHERE campaign_translation_id = $1", [translationId]);

      const isEs = locale === "es";

      const blocks = [
        {
          block_type: "callout",
          sort_order: 0,
          data: {
            tone: "inspiration",
            title: isEs ? "Acerca de este evento histórico" : "About this historical initiative",
            text: isEs
              ? "<p>Weekend With The Pros 2025 fue un encuentro solidario de cuatro días que unió clínicas deportivas juveniles, golf benéfico y el apoyo directo a los programas de educación y desarrollo de Dove en Puerto Plata.</p>"
              : "<p>Weekend With The Pros 2025 was a four-day charitable gathering combining youth sports clinics, golf, and direct community support for Dove Youth Development’s programs in Puerto Plata.</p>",
          },
          settings: { width: "content", spacing: "normal", alignment: "left", theme: "warm" },
        },
        {
          block_type: "rich_text",
          sort_order: 1,
          data: {
            html: isEs
              ? "<p>Durante cuatro días en la costa norte de la República Dominicana, profesionales del deporte, visitantes y la comunidad local compartieron actividades deportivas, clínicas formativas para jóvenes y espacios de encuentro para visibilizar las oportunidades educativas que Dove construye cada día.</p><p>Como evento histórico ya concluido, esta página conserva el testimonio y el propósito de la iniciativa. Aunque las inscripciones y reservas ya no están abiertas, la misión de Dove continúa todos los días acompañando a niños y jóvenes en su camino hacia la educación y la independencia.</p>"
              : "<p>Over four days on the North Coast of the Dominican Republic, sports professionals, guests, and the local community came together for golf, youth sports clinics, and meaningful connection in support of Dove Youth Development.</p><p>As a concluded historical event, this archive preserves the spirit and purpose of the weekend without keeping expired booking offers. Dove’s mission continues every day, providing education, vocational training, and long-term community support for young people in Puerto Plata.</p>",
          },
          settings: { width: "narrow", spacing: "normal", alignment: "left", theme: "default" },
        },
        {
          block_type: "button_group",
          sort_order: 2,
          data: {
            buttons: isEs
              ? [
                  { label: "Apoyar a Dove", href: "/es/donate", variant: "primary" },
                  { label: "Apadrina a un niño", href: "/es/child-sponsorship", variant: "secondary" },
                  { label: "Ver campañas actuales", href: "/es/campaigns", variant: "secondary" },
                ]
              : [
                  { label: "Support Dove", href: "/en/donate", variant: "primary" },
                  { label: "Sponsor a Child", href: "/en/child-sponsorship", variant: "secondary" },
                  { label: "Explore Current Campaigns", href: "/en/campaigns", variant: "secondary" },
                ],
          },
          settings: { width: "content", spacing: "generous", alignment: "center", theme: "default" },
        },
      ];

      for (const b of blocks) {
        await client.query(
          "INSERT INTO dove.campaign_blocks(campaign_translation_id, block_type, sort_order, data, settings, visible) VALUES ($1, $2, $3, $4, $5, true)",
          [translationId, b.block_type, b.sort_order, JSON.stringify(b.data), JSON.stringify(b.settings)]
        );
      }
      console.log(`Enriched ${locale} with ${blocks.length} blocks.`);
    }
  }

  await client.end();
  console.log("Enrichment complete.");
}

run().catch((err) => {
  console.error("Enrichment failed:", err);
  process.exit(1);
});
