/**
 * GHL Dashboard — Full GoHighLevel integration for NLF admin
 * Features: Social Planner (compose/schedule posts), Contact Management (tags, notes),
 * Conversations viewer, and Setup Guide
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare, Users, ExternalLink, Search, RefreshCw,
  CheckCircle2, AlertCircle, Loader2, ChevronRight, Bot,
  Zap, Settings2, Send, Calendar, Image, Hash,
  Plus, Tag, StickyNote, Workflow, Globe
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ==================== SOCIAL PLANNER ====================

function SocialPlannerTab() {
  const [postContent, setPostContent] = useState("");
  const [followUpComment, setFollowUpComment] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [postStatus, setPostStatus] = useState<"published" | "scheduled" | "draft">("draft");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");

  const { data: accountsData, isLoading: accountsLoading } = trpc.ghl.getSocialAccounts.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  );
  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = trpc.ghl.getSocialPosts.useQuery(
    { limit: 20 },
    { refetchOnWindowFocus: false }
  );

  const createPostMutation = trpc.ghl.createSocialPost.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Post created successfully!");
        setPostContent("");
        setFollowUpComment("");
        setScheduleDate("");
        setSelectedAccounts([]);
        setMediaUrl("");
        refetchPosts();
      } else {
        toast.error(data.error || "Failed to create post");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const deletePostMutation = trpc.ghl.deleteSocialPost.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Post deleted");
        refetchPosts();
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    },
  });

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast.error("Post content is required");
      return;
    }
    if (selectedAccounts.length === 0) {
      toast.error("Select at least one social account");
      return;
    }
    if (postStatus === "scheduled" && !scheduleDate) {
      toast.error("Schedule date is required for scheduled posts");
      return;
    }

    createPostMutation.mutate({
      accountIds: selectedAccounts,
      summary: postContent,
      status: postStatus,
      scheduleDate: scheduleDate || undefined,
      followUpComment: followUpComment || undefined,
      media: mediaUrl ? [{ url: mediaUrl, type: "image" as const }] : undefined,
      type: "post",
    });
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Compose Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Compose Post
          </CardTitle>
          <CardDescription>
            Create and schedule posts to Facebook & Instagram via GHL Social Planner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Account Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Accounts</label>
            {accountsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading accounts...
              </div>
            ) : accountsData?.accounts && accountsData.accounts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {accountsData.accounts.map((account) => (
                  <Button
                    key={account.id}
                    variant={selectedAccounts.includes(account.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAccount(account.id)}
                    className="text-xs"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    {account.name || account.type}
                    {account.type && (
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                        {account.type}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No social accounts connected. Connect Facebook/Instagram in GHL Settings → Social Planner.
              </p>
            )}
            {accountsData?.error && (
              <p className="text-sm text-destructive mt-1">{accountsData.error}</p>
            )}
          </div>

          {/* Post Content */}
          <div>
            <label className="text-sm font-medium mb-2 block">Post Content</label>
            <Textarea
              placeholder="What's happening in the Marvel collecting world? Share news, ask questions, engage your community..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {postContent.length}/5000 characters • Remember: link to /mcu-news, /movies-series, /marvel-characters, or /about
            </p>
          </div>

          {/* Media URL */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
              <Image className="w-4 h-4" /> Image URL (optional)
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
          </div>

          {/* Follow-up Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
              <Hash className="w-4 h-4" /> Follow-up Comment (optional)
            </label>
            <Input
              placeholder="Add hashtags or engagement prompt as first comment..."
              value={followUpComment}
              onChange={(e) => setFollowUpComment(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Posted as a comment right after the main post (great for hashtags)
            </p>
          </div>

          {/* Status & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Post Status</label>
              <Select value={postStatus} onValueChange={(v) => setPostStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="scheduled">Schedule</SelectItem>
                  <SelectItem value="published">Publish Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {postStatus === "scheduled" && (
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Schedule Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleCreatePost}
            disabled={createPostMutation.isPending || !postContent.trim() || selectedAccounts.length === 0}
            className="w-full"
          >
            {createPostMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {postStatus === "published" ? "Publish Now" : postStatus === "scheduled" ? "Schedule Post" : "Save Draft"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Posts</CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetchPosts()}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : postsData?.posts && postsData.posts.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {postsData.posts.map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{post.summary || "(No content)"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              post.status === "published" ? "default" :
                              post.status === "scheduled" ? "secondary" :
                              post.status === "failed" ? "destructive" : "outline"
                            }
                            className="text-xs"
                          >
                            {post.status}
                          </Badge>
                          {post.scheduleDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.scheduleDate).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deletePostMutation.mutate({ postId: post.id })}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No posts yet</p>
              <p className="text-xs mt-1">Create your first post above</p>
            </div>
          )}
          {postsData?.error && (
            <p className="text-sm text-destructive mt-2">{postsData.error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== CONTACT MANAGEMENT ====================

function ContactManagementTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newNote, setNewNote] = useState("");

  const { data: contactsData, isLoading, refetch, isFetching } = trpc.ghl.listContacts.useQuery(
    { query: searchQuery || undefined, tag: tagFilter || undefined, limit: 30 },
    { refetchOnWindowFocus: false }
  );

  const { data: contactDetails } = trpc.ghl.getContactDetails.useQuery(
    { contactId: selectedContact! },
    { enabled: !!selectedContact, refetchOnWindowFocus: false }
  );

  const { data: contactNotes, refetch: refetchNotes } = trpc.ghl.getContactNotes.useQuery(
    { contactId: selectedContact! },
    { enabled: !!selectedContact, refetchOnWindowFocus: false }
  );

  const addTagMutation = trpc.ghl.addContactTags.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Tag added!");
        setNewTag("");
        refetch();
      } else {
        toast.error(data.error || "Failed to add tag");
      }
    },
  });

  const removeTagMutation = trpc.ghl.removeContactTags.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Tag removed");
        refetch();
      } else {
        toast.error(data.error || "Failed to remove tag");
      }
    },
  });

  const addNoteMutation = trpc.ghl.addContactNote.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Note added!");
        setNewNote("");
        refetchNotes();
      } else {
        toast.error(data.error || "Failed to add note");
      }
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Contact List */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contacts ({contactsData?.total || 0})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Input
                placeholder="Filter by tag..."
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-40"
              />
            </div>

            {/* Contacts */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                {contactsData?.contacts && contactsData.contacts.length > 0 ? (
                  <div className="space-y-2">
                    {contactsData.contacts.map((contact: any) => (
                      <div
                        key={contact.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedContact === contact.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedContact(contact.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-sm">
                              {contact.contactName || contact.firstName || contact.email || "Unknown"}
                            </span>
                            {contact.email && (
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        {contact.tags && contact.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {contact.tags.slice(0, 4).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {contact.tags.length > 4 && (
                              <span className="text-[10px] text-muted-foreground">+{contact.tags.length - 4}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No contacts found</p>
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Detail Panel */}
      <div>
        {selectedContact && contactDetails?.contact ? (
          <div className="space-y-4">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {contactDetails.contact.contactName || contactDetails.contact.firstName || "Contact"}
                </CardTitle>
                <CardDescription>
                  {contactDetails.contact.email || "No email"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {contactDetails.contact.phone && (
                  <p><strong>Phone:</strong> {contactDetails.contact.phone}</p>
                )}
                {contactDetails.contact.source && (
                  <p><strong>Source:</strong> {contactDetails.contact.source}</p>
                )}
                {contactDetails.contact.dateAdded && (
                  <p><strong>Added:</strong> {new Date(contactDetails.contact.dateAdded).toLocaleDateString()}</p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {contactDetails.contact.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs pr-1">
                      {tag}
                      <button
                        className="ml-1 hover:text-destructive"
                        onClick={() => removeTagMutation.mutate({ contactId: selectedContact!, tags: [tag] })}
                      >
                        ×
                      </button>
                    </Badge>
                  )) || <span className="text-xs text-muted-foreground">No tags</span>}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="text-sm h-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTag.trim()) {
                        addTagMutation.mutate({ contactId: selectedContact!, tags: [newTag.trim()] });
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => {
                      if (newTag.trim()) {
                        addTagMutation.mutate({ contactId: selectedContact!, tags: [newTag.trim()] });
                      }
                    }}
                    disabled={addTagMutation.isPending}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                {/* Quick tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {["marvel-fan", "collector", "buyer", "subscriber", "vip"].map((qt) => (
                    <Button
                      key={qt}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => addTagMutation.mutate({ contactId: selectedContact!, tags: [qt] })}
                    >
                      + {qt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <StickyNote className="w-4 h-4" /> Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-sm h-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newNote.trim()) {
                        addNoteMutation.mutate({ contactId: selectedContact!, body: newNote.trim() });
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => {
                      if (newNote.trim()) {
                        addNoteMutation.mutate({ contactId: selectedContact!, body: newNote.trim() });
                      }
                    }}
                    disabled={addNoteMutation.isPending}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <ScrollArea className="h-[150px]">
                  {contactNotes?.notes && contactNotes.notes.length > 0 ? (
                    <div className="space-y-2">
                      {contactNotes.notes.map((note: any) => (
                        <div key={note.id} className="p-2 bg-muted/50 rounded text-xs">
                          <p>{note.body}</p>
                          {note.dateAdded && (
                            <p className="text-muted-foreground mt-1">
                              {new Date(note.dateAdded).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No notes yet</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">Select a contact to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ==================== CONVERSATIONS ====================

function ConversationsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, refetch, isFetching } = trpc.ghl.searchConversations.useQuery(
    { query: searchQuery || undefined, limit: 20 },
    { refetchOnWindowFocus: false }
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversations
            </CardTitle>
            <CardDescription>
              All conversations from GHL CRM (Facebook comments, DMs, SMS, etc.)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {data?.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{data.error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            {data?.conversations && data.conversations.length > 0 ? (
              <div className="space-y-2">
                {data.conversations.map((conv: any) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {conv.fullName || conv.contactName || "Unknown Contact"}
                        </span>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs px-1.5 py-0">
                            {conv.unreadCount}
                          </Badge>
                        )}
                        {conv.type && (
                          <Badge variant="outline" className="text-[10px]">
                            {conv.type}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.lastMessageBody || "No messages"}
                      </p>
                      {conv.lastMessageDate && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(conv.lastMessageDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations found</p>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== SETUP GUIDE ====================

function GHLSetupGuide() {
  return (
    <div className="space-y-6">
      {/* Comment Automation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 text-primary" />
            Facebook Comment Automation
          </CardTitle>
          <CardDescription>
            Set up automatic AI replies to Facebook comments in your GHL dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold mb-1">Connect Facebook Page</h4>
              <p className="text-sm text-muted-foreground">
                GHL → Settings → Integrations → Facebook → Connect "Northland Legendary Finds"
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold mb-1">Create Workflow</h4>
              <p className="text-sm text-muted-foreground">
                Automations → Workflows → Trigger: "Facebook Comment(s) On A Post"
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold mb-1">Add AI Reply + DM Actions</h4>
              <p className="text-sm text-muted-foreground">
                ChatGPT action → Reply In Comments → Optional: Send DM with buttons
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Workflow className="w-5 h-5" />
            NLF → GHL Workflow Triggers
          </CardTitle>
          <CardDescription>
            These NLF events automatically trigger GHL workflows when configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">New Subscriber</p>
                <p className="text-xs text-muted-foreground">When someone subscribes via the website</p>
              </div>
              <Badge variant="secondary">Auto-tagged: website-subscriber</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Repack Purchase</p>
                <p className="text-xs text-muted-foreground">When a customer buys a repack</p>
              </div>
              <Badge variant="secondary">Auto-tagged: buyer</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Loyalty Signup</p>
                <p className="text-xs text-muted-foreground">When someone joins the loyalty program</p>
              </div>
              <Badge variant="secondary">Auto-tagged: loyalty-member</Badge>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            <Zap className="w-4 h-4 inline mr-1" />
            Create workflows in GHL triggered by these tags to automate follow-up sequences, welcome emails, and nurture campaigns.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://app.gohighlevel.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> GHL Dashboard
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://app.gohighlevel.com/v2/location/conversations" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="w-4 h-4 mr-2" /> GHL Conversations
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://app.gohighlevel.com/v2/location/contacts" target="_blank" rel="noopener noreferrer">
                <Users className="w-4 h-4 mr-2" /> GHL Contacts
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://app.gohighlevel.com/v2/location/automation/workflows" target="_blank" rel="noopener noreferrer">
                <Workflow className="w-4 h-4 mr-2" /> GHL Workflows
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function GHLCommentManager() {
  const { data: statusData, isLoading: statusLoading } = trpc.ghl.status.useQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            GHL Command Center
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Social Planner • Contact Management • Workflow Automation • Conversations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {statusLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : statusData?.configured ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" /> Not Configured
            </Badge>
          )}
          <Button variant="outline" size="sm" asChild>
            <a href="https://app.gohighlevel.com" target="_blank" rel="noopener noreferrer">
              Open GHL <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="social" className="flex items-center gap-1">
            <Send className="w-4 h-4" /> Social Planner
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Users className="w-4 h-4" /> Contacts
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> Conversations
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-1">
            <Settings2 className="w-4 h-4" /> Setup & Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="mt-4">
          {!statusData?.configured ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">GHL API credentials not configured.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Set GHL_API_KEY and GHL_LOCATION_ID to use the Social Planner.
                </p>
              </CardContent>
            </Card>
          ) : (
            <SocialPlannerTab />
          )}
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          {!statusData?.configured ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">GHL API credentials not configured.</p>
              </CardContent>
            </Card>
          ) : (
            <ContactManagementTab />
          )}
        </TabsContent>

        <TabsContent value="conversations" className="mt-4">
          {!statusData?.configured ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">GHL API credentials not configured.</p>
              </CardContent>
            </Card>
          ) : (
            <ConversationsTab />
          )}
        </TabsContent>

        <TabsContent value="setup" className="mt-4">
          <GHLSetupGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
