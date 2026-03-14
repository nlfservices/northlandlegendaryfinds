/**
 * SEO Component — Reusable Helmet wrapper for consistent meta tags across all pages.
 * 
 * Usage:
 *   <SEO title="Page Title" description="Page description" path="/page-path" />
 * 
 * Automatically generates:
 * - <title> tag with brand suffix
 * - <meta name="description">
 * - <link rel="canonical">
 * - Open Graph tags (og:title, og:description, og:url, og:type, og:image)
 * - Twitter Card tags
 * - Optional JSON-LD structured data
 */

import { Helmet } from "react-helmet-async";

const SITE_NAME = "Northland Legendary Finds";
const SITE_URL = "https://northlandlegendaryfinds.com";
const DEFAULT_OG_IMAGE = "https://files.manuscdn.com/webdev_screenshots/2026/03/14/N7NtfsXcKPmAQyTskgdQyG.png?x-oss-process=image/resize,w_1200/crop,h_630,x_0,y_0";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;

  // Support both single and array of JSON-LD schemas
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

/**
 * Pre-built JSON-LD schemas for common page types
 */
export const schemas = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Northland Legendary Finds",
    alternateName: "NLF",
    url: SITE_URL,
    logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png",
    description: "Premium Marvel trading card repacks featuring Topps Chrome, Sapphire, Mint, and more. Strong floor, loaded middle, healthy ceiling.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@nlfservices.com",
      contactType: "customer service",
    },
    sameAs: [],
  }),

  webSite: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Northland Legendary Finds",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/cards?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }),

  breadcrumbList: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }),

  faqPage: (questions: { q: string; a: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }),

  collectionPage: (name: string, description: string, url: string) => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
  }),
};
