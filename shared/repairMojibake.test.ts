import { describe, expect, it } from "vitest";
import { hasMojibake, repairMojibake, repairMojibakeFields } from "./repairMojibake";

describe("repairMojibake", () => {
  it("restores em dashes from CP1252 mojibake and uppercase leftovers", () => {
    expect(repairMojibake("2024 to 2026 \u00E2\u20AC\u201D organized by year")).toBe(
      "2024 to 2026 \u2014 organized by year"
    );
    expect(repairMojibake("MCU PHASE 6 \u00C2\u20AC\u201D LIVE COUNTDOWN")).toBe(
      "MCU PHASE 6 \u2014 LIVE COUNTDOWN"
    );
  });

  it("restores en dashes, ellipses, arrows, and middle dots", () => {
    expect(repairMojibake("BASE CARDS \u00E2\u20AC\u201C BRONZE")).toBe("BASE CARDS \u2013 BRONZE");
    expect(repairMojibake("Loading archive\u00E2\u20AC\u00A6")).toBe("Loading archive\u2026");
    expect(repairMojibake("IN OUR COLLECTION \u00E2\u2020\u2019")).toBe("IN OUR COLLECTION \u2192");
    expect(repairMojibake("#109 \u00C2\u00B7 Black Refractor")).toBe("#109 \u00B7 Black Refractor");
  });

  it("restores stars and lightning used in chrome", () => {
    expect(repairMojibake("\u00E2\u02DC\u2026 SPIDER-MAN")).toBe("\u2605 SPIDER-MAN");
    expect(repairMojibake("\u00E2\u0161\u00A1 MARVEL CINEMATIC UNIVERSE")).toBe(
      "\u26A1 MARVEL CINEMATIC UNIVERSE"
    );
  });

  it("leaves already-correct Unicode and latinize character classes alone", () => {
    expect(repairMojibake("Premium Marvel cards — ripped live")).toBe(
      "Premium Marvel cards — ripped live"
    );
    expect(repairMojibake("[áàâä]")).toBe("[áàâä]");
  });

  it("repairs selected object fields", () => {
    const row = repairMojibakeFields(
      { title: "Doom \u00E2\u20AC\u201D live", slug: "doom-live" },
      ["title"]
    );
    expect(row.title).toBe("Doom \u2014 live");
    expect(row.slug).toBe("doom-live");
  });

  it("detects remaining mojibake", () => {
    expect(hasMojibake("clean — dash")).toBe(false);
    expect(hasMojibake("broken \u00E2\u20AC\u201D dash")).toBe(true);
  });
});
