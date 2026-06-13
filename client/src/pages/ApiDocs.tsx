/**
 * NLF API Documentation Page
 * Public reference for the NLF REST API v1
 */
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Key, Zap, Image, FileText, Users, BarChart3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <pre className="bg-black/60 border border-white/10 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-300 leading-relaxed">
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POST: "bg-green-500/20 text-green-400 border-green-500/30",
    PATCH: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${colors[method] ?? "bg-muted"}`}>
      {method}
    </span>
  );
}

interface Endpoint {
  method: string;
  path: string;
  description: string;
  permission: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  example?: string;
  response?: string;
}

const ENDPOINTS: Record<string, { icon: React.ReactNode; label: string; endpoints: Endpoint[] }> = {
  cards: {
    icon: <Image className="w-4 h-4" />,
    label: "Cards",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/cards",
        description: "List cards with optional filters. Supports pagination.",
        permission: "cards:read",
        params: [
          { name: "setSlug", type: "string", required: false, description: "Filter by card set slug" },
          { name: "cardType", type: "string", required: false, description: "Filter by card type (e.g. Base - Common)" },
          { name: "characterName", type: "string", required: false, description: "Search by character name" },
          { name: "limit", type: "number", required: false, description: "Max results (default 50, max 200)" },
          { name: "offset", type: "number", required: false, description: "Pagination offset" },
        ],
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/cards?setSlug=2026-topps-finest-fantastic-four&cardType=Base+-+Common&limit=50"`,
        response: `{
  "cards": [
    {
      "id": 1,
      "cardNumber": "1",
      "characterName": "Mister Fantastic",
      "cardType": "Base - Common",
      "imageUrl": "https://...",
      "setSlug": "2026-topps-finest-fantastic-four"
    }
  ],
  "total": 50,
  "limit": 50,
  "offset": 0
}`,
      },
      {
        method: "GET",
        path: "/api/v1/cards/:id",
        description: "Get a single card by its database ID.",
        permission: "cards:read",
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/cards/1"`,
      },
      {
        method: "PATCH",
        path: "/api/v1/cards/:id",
        description: "Update a card's data (imageUrl, description, price, etc.).",
        permission: "cards:write",
        params: [
          { name: "imageUrl", type: "string", required: false, description: "New image URL for the card" },
          { name: "description", type: "string", required: false, description: "Card description" },
          { name: "marketValue", type: "number", required: false, description: "Market value in cents" },
        ],
        example: `curl -X PATCH \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"imageUrl": "https://example.com/image.png"}' \\
  "https://northlandlegendaryfinds.com/api/v1/cards/1"`,
      },
      {
        method: "POST",
        path: "/api/v1/cards/image",
        description: "Upload an image for a card identified by character name and card type. This is the primary endpoint for Grok image uploads.",
        permission: "cards:write",
        params: [
          { name: "characterName", type: "string", required: true, description: "Exact character name (e.g. Mister Fantastic)" },
          { name: "setSlug", type: "string", required: true, description: "Card set slug (e.g. 2026-topps-finest-fantastic-four)" },
          { name: "cardType", type: "string", required: false, description: "Card type filter (default: Base - Common)" },
          { name: "imageUrl", type: "string", required: true, description: "Public URL of the image to use" },
        ],
        example: `curl -X POST \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "characterName": "Mister Fantastic",
    "setSlug": "2026-topps-finest-fantastic-four",
    "cardType": "Base - Common",
    "imageUrl": "https://example.com/mister-fantastic.png"
  }' \\
  "https://northlandlegendaryfinds.com/api/v1/cards/image"`,
        response: `{
  "success": true,
  "updated": 1,
  "cardId": 42,
  "characterName": "Mister Fantastic"
}`,
      },
    ],
  },
  sets: {
    icon: <Zap className="w-4 h-4" />,
    label: "Card Sets",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/sets",
        description: "List all card sets.",
        permission: "sets:read",
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/sets"`,
      },
      {
        method: "GET",
        path: "/api/v1/sets/:slug",
        description: "Get a single card set by slug.",
        permission: "sets:read",
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/sets/2026-topps-finest-fantastic-four"`,
      },
    ],
  },
  articles: {
    icon: <FileText className="w-4 h-4" />,
    label: "Articles",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/articles",
        description: "List published MCU news articles.",
        permission: "articles:read",
        params: [
          { name: "limit", type: "number", required: false, description: "Max results (default 20)" },
          { name: "offset", type: "number", required: false, description: "Pagination offset" },
        ],
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/articles?limit=10"`,
      },
      {
        method: "POST",
        path: "/api/v1/articles",
        description: "Create a new MCU news article (saved as draft).",
        permission: "articles:write",
        params: [
          { name: "title", type: "string", required: true, description: "Article title" },
          { name: "slug", type: "string", required: true, description: "URL slug" },
          { name: "content", type: "string", required: true, description: "Article body (markdown)" },
          { name: "excerpt", type: "string", required: false, description: "Short summary" },
          { name: "imageUrl", type: "string", required: false, description: "Hero image URL" },
          { name: "publish", type: "boolean", required: false, description: "Publish immediately (default: false)" },
        ],
        example: `curl -X POST \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Avengers Doomsday: Everything We Know",
    "slug": "avengers-doomsday-everything-we-know",
    "content": "# Article content here...",
    "publish": false
  }' \\
  "https://northlandlegendaryfinds.com/api/v1/articles"`,
      },
    ],
  },
  artists: {
    icon: <Users className="w-4 h-4" />,
    label: "Artists",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/artists",
        description: "List all artists in the database.",
        permission: "artists:write",
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/artists"`,
      },
      {
        method: "POST",
        path: "/api/v1/artists/image",
        description: "Upload a portrait image for an artist by name.",
        permission: "artists:write",
        params: [
          { name: "artistName", type: "string", required: true, description: "Artist full name" },
          { name: "imageUrl", type: "string", required: true, description: "Public URL of portrait image" },
        ],
        example: `curl -X POST \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "artistName": "Jim Cheung",
    "imageUrl": "https://example.com/jim-cheung.jpg"
  }' \\
  "https://northlandlegendaryfinds.com/api/v1/artists/image"`,
      },
    ],
  },
  social: {
    icon: <Share2 className="w-4 h-4" />,
    label: "Social",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/social/draft",
        description: "Create a social media post draft for review in the admin dashboard.",
        permission: "social:write",
        params: [
          { name: "content", type: "string", required: true, description: "Post text content" },
          { name: "platform", type: "string", required: false, description: "Target platform (facebook, instagram)" },
          { name: "imageUrl", type: "string", required: false, description: "Image URL to attach" },
        ],
        example: `curl -X POST \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "New article: Avengers Doomsday card checklist is live!",
    "platform": "facebook"
  }' \\
  "https://northlandlegendaryfinds.com/api/v1/social/draft"`,
      },
    ],
  },
  admin: {
    icon: <BarChart3 className="w-4 h-4" />,
    label: "Admin",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/admin/stats",
        description: "Get site statistics (card count, article count, etc.).",
        permission: "admin:read",
        example: `curl -H "X-API-Key: YOUR_KEY" \\
  "https://northlandlegendaryfinds.com/api/v1/admin/stats"`,
        response: `{
  "cards": { "total": 704, "withImages": 100 },
  "sets": { "total": 12 },
  "articles": { "total": 48, "published": 45 },
  "artists": { "total": 60 }
}`,
      },
    ],
  },
};

