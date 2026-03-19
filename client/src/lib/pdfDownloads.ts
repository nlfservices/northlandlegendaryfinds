/**
 * Branded PDF Checklist & Odds Sheet CDN URLs
 * Mapped by set slug for easy lookup
 */

export interface SetPdfLinks {
  checklist?: string;
  odds?: string;
}

export const SET_PDF_LINKS: Record<string, SetPdfLinks> = {
  "2025-topps-chrome": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-chrome-checklist_46748526.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-chrome-odds_6afafb56.pdf",
  },
  "2025-topps-marvel-chrome-sapphire": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-chrome-sapphire-checklist_229857e3.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-chrome-sapphire-odds_9e1f2a62.pdf",
  },
  "2025-topps-marvel-studios": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-checklist_1d7a9485.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-odds_185e1a98.pdf",
  },
  "2025-topps-marvel-studios-sapphire": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-sapphire-checklist_fac20077.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-studios-sapphire-odds_50ce6396.pdf",
  },
  "2025-topps-comic-book-heroes": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-comic-book-heroes-checklist_2fbbf386.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-comic-book-heroes-odds_e08ea9fb.pdf",
  },
  "2025-topps-marvel-mint": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-mint-checklist_2ac86a8f.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-mint-odds_89806c75.pdf",
  },
  // The Collector uses a different slug format in the DB
  "2025-marvel-the-collector": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-collector-checklist_072a13fa.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2025-topps-marvel-collector-odds_8dcfecf4.pdf",
  },
  // 2024 sets (not yet in DB but PDFs available for future use)
  "2024-topps-marvel-chrome": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2024-topps-marvel-chrome-checklist_f3634e0b.pdf",
    odds: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2024-topps-marvel-chrome-odds_eda061bc.pdf",
  },
  "2024-topps-marvel-chrome-sapphire": {
    checklist: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/2024-topps-marvel-chrome-sapphire-checklist_4ffa37b6.pdf",
  },
};

/**
 * Get PDF download links for a set by its slug
 */
export function getSetPdfLinks(slug: string): SetPdfLinks | null {
  return SET_PDF_LINKS[slug] || null;
}
