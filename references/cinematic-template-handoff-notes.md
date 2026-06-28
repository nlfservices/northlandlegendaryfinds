# Cinematic Template Handoff Notes

Source: /home/ubuntu/upload/files_extracted/Cinematic-Template-Manus-Handoff.pdf

## Implementation instructions from the handoff

The handoff says this work **replaces the existing `CinematicTemplate`** with a redesigned version and adds a **shared `CollectorSpot` conversion block** that can be reused across templates.

The required sequence is:

1. Add the required fonts in `client/index.html` without removing existing font links.
2. Paste the shared `CollectorSpot` component into `client/src/components/ArticleTemplates.tsx` once.
3. Set the sitewide URLs at the top of that shared block:
   - `NLF_WHATNOT_URL = "https://www.whatnot.com/user/northlandlegendaryfinds"` in the handoff, but this should be verified against the user's current Whatnot profile URL.
   - `NLF_SHOP_URL = "https://northlandlegendaryfinds.com/shop"` in the handoff, also to be verified.
4. Replace the existing `CinematicTemplate` function in `ArticleTemplates.tsx` with the new one from the handoff.
5. No rotation or union type change is needed according to the handoff because `cinematic` already exists.
6. The handoff explicitly says not to edit page shell/container wrappers, helper functions like `splitBySections`, `extractPullQuote`, `proseClasses`, `ArticleTemplateRenderer`, or unrelated templates.

## Design/system notes captured from the viewed pages

- The redesigned cinematic template uses a **full-bleed 21:9 letterbox hero**.
- It uses **Oswald** for headings/labels and **JetBrains Mono** for metadata and technical captions.
- It includes a **shared collector CTA block** that appears around 60% scroll / before the final section.
- It supports two modes in the shared collector block:
  - a card-specific / collector-focus mode when `cardMarketImpact` or focus card content exists;
  - a generic fallback mode that promotes Whatnot and repacks.
- The collector block has a special `skin="cinematic"` variant with dark styling and CTA buttons.
- There is also a neutral/default collector block skin in the code.
- The template includes a reusable `CineStill` helper for 16:7 image stills/captions.
- The template structure shown in the PDF includes:
  - 21:9 hero
  - theatrical intro text
  - numbered "Scene" section headers
  - optional still image after the first scene
  - pull quote after the first scene
  - collector slot injected mid-article

## Constraints called out by the handoff

Do not redesign or rename:
- template wrappers
- `article-full` / main article container usage
- page shell pieces such as related articles, comments, countdown/hero shared pieces
- helper functions already used by other templates
- duplicate `CollectorSpot`; paste it once only

## Assets/files provided in the zip

- `/home/ubuntu/upload/files_extracted/Cinematic-Template-Manus-Handoff.pdf`
- `/home/ubuntu/upload/files_extracted/CinematicTemplate.tsx`
- `/home/ubuntu/upload/files_extracted/cinematic-preview.html`

## Follow-up needed

The provided `.tsx` source file should be read directly next so the exact code can be copied more reliably than continuing page-by-page PDF extraction.

The active Whatnot URL should likely use the user's current profile link format: `https://www.whatnot.com/user/northlandfinds`.

The existing no-regression skill should be re-read before implementation because context was compacted.
