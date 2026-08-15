import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(
  resolve(process.cwd(), "client/src/components/ArticleTemplates.tsx"),
  "utf8",
);
const dossierSection = componentSource.slice(
  componentSource.indexOf("Attached — Exhibit A · Visual Reference"),
  componentSource.indexOf("/* ④ executive summary */"),
);

describe("DossierTemplate evidence image", () => {
  it("keeps portrait evidence images uncropped", () => {
    expect(dossierSection).not.toContain('aspectRatio: "16 / 8"');
    expect(dossierSection).toContain('height: "auto"');
    expect(dossierSection).toContain('objectFit: "contain"');
  });
});
