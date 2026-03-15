// Script to add SEO component to all page files
import fs from 'fs';
import path from 'path';

const pagesDir = '/home/ubuntu/northland-legendary-finds/client/src/pages';

// Page SEO configurations
const pageSEO = {
  'Shop.tsx': {
    title: 'Shop Premium Marvel Trading Card Repacks',
    description: 'Browse our collection of premium Marvel trading card repacks. Strong floor, loaded middle, healthy ceiling. Featuring Topps Chrome, Comic Book Heroes, and Marvel Mint.',
    path: '/shop',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Shop', url: '/shop' }],
  },
  'Marvel.tsx': {
    title: 'Marvel Trading Cards Collection',
    description: 'Explore our Marvel trading card collection featuring 2025 Topps Chrome, Comic Book Heroes, Marvel Mint, and Sapphire editions. Premium repacks with guaranteed hits.',
    path: '/marvel',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Marvel', url: '/marvel' }],
  },
  'About.tsx': {
    title: 'About Northland Legendary Finds',
    description: 'Learn about Northland Legendary Finds — a premium Marvel trading card repack business built on transparency, quality, and community. Based in Minnesota.',
    path: '/about',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }],
  },
  'Contact.tsx': {
    title: 'Contact Us',
    description: 'Get in touch with Northland Legendary Finds. Questions about orders, card repacks, or collaborations? We are here to help.',
    path: '/contact',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }],
  },
  'FAQ.tsx': {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about Northland Legendary Finds repacks, shipping, grading, and our transparent pack-opening process.',
    path: '/faq',
    useFaqSchema: true,
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'FAQ', url: '/faq' }],
  },
  'Subscribe.tsx': {
    title: 'Subscribe for Updates',
    description: 'Subscribe to Northland Legendary Finds for exclusive deals, new product launches, and Marvel trading card news delivered to your inbox.',
    path: '/subscribe',
  },
  'Shipping.tsx': {
    title: 'Shipping Information',
    description: 'Shipping rates, delivery times, and policies for Northland Legendary Finds Marvel trading card repacks. Free shipping on orders over $200.',
    path: '/shipping',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Shipping', url: '/shipping' }],
  },
  'Terms.tsx': {
    title: 'Terms of Service',
    description: 'Terms of service for Northland Legendary Finds. Read our policies on purchases, returns, and use of our website.',
    path: '/terms',
  },
  'Privacy.tsx': {
    title: 'Privacy Policy',
    description: 'Privacy policy for Northland Legendary Finds. Learn how we collect, use, and protect your personal information.',
    path: '/privacy',
  },
  'RefundPolicy.tsx': {
    title: 'Refund Policy',
    description: 'Refund and return policy for Northland Legendary Finds trading card repacks. Learn about our satisfaction guarantee and return process.',
    path: '/refund-policy',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Refund Policy', url: '/refund-policy' }],
  },
  'Checklists.tsx': {
    title: 'Card Set Checklists',
    description: 'Complete checklists for all Marvel trading card sets included in Northland Legendary Finds repacks. Track your collection progress.',
    path: '/checklists',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Checklists', url: '/checklists' }],
  },
  'CardDatabase.tsx': {
    title: 'Marvel Card Database',
    description: 'Browse the complete Marvel trading card database. Search by character, set, or parallel across 2025 Topps Chrome, Comic Book Heroes, Marvel Mint, and more.',
    path: '/cards',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Card Database', url: '/cards' }],
  },
  'Whatnot.tsx': {
    title: 'Live on Whatnot',
    description: 'Watch Northland Legendary Finds live pack openings on Whatnot. Join our streams for real-time Marvel trading card breaks and exclusive deals.',
    path: '/whatnot',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Whatnot', url: '/whatnot' }],
  },
  'Transparency.tsx': {
    title: 'Pack Transparency & Pull Rates',
    description: 'Full transparency on Northland Legendary Finds pack contents and pull rates. Every pack opened on camera, every hit tracked and verified.',
    path: '/transparency',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Transparency', url: '/transparency' }],
  },
  'Cart.tsx': {
    title: 'Shopping Cart',
    description: 'Review your Northland Legendary Finds shopping cart. Premium Marvel trading card repacks ready for checkout.',
    path: '/cart',
  },
  'StarWars.tsx': {
    title: 'Star Wars Trading Cards',
    description: 'Star Wars trading card collection coming soon to Northland Legendary Finds. Premium repacks featuring the galaxy far, far away.',
    path: '/star-wars',
  },
};

let updated = 0;
let skipped = 0;

for (const [filename, seo] of Object.entries(pageSEO)) {
  const filePath = path.join(pagesDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${filename} not found`);
    skipped++;
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has SEO
  if (content.includes('import SEO') || content.includes('from "@/components/SEO"')) {
    console.log(`SKIP: ${filename} already has SEO`);
    skipped++;
    continue;
  }

  // Build import line
  const imports = ['SEO'];
  if (seo.breadcrumbs) imports.push('breadcrumbJsonLd');
  const importLine = `import ${imports.length === 1 ? 'SEO' : `SEO, { ${imports.slice(1).join(', ')} }`} from "@/components/SEO";`;

  // Build SEO JSX
  let seoJsx = `      <SEO\n        title="${seo.title}"\n        description="${seo.description}"\n        path="${seo.path}"`;
  
  if (seo.breadcrumbs) {
    const bcItems = seo.breadcrumbs.map(b => `{ name: "${b.name}", url: "${b.url}" }`).join(', ');
    seoJsx += `\n        jsonLd={breadcrumbJsonLd([${bcItems}])}`;
  }
  seoJsx += `\n      />`;

  // Add import after last import line
  const importLines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < importLines.length; i++) {
    if (importLines[i].startsWith('import ') || importLines[i].match(/^} from /)) {
      lastImportIdx = i;
    }
    // Also catch multi-line imports ending with 'from'
    if (importLines[i].match(/from ["']/)) {
      lastImportIdx = i;
    }
  }

  if (lastImportIdx >= 0) {
    importLines.splice(lastImportIdx + 1, 0, importLine);
    content = importLines.join('\n');
  }

  // Add SEO component after first return ( ... <div or <section or <>
  // Find the pattern: return (\n    <div or <section or <>
  const returnMatch = content.match(/return\s*\(\s*\n(\s*)<(div|section|>|Fragment)/);
  if (returnMatch) {
    const indent = returnMatch[1];
    const insertPoint = content.indexOf(returnMatch[0]) + returnMatch[0].length;
    // Find the end of the opening tag
    const afterReturn = content.substring(content.indexOf(returnMatch[0]));
    const firstTagEnd = afterReturn.indexOf('>');
    if (firstTagEnd > 0) {
      const insertAt = content.indexOf(returnMatch[0]) + firstTagEnd + 1;
      content = content.substring(0, insertAt) + '\n' + seoJsx + content.substring(insertAt);
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`DONE: ${filename}`);
  updated++;
}

console.log(`\nUpdated: ${updated}, Skipped: ${skipped}`);
