/**
 * PageContentManager — Admin UI for editing page content from the dashboard.
 * Supports the Giveaway page with grouped, labeled editable fields.
 * Falls back to hardcoded defaults when no DB content exists.
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { Loader2, Save, RotateCcw, FileText, Gift, Info, Users, Truck } from "lucide-react";

// ─── Default content for the Giveaway page ──────────────────────────────────

const GIVEAWAY_DEFAULTS: Array<{
  sectionKey: string;
  content: string;
  label: string;
  groupName: string;
  sortOrder: number;
  fieldType: "text" | "textarea";
}> = [
  // Hero Section
  { sectionKey: "hero_headline", content: "JOIN OUR STREAM — $5,000 IN GIVEAWAYS", label: "Hero Headline", groupName: "Hero Section", sortOrder: 1, fieldType: "text" },
  { sectionKey: "hero_giveaway_amount", content: "$5,000", label: "Giveaway Amount (displayed in headline)", groupName: "Hero Section", sortOrder: 2, fieldType: "text" },
  { sectionKey: "hero_description", content: "Northland Legendary Finds is giving away $5,000 in Marvel trading card products during our live Whatnot streams.", label: "Hero Description", groupName: "Hero Section", sortOrder: 3, fieldType: "textarea" },
  { sectionKey: "hero_subtitle", content: "Free NLF Repacks. Free Boxes. Free Graded Cards. Free Raw Cards. No purchase necessary. Plus — our repack business launches later this month!", label: "Hero Subtitle", groupName: "Hero Section", sortOrder: 4, fieldType: "textarea" },
  { sectionKey: "whatnot_invite_url", content: "https://whatnot.com/invite/northlandfinds", label: "Whatnot Invite URL", groupName: "Hero Section", sortOrder: 5, fieldType: "text" },

  // Prize Section
  { sectionKey: "prize_1_label", content: "FREE NLF REPACKS", label: "Prize 1 Label", groupName: "Prizes", sortOrder: 10, fieldType: "text" },
  { sectionKey: "prize_1_description", content: "Our hand-built NLF repack packs — every card curated, every checklist public. Launching later this month!", label: "Prize 1 Description", groupName: "Prizes", sortOrder: 11, fieldType: "textarea" },
  { sectionKey: "prize_2_label", content: "FREE BOXES", label: "Prize 2 Label", groupName: "Prizes", sortOrder: 12, fieldType: "text" },
  { sectionKey: "prize_2_description", content: "Full sealed hobby boxes and blasters — the real deal, not resealed", label: "Prize 2 Description", groupName: "Prizes", sortOrder: 13, fieldType: "textarea" },
  { sectionKey: "prize_3_label", content: "FREE GRADED CARDS", label: "Prize 3 Label", groupName: "Prizes", sortOrder: 14, fieldType: "text" },
  { sectionKey: "prize_3_description", content: "PSA & CGC graded slabs — authenticated, graded, and ready for your collection", label: "Prize 3 Description", groupName: "Prizes", sortOrder: 15, fieldType: "textarea" },
  { sectionKey: "prize_4_label", content: "FREE RAW CARDS", label: "Prize 4 Label", groupName: "Prizes", sortOrder: 16, fieldType: "text" },
  { sectionKey: "prize_4_description", content: "Raw hits, inserts, parallels, and chase cards pulled from premium sets", label: "Prize 4 Description", groupName: "Prizes", sortOrder: 17, fieldType: "textarea" },

  // Who We Are
  { sectionKey: "who_we_are_description", content: "We're a Minnesota-based Marvel trading card company specializing in premium repacks, live card breaks, and building the best collector community in the hobby. Every pack is hand-built, every checklist is public, and every pull is live. We track over 1,700+ cards in our database and bring real transparency to the hobby.", label: "Who We Are Description", groupName: "Who We Are", sortOrder: 20, fieldType: "textarea" },
  { sectionKey: "who_stat_1_num", content: "1,700+", label: "Stat 1 Number", groupName: "Who We Are", sortOrder: 21, fieldType: "text" },
  { sectionKey: "who_stat_1_label", content: "Cards Tracked", label: "Stat 1 Label", groupName: "Who We Are", sortOrder: 22, fieldType: "text" },
  { sectionKey: "who_stat_2_num", content: "$5,000+", label: "Stat 2 Number", groupName: "Who We Are", sortOrder: 23, fieldType: "text" },
  { sectionKey: "who_stat_2_label", content: "In Giveaways", label: "Stat 2 Label", groupName: "Who We Are", sortOrder: 24, fieldType: "text" },
  { sectionKey: "who_stat_3_num", content: "100%", label: "Stat 3 Number", groupName: "Who We Are", sortOrder: 25, fieldType: "text" },
  { sectionKey: "who_stat_3_label", content: "Transparent", label: "Stat 3 Label", groupName: "Who We Are", sortOrder: 26, fieldType: "text" },
  { sectionKey: "who_stat_4_num", content: "LIVE", label: "Stat 4 Number", groupName: "Who We Are", sortOrder: 27, fieldType: "text" },
  { sectionKey: "who_stat_4_label", content: "On Whatnot", label: "Stat 4 Label", groupName: "Who We Are", sortOrder: 28, fieldType: "text" },

  // Authenticity Section
  { sectionKey: "authenticity_paragraph_1", content: "We get it. $5,000 in free cards? No catch? It sounds wild. But here's the thing — the giveaways are just one part of what we do. We genuinely love this hobby. We're also launching our NLF repack business later this month — hand-built packs with public checklists and real value inside every one.", label: "Authenticity Paragraph 1", groupName: "Too Good To Be True", sortOrder: 30, fieldType: "textarea" },
  { sectionKey: "authenticity_paragraph_2", content: "Beyond the giveaways and repacks, our streams are about showing off incredible cards, reading and hearing perspectives from other collectors, and building a community that actually cares about the hobby. We love the conversations, the debates over which pull is the best, and watching people light up when they hit something special.", label: "Authenticity Paragraph 2", groupName: "Too Good To Be True", sortOrder: 31, fieldType: "textarea" },
  { sectionKey: "authenticity_closing", content: "The giveaways are real. The community is real. Come see for yourself.", label: "Closing Statement", groupName: "Too Good To Be True", sortOrder: 32, fieldType: "textarea" },
];

// Build a lookup for field types
const FIELD_TYPE_MAP: Record<string, "text" | "textarea"> = {};
for (const d of GIVEAWAY_DEFAULTS) {
  FIELD_TYPE_MAP[d.sectionKey] = d.fieldType;
}

// Group icons
const GROUP_ICONS: Record<string, React.ReactNode> = {
  "Hero Section": <Gift className="w-4 h-4" />,
  "Prizes": <FileText className="w-4 h-4" />,
  "Who We Are": <Users className="w-4 h-4" />,
  "Too Good To Be True": <Info className="w-4 h-4" />,
};

export default function PageContentManager() {
  const utils = trpc.useUtils();

  // Fetch existing content for the giveaway page
  const { data: existingContent, isLoading } = trpc.admin.pageContent.getPage.useQuery({ page: "giveaway" });

  // Seed defaults mutation
  const seedMutation = trpc.admin.pageContent.seedDefaults.useMutation({
    onSuccess: (result) => {
      utils.admin.pageContent.getPage.invalidate({ page: "giveaway" });
      if (result.seeded > 0) {
        toast.success(`Seeded ${result.seeded} default content sections`);
      }
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = trpc.admin.pageContent.bulkUpdate.useMutation({
    onSuccess: () => {
      utils.admin.pageContent.getPage.invalidate({ page: "giveaway" });
      utils.public.pageContent.getPage.invalidate({ page: "giveaway" });
      toast.success("Page content saved successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to save content"),
  });

  // Local form state — keyed by sectionKey
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Seed defaults on first load if needed
  useEffect(() => {
    if (existingContent && !seedMutation.isPending) {
      const existingKeys = new Set(existingContent.map((c: any) => c.sectionKey));
      const needsSeeding = GIVEAWAY_DEFAULTS.some(d => !existingKeys.has(d.sectionKey));
      if (needsSeeding) {
        seedMutation.mutate({
          page: "giveaway",
          items: GIVEAWAY_DEFAULTS.map(d => ({
            sectionKey: d.sectionKey,
            content: d.content,
            label: d.label,
            groupName: d.groupName,
            sortOrder: d.sortOrder,
          })),
        });
      }
    }
  }, [existingContent]);

  // Populate form data from DB content
  useEffect(() => {
    if (existingContent) {
      const data: Record<string, string> = {};
      // Start with defaults
      for (const d of GIVEAWAY_DEFAULTS) {
        data[d.sectionKey] = d.content;
      }
      // Override with DB values
      for (const item of existingContent) {
        data[item.sectionKey] = item.content;
      }
      setFormData(data);
      setHasChanges(false);
    }
  }, [existingContent]);

  // Group sections for display
  const groups = useMemo(() => {
    const groupMap: Record<string, typeof GIVEAWAY_DEFAULTS> = {};
    for (const d of GIVEAWAY_DEFAULTS) {
      if (!groupMap[d.groupName]) groupMap[d.groupName] = [];
      groupMap[d.groupName].push(d);
    }
    return Object.entries(groupMap).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const items = GIVEAWAY_DEFAULTS.map(d => ({
      page: "giveaway" as const,
      sectionKey: d.sectionKey,
      content: formData[d.sectionKey] ?? d.content,
      label: d.label,
      groupName: d.groupName,
      sortOrder: d.sortOrder,
    }));
    bulkUpdateMutation.mutate({ items });
  };

  const handleReset = () => {
    if (existingContent) {
      const data: Record<string, string> = {};
      for (const d of GIVEAWAY_DEFAULTS) {
        data[d.sectionKey] = d.content;
      }
      for (const item of existingContent) {
        data[item.sectionKey] = item.content;
      }
      setFormData(data);
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading page content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Page Content Manager</h2>
          <p className="text-muted-foreground">Edit text and copy on your pages without touching code.</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset} disabled={bulkUpdateMutation.isPending}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Discard Changes
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || bulkUpdateMutation.isPending}>
            {bulkUpdateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-sm text-yellow-400 flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          You have unsaved changes. Click "Save All Changes" to publish them to the live site.
        </div>
      )}

      {/* Page Tabs */}
      <Tabs defaultValue="giveaway">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="giveaway" className="flex items-center gap-2">
            <Gift className="w-4 h-4" /> Giveaway Page
          </TabsTrigger>
        </TabsList>

        <TabsContent value="giveaway" className="space-y-6 mt-4">
          {groups.map((group) => (
            <Card key={group.name} className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {GROUP_ICONS[group.name] || <FileText className="w-4 h-4" />}
                  {group.name}
                </CardTitle>
                <CardDescription>
                  {group.name === "Hero Section" && "The main headline, description, and Whatnot link at the top of the page."}
                  {group.name === "Prizes" && "The four prize categories displayed below the hero section."}
                  {group.name === "Who We Are" && "Your company description and stats section."}
                  {group.name === "Too Good To Be True" && "The authenticity section that builds trust with visitors."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.sectionKey}>
                    <Label className="text-sm font-medium mb-1.5 block">
                      {item.label}
                      <Badge variant="outline" className="ml-2 text-xs opacity-60">
                        {item.sectionKey}
                      </Badge>
                    </Label>
                    {FIELD_TYPE_MAP[item.sectionKey] === "textarea" ? (
                      <Textarea
                        value={formData[item.sectionKey] ?? ""}
                        onChange={(e) => handleChange(item.sectionKey, e.target.value)}
                        rows={3}
                        className="font-mono text-sm"
                      />
                    ) : (
                      <Input
                        value={formData[item.sectionKey] ?? ""}
                        onChange={(e) => handleChange(item.sectionKey, e.target.value)}
                        className="font-mono text-sm"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
