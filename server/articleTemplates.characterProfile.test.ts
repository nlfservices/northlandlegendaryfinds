import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const componentSource = readFileSync(
  resolve(process.cwd(), "client/src/components/ArticleTemplates.tsx"),
  "utf8",
);
const profileSection = componentSource.slice(
  componentSource.indexOf("export function CharacterProfileTemplate"),
  componentSource.indexOf("// TEMPLATE 10: DISNEY EXPERIENCE"),
);

describe("CharacterProfileTemplate inline images", () => {
  it("extracts and renders one related article image for each profile section", () => {
    expect(profileSection).toContain("const inlineImages = useMemo(() => extractImages(content), [content]);");
    expect(profileSection).toContain("{inlineImages[i] && (");
    expect(profileSection).toContain('className="h-auto w-full object-contain"');
  });
});
