import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import StoryArchive from "@/components/stories/StoryArchive";
import StoriesSupportCTA from "@/components/stories/StoriesSupportCTA";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { getStoriesCopy } from "@/content/stories-ui";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getFeaturedStories, getStories } from "@/lib/cms/public-stories";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getStoriesCopy(locale);
  return localizedMetadata(locale, "/stories", copy.seo.title, copy.seo.description);
}

export default async function StoriesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const values = await searchParams;
  const page = Math.max(1, Number(values.page) || 1);
  const pageSize = 9;
  const query = (values.q ?? "").slice(0, 100);

  let lead = null;
  let items;
  let total;

  if (!query) {
    const featured = await getFeaturedStories(locale, "stories", 1);
    lead = featured[0] ?? (await getStories({ locale, limit: 1 })).items[0] ?? null;
    const offset = page === 1 ? 0 : (pageSize - 1) + (page - 2) * pageSize;
    const limit = page === 1 ? pageSize - 1 : pageSize;
    const archive = await getStories({ locale, limit, offset, excludeId: lead?.id });
    items = archive.items;
    total = archive.total + (lead ? 1 : 0);
  } else {
    const archive = await getStories({ locale, limit: pageSize, offset: (page - 1) * pageSize, query });
    items = archive.items;
    total = archive.total;
  }

  const home = getHome(locale);
  const copy = getStoriesCopy(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: copy.index.title, url: `/${locale}/stories` },
  ]);

  return <>
    <JsonLd data={breadcrumbs} />
    <Header home={home} activeHref={`/${locale}/stories`} />
    <main id="main" tabIndex={-1}>
      <StoryArchive locale={locale} items={items} lead={page === 1 ? lead : null} total={total} page={page} pageSize={pageSize} query={query} />
      <Newsletter home={home} />
      <StoriesSupportCTA home={home} />
    </main>
    <Footer home={home} />
  </>;
}
