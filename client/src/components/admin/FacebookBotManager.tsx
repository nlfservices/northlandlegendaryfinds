/**
 * FacebookBotManager — Admin UI for the Facebook Comment Bot
 *
 * Features:
 * - Enable/disable toggle
 * - Reply mode (auto vs review)
 * - Personality prompt editor
 * - Content index status + manual re-index button
 * - Reply log with approve/reject actions (review mode)
 * - Webhook setup instructions
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  Eye,
  EyeOff,
  MessageSquare,
  Play,
  RefreshCw,
  Send,
  Settings,
  ThumbsDown,
  ThumbsUp,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "Never";
  return new Date(d).toLocaleString();
}

function truncate(text: string, len: number): string {
  return text.length > len ? text.slice(0, len) + "…" : text;
}

export default function FacebookBotManager() {
  const utils = trpc.useUtils();

  // Settings state
  const { data: settings, isLoading: settingsLoading } =
    trpc.socialBot.getSettings.useQuery();

  const [personalityPrompt, setPersonalityPrompt] = useState<string>("");
  const [replyDelayMs, setReplyDelayMs] = useState<number>(30000);
  const [maxReplyLength, setMaxReplyLength] = useState<number>(280);
  const [replyWindowDays, setReplyWindowDays] = useState<number>(7);
  const [settingsInitialized, setSettingsInitialized] = useState(false);

  // Initialize local state from fetched settings
  if (settings && !settingsInitialized) {
    setPersonalityPrompt(settings.personalityPrompt || "");
    setReplyDelayMs(settings.replyDelayMs);
    setMaxReplyLength(settings.maxReplyLength);
    setReplyWindowDays(settings.replyWindowDays);
    setSettingsInitialized(true);
  }

  // Mutations
  const updateSettings = trpc.socialBot.updateSettings.useMutation({
    onSuccess: () => {
      utils.socialBot.getSettings.invalidate();
      toast.success("Bot settings saved");
    },
    onError: (err) => toast.error(`Failed to save: ${err.message}`),
  });

  const indexContent = trpc.socialBot.indexContent.useMutation({
    onSuccess: (result) => {
      utils.socialBot.getSettings.invalidate();
      utils.socialBot.getContentIndex.invalidate();
      toast.success(`Re-indexed ${result.indexed} articles`);
    },
    onError: (err) => toast.error(`Index failed: ${err.message}`),
  });

  // Reply log
  const [logFilter, setLogFilter] = useState<"all" | "sent" | "queued" | "skipped">("all");
  const { data: replyLog, isLoading: logLoading } =
    trpc.socialBot.getReplyLog.useQuery({ limit: 50, offset: 0, filter: logFilter });

  const approveReply = trpc.socialBot.approveReply.useMutation({
    onSuccess: () => {
      utils.socialBot.getReplyLog.invalidate();
      toast.success("Reply sent to Facebook!");
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  const rejectReply = trpc.socialBot.rejectReply.useMutation({
    onSuccess: () => {
      utils.socialBot.getReplyLog.invalidate();
      toast.success("Reply rejected");
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  const deleteLogEntry = trpc.socialBot.deleteLogEntry.useMutation({
    onSuccess: () => {
      utils.socialBot.getReplyLog.invalidate();
      toast.success("Log entry deleted");
    },
  });

  // Content index
  const { data: contentIndex, isLoading: indexLoading } =
    trpc.socialBot.getContentIndex.useQuery({ limit: 50, offset: 0 });

  // Monitored posts
  const { data: monitoredPosts, isLoading: postsLoading } =
    trpc.socialBot.getMonitoredPosts.useQuery({ limit: 50 });

  const togglePostMonitoring = trpc.socialBot.togglePostMonitoring.useMutation({
    onSuccess: () => {
      utils.socialBot.getMonitoredPosts.invalidate();
      toast.success("Post monitoring updated");
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  const pollNow = trpc.socialBot.pollNow.useMutation({
    onSuccess: (result) => {
      utils.socialBot.getMonitoredPosts.invalidate();
      utils.socialBot.getReplyLog.invalidate();
      toast.success(
        `Poll complete: ${result.postsChecked} posts, ${result.repliesSent} replied, ${result.repliesQueued} queued`
      );
    },
    onError: (err) => toast.error(`Poll failed: ${err.message}`),
  });

  // Expanded comment rows
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <RefreshCw className="w-4 h-4 animate-spin" />
        Loading bot settings…
      </div>
    );
  }

  const isEnabled = settings?.enabled ?? false;
  const replyMode = settings?.replyMode ?? "review";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Facebook Comment Bot</h2>
            <p className="text-sm text-muted-foreground">
              Auto-replies to fan comments using NLF's brand voice and site knowledge
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Active
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <XCircle className="w-3 h-3 mr-1" /> Disabled
            </Badge>
          )}
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) =>
              updateSettings.mutate({ enabled: checked })
            }
            disabled={updateSettings.isPending}
          />
        </div>
      </div>

      {/* Warning if auto mode */}
      {isEnabled && replyMode === "auto" && (
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            <strong>Auto mode is active.</strong> The bot will reply to comments immediately without your review. Switch to Review mode to approve replies before they post.
          </span>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </TabsTrigger>
          <TabsTrigger value="replies">
            <MessageSquare className="w-4 h-4 mr-2" />
            Reply Log
            {replyMode === "review" && replyLog?.filter(r => !r.sent && r.botReply && !r.skipReason).length ? (
              <Badge className="ml-2 bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                {replyLog.filter(r => !r.sent && r.botReply && !r.skipReason).length}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <Database className="w-4 h-4 mr-2" /> Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="posts">
            <Zap className="w-4 h-4 mr-2" /> Monitored Posts
            {monitoredPosts && monitoredPosts.filter(p => p.active).length > 0 && (
              <Badge className="ml-2 bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                {monitoredPosts.filter(p => p.active).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reply Mode */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Reply Mode</CardTitle>
                <CardDescription>
                  Auto sends replies immediately. Review queues them for your approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={replyMode}
                  onValueChange={(val) =>
                    updateSettings.mutate({ replyMode: val as "auto" | "review" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review">Review (queue for approval)</SelectItem>
                    <SelectItem value="auto">Auto (send immediately)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Reply Window */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Reply Window</CardTitle>
                <CardDescription>
                  Only reply to comments from the last N days.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={replyWindowDays}
                  onChange={(e) => setReplyWindowDays(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateSettings.mutate({ replyWindowDays })}
                  disabled={updateSettings.isPending}
                >
                  Save
                </Button>
              </CardContent>
            </Card>

            {/* Reply Delay */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Reply Delay</CardTitle>
                <CardDescription>
                  Wait this long before posting (makes replies feel more human).
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Input
                  type="number"
                  min={0}
                  max={300000}
                  step={5000}
                  value={replyDelayMs}
                  onChange={(e) => setReplyDelayMs(Number(e.target.value))}
                  className="w-28"
                />
                <span className="text-sm text-muted-foreground">ms ({Math.round(replyDelayMs / 1000)}s)</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateSettings.mutate({ replyDelayMs })}
                  disabled={updateSettings.isPending}
                >
                  Save
                </Button>
              </CardContent>
            </Card>

            {/* Max Reply Length */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Max Reply Length</CardTitle>
                <CardDescription>
                  Maximum characters per reply.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Input
                  type="number"
                  min={50}
                  max={1000}
                  value={maxReplyLength}
                  onChange={(e) => setMaxReplyLength(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">chars</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateSettings.mutate({ maxReplyLength })}
                  disabled={updateSettings.isPending}
                >
                  Save
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Personality Prompt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Custom Personality Prompt</CardTitle>
              <CardDescription>
                Optional additions to the bot's brand voice. The base NLF voice is already built in — use this for specific tweaks (e.g., "Always mention the Doomsday release date when relevant").
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={personalityPrompt}
                onChange={(e) => setPersonalityPrompt(e.target.value)}
                placeholder="e.g., Always be enthusiastic about Avengers Doomsday. Mention the December 18 release date when it's relevant."
                rows={4}
                maxLength={2000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {personalityPrompt.length}/2000 chars
                </span>
                <Button
                  size="sm"
                  onClick={() => updateSettings.mutate({ personalityPrompt })}
                  disabled={updateSettings.isPending}
                >
                  Save Prompt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Last indexed */}
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Database className="w-4 h-4" />
            Knowledge base last indexed: {formatDate(settings?.lastIndexedAt)}
          </div>
        </TabsContent>

        {/* REPLY LOG TAB */}
        <TabsContent value="replies" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {(["all", "queued", "sent", "skipped"] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={logFilter === f ? "default" : "outline"}
                  onClick={() => setLogFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => utils.socialBot.getReplyLog.invalidate()}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>

          {logLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : !replyLog || replyLog.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No replies logged yet.</p>
              <p className="text-sm mt-1">
                {isEnabled
                  ? "The bot will log replies here as comments come in."
                  : "Enable the bot to start processing comments."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {replyLog.map((entry) => {
                const isQueued = !entry.sent && !!entry.botReply && !entry.skipReason;
                const isExpanded = expandedRows.has(entry.id);

                return (
                  <Card
                    key={entry.id}
                    className={`border ${
                      isQueued
                        ? "border-amber-500/30 bg-amber-500/5"
                        : entry.sent
                        ? "border-green-600/20"
                        : "border-border"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {entry.sent ? (
                              <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                                <Send className="w-3 h-3 mr-1" /> Sent
                              </Badge>
                            ) : isQueued ? (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                Pending Review
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                Skipped
                              </Badge>
                            )}
                            <span className="text-sm font-medium">
                              {entry.commenterName || "Anonymous"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(entry.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Comment: </span>
                            {truncate(entry.commentText, 120)}
                          </p>
                          {entry.botReply && (
                            <p className="text-sm mt-1">
                              <span className="font-medium text-blue-400">Bot reply: </span>
                              {isExpanded
                                ? entry.botReply
                                : truncate(entry.botReply, 120)}
                            </p>
                          )}
                          {entry.skipReason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reason: {entry.skipReason}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {entry.botReply && entry.botReply.length > 120 && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => toggleRow(entry.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          {isQueued && (
                            <>
                              <Button
                                size="sm"
                                className="h-7 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => approveReply.mutate({ logId: entry.id })}
                                disabled={approveReply.isPending}
                              >
                                <ThumbsUp className="w-3 h-3 mr-1" /> Send
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-red-600/30 text-red-400 hover:bg-red-600/10"
                                onClick={() => rejectReply.mutate({ logId: entry.id })}
                                disabled={rejectReply.isPending}
                              >
                                <ThumbsDown className="w-3 h-3 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-red-400"
                            onClick={() => deleteLogEntry.mutate({ logId: entry.id })}
                            disabled={deleteLogEntry.isPending}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* KNOWLEDGE BASE TAB */}
        <TabsContent value="knowledge" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Site Knowledge Base</h3>
              <p className="text-sm text-muted-foreground">
                {contentIndex?.length ?? 0} articles indexed — last updated{" "}
                {formatDate(settings?.lastIndexedAt)}
              </p>
            </div>
            <Button
              onClick={() => indexContent.mutate()}
              disabled={indexContent.isPending}
            >
              {indexContent.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Re-index All Articles
            </Button>
          </div>

          {indexLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : !contentIndex || contentIndex.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No articles indexed yet.</p>
              <Button
                className="mt-3"
                onClick={() => indexContent.mutate()}
                disabled={indexContent.isPending}
              >
                Index Articles Now
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Indexed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentIndex.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{entry.title}</p>
                        <p className="text-xs text-muted-foreground">
                          /{entry.articleSlug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {entry.category?.replace(/_/g, " ") || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {((entry.tags as string[]) || []).slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {((entry.tags as string[]) || []).length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{((entry.tags as string[]) || []).length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(entry.indexedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* MONITORED POSTS TAB */}
        <TabsContent value="posts" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Monitored Facebook Posts</h3>
              <p className="text-sm text-muted-foreground">
                Every post published from this admin is automatically tracked here.
                The bot polls each post for new comments every 5 minutes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => utils.socialBot.getMonitoredPosts.invalidate()}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => pollNow.mutate()}
                disabled={pollNow.isPending || !isEnabled}
                title={!isEnabled ? "Enable the bot first" : "Poll all posts for new comments now"}
              >
                {pollNow.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Poll Now
              </Button>
            </div>
          </div>

          {/* How it works banner */}
          <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm mb-4">
            <Zap className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              <strong>Fully automated.</strong> When you publish a post to Facebook, it's instantly registered here.
              The bot checks for new comments every 5 minutes and replies automatically (or queues for review).
              No webhook setup needed.
            </span>
          </div>

          {postsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : !monitoredPosts || monitoredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No posts monitored yet.</p>
              <p className="text-sm mt-1">
                Publish a post to Facebook from the Social tab — it will appear here automatically.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Last Polled</TableHead>
                  <TableHead className="text-center">Comments</TableHead>
                  <TableHead className="text-center">Replies</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monitoredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm font-medium truncate">
                          {post.postSummary ? post.postSummary.slice(0, 80) + (post.postSummary.length > 80 ? "…" : "") : post.fbPostId}
                        </p>
                        {post.articleSlug && (
                          <p className="text-xs text-muted-foreground">/{post.articleSlug}</p>
                        )}
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{post.fbPostId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(post.lastPolledAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">{post.commentCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs text-green-400 border-green-600/30">{post.replyCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        title={post.active ? "Monitoring active — click to pause" : "Monitoring paused — click to resume"}
                        onClick={() =>
                          togglePostMonitoring.mutate({ postId: post.id, active: !post.active })
                        }
                        disabled={togglePostMonitoring.isPending}
                      >
                        {post.active ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
