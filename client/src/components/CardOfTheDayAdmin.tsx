/**
 * Card of the Day — Admin Panel Component
 * Supports all 3 sets: Marvel Mint, Studios Chrome, CBH50
 * Shows the 54-card rotation schedule with images, grades, and parallel info
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Image, Star, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Set color map
const SET_COLORS: Record<string, string> = {
  mint: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  comic_book_heroes: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  marvel_studios: "text-red-400 bg-red-500/10 border-red-500/20",
};

const SET_SHORT: Record<string, string> = {
  mint: "Mint",
  comic_book_heroes: "CBH50",
  marvel_studios: "Studios",
};

// ── Today Preview ─────────────────────────────────────────────────────────────
function TodayPreview() {
  const card = trpc.cardOfTheDay.getTodaysCard.useQuery();
  const data = card.data;

  if (card.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground text-sm">No data available.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {/* Card image */}
        <div className="w-32 h-44 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 bg-white/5">
          {data.frontImageUrl ? (
            <img src={data.frontImageUrl} alt={data.characterName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
              <Image className="w-6 h-6" />
              <span className="text-[10px]">No image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">{data.dateLabel}</p>
            <h3 className="text-lg font-bold">{data.characterName}</h3>
            {data.characterRealName && (
              <p className="text-sm text-muted-foreground">{data.characterRealName}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.cardNumber && (
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                {data.cardNumber}
              </Badge>
            )}
            {data.setName && (
              <Badge variant="outline" className={`text-xs ${SET_COLORS[data.setName] ?? ""}`}>
                {SET_SHORT[data.setName] ?? data.setName}
              </Badge>
            )}
            {(data as any).parallelType && (
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                {(data as any).parallelType}
              </Badge>
            )}
            {(data as any).printRun && (
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                /{(data as any).printRun}
              </Badge>
            )}
            {(data as any).cgcGrade && (
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                {(data as any).gradingCompany || "CGC"} {(data as any).cgcGrade}
              </Badge>
            )}
            {data.estimatedPrice && (
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                {data.estimatedPrice}
              </Badge>
            )}
          </div>
          {data.buzzNote && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
              {data.buzzNote}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="text-xs">
          <a href="/card-of-the-day" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3 mr-1.5" />
            View Live Page
          </a>
        </Button>
      </div>
    </div>
  );
}

// ── Edit Card Dialog ──────────────────────────────────────────────────────────
function EditCardDialog({ dateISO, characterName, currentImageUrl, onSaved }: {
  dateISO: string;
  characterName: string;
  currentImageUrl?: string | null;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl ?? "");
  const [price, setPrice] = useState("");
  const [buzzNote, setBuzzNote] = useState("");

  const utils = trpc.useUtils();
  const upsert = trpc.cardOfTheDay.upsertCard.useMutation({
    onSuccess: () => {
      toast.success("Card updated!");
      utils.cardOfTheDay.getRotationSchedule.invalidate();
      utils.cardOfTheDay.getTodaysCard.invalidate();
      setOpen(false);
      onSaved();
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });

  function handleSave() {
    upsert.mutate({
      date: dateISO,
      frontImageUrl: imageUrl.trim() || null,
      estimatedPrice: price.trim() || undefined,
      buzzNote: buzzNote.trim() || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
          <Edit2 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Edit: {characterName} ({dateISO})</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          <div>
            <Label className="text-xs">Card Image URL</Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or paste S3 URL"
              className="text-xs mt-1"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Upload photo to Google Drive → share → paste link, or send image to Manus for S3 upload
            </p>
          </div>
          <div>
            <Label className="text-xs">Estimated Value</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. ~$150–200"
              className="text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Buzz Note (optional)</Label>
            <Input
              value={buzzNote}
              onChange={(e) => setBuzzNote(e.target.value)}
              placeholder="Why is this card hot right now?"
              className="text-xs mt-1"
            />
          </div>
          <Button onClick={handleSave} disabled={upsert.isPending} className="w-full text-xs">
            {upsert.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Rotation Schedule ─────────────────────────────────────────────────────────
function RotationSchedule() {
  const utils = trpc.useUtils();
  const schedule = trpc.cardOfTheDay.getRotationSchedule.useQuery({ days: 54 });

  if (schedule.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const days = schedule.data ?? [];
  const withImages = days.filter((d) => !!(d as any).frontImageUrl).length;

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-lg font-bold text-primary">{days.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Cards</p>
        </div>
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-lg font-bold text-emerald-400">{withImages}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">With Images</p>
        </div>
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-lg font-bold text-amber-400">{days.length - withImages}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Need Images</p>
        </div>
      </div>

      {/* Set legend */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className={`text-[10px] ${SET_COLORS.comic_book_heroes}`}>CBH50 = Comic Book Heroes 50th</Badge>
        <Badge variant="outline" className={`text-[10px] ${SET_COLORS.marvel_studios}`}>Studios = Marvel Studios Chrome</Badge>
        <Badge variant="outline" className={`text-[10px] ${SET_COLORS.mint}`}>Mint = Marvel Mint</Badge>
      </div>

      <ScrollArea className="h-[480px] pr-2">
        <div className="space-y-1">
          {days.map((day) => {
            const hasImage = !!(day as any).frontImageUrl;
            const d = day as any;
            return (
              <div
                key={day.dateISO}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                  d.isToday
                    ? "border-primary/50 bg-primary/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                {/* Thumbnail */}
                <div className="w-8 h-10 rounded bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  {hasImage ? (
                    <img src={d.frontImageUrl} alt={day.characterName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AlertCircle className="w-3 h-3 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="w-14 flex-shrink-0">
                  <p className={`text-[10px] font-mono ${d.isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    {d.isToday ? "TODAY" : day.dateISO.slice(5)}
                  </p>
                </div>

                {/* Character + card info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{day.characterName}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {day.cardNumber && (
                      <span className="text-[10px] font-mono text-primary">{day.cardNumber}</span>
                    )}
                    {d.parallelType && (
                      <span className="text-[10px] text-amber-400/80 truncate max-w-[120px]">{d.parallelType}</span>
                    )}
                    {d.printRun && (
                      <span className="text-[10px] text-amber-400/60">/{d.printRun}</span>
                    )}
                    {d.cgcGrade && (
                      <span className="text-[10px] text-emerald-400">{d.gradingCompany || "CGC"} {d.cgcGrade}</span>
                    )}
                  </div>
                </div>

                {/* Set badge */}
                <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${SET_COLORS[day.setName] ?? ""}`}>
                  {SET_SHORT[day.setName] ?? day.setName}
                </Badge>

                {/* Image status + edit */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {hasImage ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400/60" />
                  )}
                  <EditCardDialog
                    dateISO={day.dateISO}
                    characterName={day.characterName}
                    currentImageUrl={d.frontImageUrl}
                    onSaved={() => utils.cardOfTheDay.getRotationSchedule.invalidate()}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export default function CardOfTheDayAdmin() {
  const schedule = trpc.cardOfTheDay.getRotationSchedule.useQuery({ days: 54 });
  const withImages = (schedule.data ?? []).filter((d) => !!(d as any).frontImageUrl).length;
  const total = schedule.data?.length ?? 54;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Card of the Day</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} cards across 3 sets — Marvel Mint · Studios Chrome · CBH50
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
            <Star className="w-3 h-3 mr-1" />
            {withImages}/{total} images
          </Badge>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <a href="/card-of-the-day" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1.5" />
              Live Page
            </a>
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="bg-white/5 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${total > 0 ? (withImages / total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          {withImages} of {total} card images uploaded
        </p>
      </div>

      <Tabs defaultValue="today">
        <TabsList className="bg-white/5">
          <TabsTrigger value="today">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Today
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          <TodayPreview />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <RotationSchedule />
        </TabsContent>
      </Tabs>

      {/* Help note */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300">
          <strong>To add or update a card image:</strong> Click the pencil icon next to any card in the schedule.
          Paste a Google Drive share link or any image URL. For best quality, send the photo to Manus and it will be
          uploaded to S3 automatically.
        </p>
      </div>
    </div>
  );
}
