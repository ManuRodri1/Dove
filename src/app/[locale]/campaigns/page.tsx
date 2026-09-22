import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignArchive from "@/components/campaigns/CampaignArchive";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { getCampaignsCopy } from "@/content/campaigns-ui";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getActiveCampaigns, getPastCampaigns, getUpcomingCampaigns } from "@/lib/cms/public-campaigns";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ view?: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCampaignsCopy(locale);
  return localizedMetadata(locale, "/campaigns", copy.seo.title, copy.seo.description);
}

export default async function CampaignsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const showAllPast = (await searchParams).view === "all";
  const [active, upcoming, allPast] = await Promise.all([
    getActiveCampaigns(locale),
    getUpcomingCampaigns(locale),
    getPastCampaigns(locale),
  ]);
  const home = getHome(locale);
  const copy = getCampaignsCopy(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: copy.eyebrow, url: `/${locale}/campaigns` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Header home={home} activeHref={`/${locale}/campaigns`} />
      <main id="main" tabIndex={-1}>
        <CampaignArchive
          locale={locale}
          active={active}
          upcoming={upcoming}
          past={showAllPast ? allPast : allPast.slice(0, 6)}
          showAllPast={showAllPast}
        />
      </main>
      <Footer home={home} />
    </>
  );
}
