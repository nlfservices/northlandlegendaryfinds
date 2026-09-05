/**
 * Single break-run shop card — Whatnot CTAs only.
 */

import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";
import BreakRunShopCard from "@/components/BreakRunShopCard";
import { useBreaksFeed } from "@/data/useBreaksFeed";
import NotFound from "@/pages/NotFound";

export default function BreakRun() {
  const { slug } = useParams<{ slug: string }>();
  const { runs, loading } = useBreaksFeed();
  const run = runs.find((item) => item.run_slug === slug);

  if (!loading && !run) {
    return <NotFound />;
  }

  if (!run) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={`${run.title} — Break Run`}
        description={run.blurb}
        path={`/breaks/${run.run_slug}`}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Breaks", url: "/breaks" },
            { name: run.title, url: `/breaks/${run.run_slug}` },
          ]),
          organizationJsonLd(),
        ]}
      />

      <section className="py-10 sm:py-14">
        <div className="container max-w-3xl">
          <Link
            href="/breaks"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All break runs
          </Link>

          <BreakRunShopCard run={run} variant="full" />

          <p className="mt-6 text-xs text-muted-foreground">
            EXAMPLE shell until Pat / Inventory confirm. Rundown only — spots are Whatnot-only
            (@northlandfinds).
          </p>
        </div>
      </section>
    </div>
  );
}