const GROK_INSTRUCTIONS = `## NLF - AI Card Maker: Grok Project Instructions

You are an AI card art generator for Northland Legendary Finds (NLF), a Marvel trading card collector community site.

### Your Role
Generate trading card illustrations and upload them directly to the NLF website via the REST API.

### API Access
Base URL: https://northlandlegendaryfinds.com/api/v1
Authentication: Add header \`X-API-Key: YOUR_KEY_HERE\` to every request

### Image Upload Workflow
After generating each image:
1. Save the image to a public URL (or use a file hosting service)
2. Call the card image endpoint:

\`\`\`
POST https://northlandlegendaryfinds.com/api/v1/cards/image
X-API-Key: YOUR_KEY_HERE
Content-Type: application/json

{
  "characterName": "Mister Fantastic",
  "setSlug": "2026-topps-finest-fantastic-four",
  "cardType": "Base - Common",
  "imageUrl": "URL_OF_YOUR_GENERATED_IMAGE"
}
\`\`\`

### Art Style Rules
- Comic book illustration style — bold ink lines, vibrant flat colors, cel-shaded
- Dynamic action pose or iconic character stance
- Rich cosmic/abstract background (no plain white or black)
- Square format (1:1 ratio)
- No text, no card borders, no watermarks
- Characters must be Marvel only — never DC

### Card Type Styles
- **Base - Common/Uncommon/Rare**: Standard comic art, vibrant colors
- **1960s Blacklight Variation**: Psychedelic blacklight poster style, neon on black
- **Negative Zone Variation**: Inverted colors, dark cosmic void background
- **Tribute to Finest '96**: Chromium-style, metallic sheen, 90s aesthetic
- **Inserts**: Dramatic lighting, premium feel

### Naming Convention
Name files exactly as the character name: \`Mister Fantastic.png\`, \`Doctor Doom.png\``;

