/**
 * GHL Comment Automation Manager
 * Shows conversations from GoHighLevel CRM (including Facebook comment threads)
 * Plus a setup guide for configuring the GHL workflow automation
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare, Users, ExternalLink, Search, RefreshCw,
  CheckCircle2, AlertCircle, Loader2, ChevronRight, Bot,
  Zap, Settings2, ArrowRight
} from "lucide-react";
import { useState } from "react";

// ==================== SETUP GUIDE ====================

function GHLSetupGuide() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 text-primary" />
          GHL Facebook Comment Automation Setup
        </CardTitle>
        <CardDescription>
          GoHighLevel handles all Facebook comment automation natively through Workflows.
          Follow these steps to set it up in your GHL dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
          <div>
            <h4 className="font-semibold mb-1">Connect Facebook Page</h4>
            <p className="text-sm text-muted-foreground mb-2">
              In GHL, go to <span className="font-mono text-xs bg-muted px-1 rounded">Settings → Integrations → Facebook</span> and connect your Northland Legendary Finds page.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
          <div>
            <h4 className="font-semibold mb-1">Create Comment Automation Workflow</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Go to <span className="font-mono text-xs bg-muted px-1 rounded">Automations → Workflows → Create Workflow</span>
            </p>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-2">
              <p><strong>Trigger:</strong> Facebook Comment(s) On A Post</p>
              <p className="pl-4">• Page Is: Northland Legendary Finds</p>
              <p className="pl-4">• Post Type: Published Post (all posts)</p>
              <p className="pl-4">• Track First Level Comments Only: ON</p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
          <div>
            <h4 className="font-semibold mb-1">Add AI Reply Action</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Add these actions to the workflow:
            </p>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-2">
              <p><strong>Action 1:</strong> ChatGPT by OpenAI (generate personalized reply)</p>
              <p className="pl-4">• System prompt: "You are replying as Northland Legendary Finds, a casual Marvel card collector community. Be friendly, knowledgeable, and community-focused. Never be corporate or pushy."</p>
              <p><strong>Action 2:</strong> Reply In Comments</p>
              <p className="pl-4">• Use the AI-generated response</p>
              <p className="pl-4">• Toggle ON: Also like the comment</p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
          <div>
            <h4 className="font-semibold mb-1">Optional: Send DM to Commenter</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Add a "Facebook Interactive Messenger" action to send a DM with buttons (e.g., "Join our community", "Check latest cards").
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</div>
          <div>
            <h4 className="font-semibold mb-1">Activate the Workflow</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Toggle the workflow to "Published" — GHL will now automatically reply to every new Facebook comment.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <Zap className="w-4 h-4 inline mr-1" />
            GHL auto-saves commenters as contacts in your CRM
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="https://app.gohighlevel.com" target="_blank" rel="noopener noreferrer">
              Open GHL Dashboard <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== CONVERSATIONS LIST ====================

function ConversationsList() {
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
              Recent Conversations
            </CardTitle>
            <CardDescription>
              Conversations from your GHL CRM (includes Facebook comment threads)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Error state */}
        {data?.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{data.error}</span>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Conversations list */}
        {!isLoading && data?.conversations && (
          <ScrollArea className="h-[400px]">
            {data.conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations found</p>
                <p className="text-xs mt-1">Conversations will appear here once GHL starts tracking Facebook comments</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {conv.fullName || conv.contactName || "Unknown Contact"}
                        </span>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs px-1.5 py-0">
                            {conv.unreadCount}
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
            )}
          </ScrollArea>
        )}

        {data?.total !== undefined && data.total > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Showing {data.conversations?.length || 0} of {data.total} conversations
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== CONTACTS LIST ====================

function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, refetch, isFetching } = trpc.ghl.getContacts.useQuery(
    { query: searchQuery || undefined, limit: 20 },
    { refetchOnWindowFocus: false }
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              CRM Contacts
            </CardTitle>
            <CardDescription>
              People who've interacted with your Facebook page (auto-saved by GHL)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Error state */}
        {data?.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{data.error}</span>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Contacts list */}
        {!isLoading && data?.contacts && (
          <ScrollArea className="h-[400px]">
            {data.contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No contacts found</p>
                <p className="text-xs mt-1">Contacts will appear here once GHL starts capturing Facebook commenters</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {contact.name || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unknown"}
                        </span>
                        {contact.source && (
                          <Badge variant="outline" className="text-xs">
                            {contact.source}
                          </Badge>
                        )}
                      </div>
                      {contact.email && (
                        <p className="text-xs text-muted-foreground mt-0.5">{contact.email}</p>
                      )}
                      {contact.tags && contact.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {contact.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{contact.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    {contact.lastActivity && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(contact.lastActivity).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}

        {data?.total !== undefined && data.total > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Showing {data.contacts?.length || 0} of {data.total} contacts
          </p>
        )}
      </CardContent>
    </Card>
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
            Comment Automation (GHL)
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Powered by GoHighLevel — auto-replies to Facebook comments, stores contacts in CRM
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

      {/* Tabs */}
      <Tabs defaultValue="guide" className="w-full">
        <TabsList>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <Settings2 className="w-4 h-4" /> Setup Guide
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> Conversations
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Users className="w-4 h-4" /> Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="mt-4">
          <GHLSetupGuide />
        </TabsContent>

        <TabsContent value="conversations" className="mt-4">
          {!statusData?.configured ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">GHL API credentials not configured.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Set GHL_API_KEY and GHL_LOCATION_ID in your environment to view conversations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ConversationsList />
          )}
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          {!statusData?.configured ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">GHL API credentials not configured.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Set GHL_API_KEY and GHL_LOCATION_ID in your environment to view contacts.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ContactsList />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
