# Comic Strip Template Handoff Notes

Source: `/home/ubuntu/upload/Comic-Strip-Template-Manus-Handoff.pdf`

## Required implementation steps from the PDF

1. Add fonts in `client/index.html`:
   - `https://fonts.googleapis.com`
   - `https://fonts.gstatic.com` with `crossorigin`
   - `https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bangers&display=swap`
2. Paste a new `ComicStripTemplate` component into `client/src/components/ArticleTemplates.tsx` after existing template functions and before `ArticleTemplateRenderer`.
3. Add `comic_strip` to the `ArticleTemplate` union type.
4. Register it in `ArticleTemplateRenderer` / switch:
   - `case 'comic_strip': return <ComicStripTemplate {...props} />;`
5. Update `ROTATION_TEMPLATES` by replacing `collector_spotlight` with `comic_strip` so the rotation remains 10 templates.
6. Add `comic_strip` to the admin template dropdown in `client/src/components/ArticleManager.tsx`, labeled `Comic Strip`.
7. Verify `MCUNewsArticle.tsx` already routes through `ArticleTemplateRenderer`.
8. Run build/type check after implementation.

## PDF constraints

- Do not modify unrelated templates.
- Do not alter page headers, DB schema, or unrelated files.
- Do not redesign other templates.
- Keep `RichContent`, `proseClasses`, `splitBySections`, and `extractPullQuote` usage intact.
- Do not invent image URLs; section panels may show placeholders until real images are supplied.

## Design characteristics from the PDF

- Comic-book style with on-brand colors wired to current CSS vars.
- Uses `ComicPlaceholder` and `ComicArt` helper functions inside the template file.
- Root rendering note says it should render inside the existing article `max-w-4xl` editable region.
- Includes:
  - issue cover / hero panel
  - intro caption box with drop cap
  - alternating side-by-side section panels
  - speech-bubble style pull quote
  - POW divider + mid-article hook card
  - inline style block for `.comic-intro-prose p:first-of-type::first-letter`, `.comic-intro-prose p`, `.comic-side-art`, `.comic-row`

## Specific styling cues visible in the PDF

- Black ink color variable `#0c0a12`
- White paper `#fff`
- Accent / shadow red around `#a80b12`
- Accent yellow panels `#ffd23f`
- Caption red/orange `#fa6208`
- Halftone background via repeating linear gradient
- Fonts:
  - `Bangers` for headings / loud comic text
  - `Archivo Black` for labels / metadata
- Thick black borders, 6px radius, comic-card panels, bold shadows
- Mid-article hook example text: `Next Issue` and `Keep reading the next file` linking back to `/mcu-news`

## Notes about section art

- The handoff intentionally uses placeholders for per-section art.
- The template should accept `featuredImageUrl` for the main cover panel.
- Section art can stay placeholder-only for now unless the article content later provides image URLs.