export default function ApiDocs() {
  const [activeSection, setActiveSection] = useState("quickstart");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">NLF REST API</h1>
              <p className="text-muted-foreground text-sm">v1.0 — northlandlegendaryfinds.com</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            The NLF API lets external tools — including Grok, Zapier, and custom scripts — manage
            card images, articles, artists, and social drafts directly on the site. All endpoints
            require an API key generated from the Admin Dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-1">
              {["quickstart", "authentication", "grok", ...Object.keys(ENDPOINTS)].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                    activeSection === section
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {section === "quickstart"
                    ? "Quick Start"
                    : section === "authentication"
                    ? "Authentication"
                    : section === "grok"
                    ? "Grok Instructions"
                    : ENDPOINTS[section]?.label ?? section}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Start */}
            {activeSection === "quickstart" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Quick Start</h2>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium">Generate an API key</p>
                        <p className="text-sm text-muted-foreground">Go to Admin Dashboard → API Keys tab → New API Key. Choose a preset or custom permissions.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium">Add the key to your requests</p>
                        <CodeBlock code={`curl -H "X-API-Key: nlf_your_key_here" \\
  "https://northlandlegendaryfinds.com/api/v1/sets"`} />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium">Start making requests</p>
                        <p className="text-sm text-muted-foreground">All endpoints return JSON. Errors include a <code className="bg-muted px-1 rounded text-xs">message</code> field explaining what went wrong.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="font-semibold mb-3">Base URL</h3>
                  <CodeBlock code="https://northlandlegendaryfinds.com/api/v1" />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Error Responses</h3>
                  <CodeBlock code={`// 401 Unauthorized
{ "error": "Missing or invalid API key" }

// 403 Forbidden
{ "error": "Insufficient permissions. Required: cards:write" }

// 404 Not Found
{ "error": "Card not found" }

// 500 Server Error
{ "error": "Internal server error" }`} language="json" />
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeSection === "authentication" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Authentication</h2>
                <p className="text-muted-foreground">
                  All API requests must include your API key in the <code className="bg-muted px-1 rounded text-sm">X-API-Key</code> header.
                </p>
                <CodeBlock code={`curl -H "X-API-Key: nlf_your_key_here" \\
  "https://northlandlegendaryfinds.com/api/v1/cards"`} />

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Permission Scopes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left pb-2 font-medium">Scope</th>
                          <th className="text-left pb-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-1">
                        {[
                          ["cards:read", "List and view card data"],
                          ["cards:write", "Update cards, upload images"],
                          ["sets:read", "List and view card sets"],
                          ["sets:write", "Create and update card sets"],
                          ["articles:read", "List and view articles"],
                          ["articles:write", "Create and update articles"],
                          ["artists:write", "Upload artist portraits"],
                          ["social:write", "Create social post drafts"],
                          ["admin:read", "View site statistics"],
                        ].map(([scope, desc]) => (
                          <tr key={scope} className="border-b border-border/50">
                            <td className="py-2 pr-4">
                              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary">{scope}</code>
                            </td>
                            <td className="py-2 text-muted-foreground">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Grok Instructions */}
            {activeSection === "grok" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Grok Project Instructions</h2>
                <p className="text-muted-foreground">
                  Copy the instructions below into your <strong>NLF - AI Card Maker</strong> Grok project. This configures Grok to generate card art in the correct style and upload images directly to the site.
                </p>
                <div className="relative">
                  <pre className="bg-black/60 border border-white/10 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-300 leading-relaxed whitespace-pre-wrap">
                    {GROK_INSTRUCTIONS}
                  </pre>
                  <CopyButton text={GROK_INSTRUCTIONS} />
                </div>
                <Card className="bg-primary/10 border-primary/30">
                  <CardContent className="pt-4 text-sm">
                    <strong>Tip:</strong> After pasting, replace <code className="bg-muted px-1 rounded">YOUR_KEY_HERE</code> with the actual API key you generated in Admin → API Keys.
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Endpoint sections */}
            {Object.entries(ENDPOINTS).map(([key, section]) =>
              activeSection === key ? (
                <div key={key} className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {section.icon}
                    {section.label}
                  </h2>
                  {section.endpoints.map((ep, i) => (
                    <Card key={i} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <MethodBadge method={ep.method} />
                          <code className="text-sm font-mono text-foreground">{ep.path}</code>
                          <Badge variant="outline" className="text-xs ml-auto">
                            {ep.permission}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{ep.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {ep.params && ep.params.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Parameters</p>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left pb-1.5 font-medium text-muted-foreground">Name</th>
                                  <th className="text-left pb-1.5 font-medium text-muted-foreground">Type</th>
                                  <th className="text-left pb-1.5 font-medium text-muted-foreground">Required</th>
                                  <th className="text-left pb-1.5 font-medium text-muted-foreground">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ep.params.map((p) => (
                                  <tr key={p.name} className="border-b border-border/50">
                                    <td className="py-1.5 pr-3 font-mono text-primary">{p.name}</td>
                                    <td className="py-1.5 pr-3 text-muted-foreground">{p.type}</td>
                                    <td className="py-1.5 pr-3">
                                      {p.required ? (
                                        <span className="text-red-400">required</span>
                                      ) : (
                                        <span className="text-muted-foreground">optional</span>
                                      )}
                                    </td>
                                    <td className="py-1.5 text-muted-foreground">{p.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {ep.example && (
                          <div>
                            <p className="text-sm font-medium mb-2">Example Request</p>
                            <CodeBlock code={ep.example} />
                          </div>
                        )}
                        {ep.response && (
                          <div>
                            <p className="text-sm font-medium mb-2">Example Response</p>
                            <CodeBlock code={ep.response} language="json" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
