import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const nav = readFileSync(resolve(here, "../components/Navigation.tsx"), "utf8");
const home = readFileSync(resolve(here, "./HomeHero.tsx"), "utf8");
const shop = readFileSync(resolve(here, "./Shop.tsx"), "utf8");

describe("quiet /breaks navigation", () => {
  it("adds a peer Header item that does not dominate the nav", () => {
    expect(nav).toContain('label: "Breaks"');
    expect(nav).toContain('path: "/breaks"');
    expect(nav).toContain('title: "Whatnot live runs"');
    expect(nav).toContain('path === "/breaks" && location.startsWith("/breaks")');
    expect(nav).not.toContain("LIVE ON WHATNOT");
    expect(nav).not.toContain("See breaks");
  });

  it("keeps a scannable Home chip with a real em dash and a removable EXAMPLE note", () => {
    expect(home).toContain("Live Breaks");
    expect(home).toContain("Topps Marvel repack runs \u2014 checklist + Whatnot only.");
    expect(home).not.toContain("\u00E2\u20AC\u201D");
    expect(home).toContain('href="/breaks"');
    expect(home).toContain("See breaks");
    expect(home).toContain("EXAMPLE run until inventory seeds");
    expect(home).toContain("EXAMPLE_NOTE — remove when inventory seeds");
  });

  it("links Shop to /breaks without adding checkout", () => {
    expect(shop).toContain('href="/breaks"');
    expect(shop).toContain("Breaks");
    expect(shop).not.toContain("add to cart");
    expect(shop).not.toContain("Buy Now");
  });
});
