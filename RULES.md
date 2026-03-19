# Project Rules — Northland Legendary Finds

## CRITICAL: No File Regression Rule

**Baseline checkpoint: 65b9c153 (March 19, 2026)**

### The Rule
No existing page, component, or server file may lose content that exists in the current checkpoint unless the user **explicitly requests** the removal. This applies to ALL files, especially:

- `client/src/pages/Home.tsx` — must retain: DoomsdaySection, Variant Series, Why NLF, Coming Soon, Whatnot Live, Explore Collection, Join the Legend. Must NOT contain: CardShowcase / Raw & Graded section.
- `client/src/pages/SubscriberHub.tsx` — The Vault subscriber-only page
- `client/src/components/DoomsdaySection.tsx` — Avengers Doomsday character intel hub
- `client/src/components/Navigation.tsx` — must include The Vault (with Crown icon) and MCU Intel links
- `client/src/components/ArticleManager.tsx` — admin CMS for MCU Intel articles
- `client/src/pages/MCUIntel.tsx` — MCU News & Intel listing page
- `client/src/pages/MCUIntelArticle.tsx` — article detail page
- `client/src/pages/Transparency.tsx` — redesigned with industry context, images, testimonials
- `server/routers/subscriber.ts` — subscriber-only backend procedures
- `server/routers/articles.ts` — article admin CRUD routes
- `server/_core/trpc.ts` — must include subscriberProcedure

### How to Follow This Rule
1. **NEVER rewrite entire files** — use targeted `file edit` operations only
2. **NEVER use `file write` on existing pages** — only on new files
3. When adding new features, **only add imports and insert new sections** into existing files
4. Before any checkpoint save, **verify all sections still exist** in Home.tsx and other critical files
5. If git conflicts arise during checkpoint, **manually resolve** to keep all current content

### Verification Checklist (run before every checkpoint)
```bash
# Must all return results:
grep -q "DoomsdaySection" client/src/pages/Home.tsx && echo "✓ Doomsday"
grep -q "SubscriberHub" client/src/App.tsx && echo "✓ Subscriber route"
grep -q "The Vault" client/src/components/Navigation.tsx && echo "✓ Vault nav"
grep -q "MCUIntel" client/src/App.tsx && echo "✓ MCU Intel route"
grep -q "subscriberProcedure" server/_core/trpc.ts && echo "✓ Subscriber procedure"
grep -q "adminArticles" server/routers.ts && echo "✓ Article routes"
ls client/src/components/DoomsdaySection.tsx && echo "✓ Doomsday component exists"
ls client/src/pages/SubscriberHub.tsx && echo "✓ SubscriberHub exists"
ls server/routers/subscriber.ts && echo "✓ Subscriber router exists"

# Must NOT return results:
grep -q "CardShowcase" client/src/pages/Home.tsx && echo "✗ CardShowcase still present!" || echo "✓ No CardShowcase"
```
