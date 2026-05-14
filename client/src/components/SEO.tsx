import { Helmet } from "react-helmet-async";

const SITE_NAME = "Northland Legendary Finds";
const DEFAULT_TITLE = "Northland Legendary Finds | Marvel Trading Card Collector Hub";
const DEFAULT_DESCRIPTION =
  "Your home for Marvel trading card collecting. Browse 1,709+ cards across 6 Topps sets, track Avengers: Doomsday intel, explore market analysis, and discover premium hand-curated repacks. Built by collectors, for collectors.";
const DEFAULT_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp";
const SITE_URL = "https://northlandlegendaryfinds.com";

interface SEOProps {
  /** Page title — will be appended with " | Northland Legendary Finds" unless noSuffix is true */
  title?: string;
  /** Meta description (max ~155 chars recommended) */
  description?: string;
  /** Canonical URL path (e.g., "/shop" or "/cards/2025-topps-chrome") */
  path?: string;
  /** Full URL to OG image (1200x630 recommended) */
  image?: string;
  /** OG type — defaults to "website" */
  type?: "website" | "product" | "article";
  /** Don't append site name suffix to title */
  noSuffix?: boolean;
  /** JSON-LD structured data object(s) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Additional meta tags */
  children?: React.ReactNode;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noSuffix = false,
  jsonLd,
  children,
}: SEOProps) {
  const fullTitle = title
    ? noSuffix
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  const canonicalUrl = `${SITE_URL}${path}`;

  // Support single or array of JSON-LD objects
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}

      {children}
    </Helmet>
  );
}

// ===== Reusable JSON-LD Generators =====

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Northland Legendary Finds",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-logo-lmgLHqHqRKDwTnMGBxPxqP.webp",
      width: 512,
      height: 512,
    },
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2025",
    sameAs: [
      "https://www.facebook.com/northlandlegendaryfinds",
      "https://www.instagram.com/northlandlegendaryfinds",
      "https://whatnot.com/invite/northlandfinds",
      "https://mintcomiccards.com",
      "https://comicbookcard.com",
      "https://riseofdoom.com",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${SITE_URL}/contact`,
      email: "contact@nlfservices.com",
    },
    knowsAbout: [
      "Marvel Trading Cards",
      "Topps Marvel Mint",
      "Topps Comic Book Heroes",
      "Card Grading",
      "PSA Grading",
      "Marvel Collectibles",
      "Avengers Doomsday",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/cards?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd({
  name,
  description,
  image,
  price,
  currency = "USD",
  availability = "https://schema.org/InStock",
  url,
  sku,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  url: string;
  sku?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: `${SITE_URL}${url}`,
    ...(sku && { sku }),
    brand: {
      "@type": "Brand",
      name: "Northland Legendary Finds",
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability,
      seller: {
        "@type": "Organization",
        name: "Northland Legendary Finds",
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqJsonLd(
  questions: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Northland Legendary Finds",
    url: SITE_URL,
    description: "Premium Marvel trading card repacks with full published checklists and real-time pull tracking.",
    priceRange: "$100-$200",
    image: DEFAULT_IMAGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "6390 McKinley St NW",
      addressLocality: "Anoka",
      addressRegion: "MN",
      postalCode: "55303",
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };
}

export function articleJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  slug,
  category,
  tags,
  wordCount,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  slug: string;
  category?: string;
  tags?: string[];
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    ...(image && { image: { "@type": "ImageObject", url: image } }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: authorName || "NLF Team",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Northland Legendary Finds",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-logo-lmgLHqHqRKDwTnMGBxPxqP.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/mcu-news/${slug}`,
    },
    ...(wordCount && { wordCount }),
    ...(category && { articleSection: category }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
    isAccessibleForFree: true,
    inLanguage: "en-US",
  };
}

export function collectionPageJsonLd({
  name,
  description,
  url,
  itemCount,
}: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    ...(itemCount && { mainEntity: { "@type": "ItemList", numberOfItems: itemCount } }),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function eventJsonLd({
  name,
  startDate,
  endDate,
  location,
  description,
  url,
}: {
  name: string;
  startDate: string;
  endDate?: string;
  location: { name: string; address: string };
  description?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    startDate,
    ...(endDate && { endDate }),
    location: {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: location.address,
      },
    },
    ...(description && { description }),
    ...(url && { url }),
    organizer: {
      "@type": "Organization",
      name: "Northland Legendary Finds",
      url: SITE_URL,
    },
  };
}

export function itemListJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; position: number; url?: string; image?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: `${SITE_URL}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      ...(item.url && { url: `${SITE_URL}${item.url}` }),
      ...(item.image && { image: item.image }),
    })),
  };
}

export function speakableJsonLd({
  url,
  cssSelectors = ["h1", ".article-intro", ".article-summary"],
}: {
  url: string;
  cssSelectors?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE_URL}${url}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}
