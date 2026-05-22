import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  MessageCircle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
  Clock,
  User,
  MessageSquare,
  RotateCcw,
  Ban,
} from "lucide-react";

type TabType = "pending" | "approved" | "sent" | "rejected";

export default function CommentRepliesManager() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Queries
  const pendingReplies = trpc.commentReplies.list.useQuery({ status: "pending" });
  const approvedReplies = trpc.commentReplies.list.useQuery({ status: "approved" });
  const sentReplies = trpc.commentReplies.sentHistory.useQuery({ limit: 50 });
  const rejectedReplies = trpc.commentReplies.list.useQuery({ status: "rejected" });

  // Mutations
  const fetchNew = trpc.commentReplies.fetchNewComments.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Found ${data.newComments} new comments (${data.skipped} skipped) from ${data.postsChecked} posts`);
        pendingReplies.refetch();
      } else {
        toast.error(data.error || "Failed to fetch comments");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const generateReply = trpc.commentReplies.generateReply.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Reply generated!");
        pendingReplies.refetch();
      } else {
        toast.error(data.error || "Failed to generate reply");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const generateAll = trpc.commentReplies.generateAllReplies.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Generated ${data.generated} replies (${data.failed} failed)`);
        pendingReplies.refetch();
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const editReply = trpc.commentReplies.editReply.useMutation({
    onSuccess: () => {
      toast.success("Reply updated");
      setEditingId(null);
      pendingReplies.refetch();
      approvedReplies.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const approve = trpc.commentReplies.approve.useMutation({
    onSuccess: () => {
      toast.success("Reply approved!");
      pendingReplies.refetch();
      approvedReplies.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const reject = trpc.commentReplies.reject.useMutation({
    onSuccess: () => {
      toast.success("Reply rejected");
      pendingReplies.refetch();
      rejectedReplies.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const sendReply = trpc.commentReplies.sendReply.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Reply sent to Facebook!");
        approvedReplies.refetch();
        sentReplies.refetch();
      } else {
        toast.error(data.error || "Failed to send reply");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const sendAll = trpc.commentReplies.sendAllApproved.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Sent ${data.sent} replies (${data.failed} failed)`);
        approvedReplies.refetch();
        sentReplies.refetch();
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const regenerate = trpc.commentReplies.regenerateReply.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Reply regenerated!");
        pendingReplies.refetch();
        approvedReplies.refetch();
      } else {
        toast.error(data.error || "Failed to regenerate");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-blue-400 border-blue-400/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "sent":
        return <Badge variant="outline" className="text-green-400 border-green-400/30"><Send className="w-3 h-3 mr-1" /> Sent</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-400 border-red-400/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case "skipped":
        return <Badge variant="outline" className="text-gray-400 border-gray-400/30"><Ban className="w-3 h-3 mr-1" /> Skipped</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const renderCommentCard = (reply: any, showActions: boolean = true) => (
    <Card key={reply.id} className="bg-card/50 border-border/50">
      <CardContent className="p-4 space-y-3">
        {/* Original Comment */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{reply.commenterName}</span>
            <span>·</span>
            <span>{formatDate(reply.commentedAt)}</span>
            {getStatusBadge(reply.status)}
          </div>
          <div className="pl-5 text-sm bg-muted/30 rounded-md p-2 border-l-2 border-blue-500/50">
            <MessageSquare className="w-3.5 h-3.5 inline mr-1.5 text-blue-400" />
            {reply.commentText}
          </div>
        </div>

        {/* Generated Reply */}
        {reply.generatedReply && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> AI-Generated Reply:
            </div>
            {editingId === reply.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => editReply.mutate({ id: reply.id, reply: editText })}
                    disabled={editReply.isPending}
                  >
                    {editReply.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="pl-5 text-sm bg-primary/5 rounded-md p-2 border-l-2 border-primary/50">
                <MessageCircle className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                {reply.generatedReply}
              </div>
            )}
          </div>
        )}

        {/* Note (for rejected/skipped) */}
        {reply.note && (
          <div className="text-xs text-muted-foreground italic pl-5">
            Note: {reply.note}
          </div>
        )}

        {/* Reply ID (for sent) */}
        {reply.replyCommentId && (
          <div className="text-xs text-muted-foreground pl-5">
            Reply ID: {reply.replyCommentId} · Sent: {formatDate(reply.repliedAt)}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Generate reply if none exists */}
            {!reply.generatedReply && reply.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateReply.mutate({ id: reply.id })}
                disabled={generateReply.isPending}
              >
                {generateReply.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                Generate Reply
              </Button>
            )}

            {/* Edit button */}
            {reply.generatedReply && editingId !== reply.id && (reply.status === "pending" || reply.status === "approved") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditingId(reply.id); setEditText(reply.generatedReply || ""); }}
              >
                Edit
              </Button>
            )}

            {/* Regenerate */}
            {reply.generatedReply && (reply.status === "pending" || reply.status === "approved") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => regenerate.mutate({ id: reply.id })}
                disabled={regenerate.isPending}
              >
                {regenerate.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RotateCcw className="w-3 h-3 mr-1" />}
                Regenerate
              </Button>
            )}

            {/* Approve */}
            {reply.status === "pending" && reply.generatedReply && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => approve.mutate({ id: reply.id })}
                disabled={approve.isPending}
              >
                {approve.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                Approve
              </Button>
            )}

            {/* Send (only for approved) */}
            {reply.status === "approved" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => sendReply.mutate({ id: reply.id })}
                disabled={sendReply.isPending}
              >
                {sendReply.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                Send Reply
              </Button>
            )}

            {/* Reject */}
            {(reply.status === "pending" || reply.status === "approved") && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300"
                onClick={() => reject.mutate({ id: reply.id })}
                disabled={reject.isPending}
              >
                <XCircle className="w-3 h-3 mr-1" /> Reject
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const pendingCount = pendingReplies.data?.length || 0;
  const approvedCount = approvedReplies.data?.length || 0;
  const sentCount = sentReplies.data?.length || 0;
  const rejectedCount = rejectedReplies.data?.length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Comment Replies
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchNew.mutate()}
                disabled={fetchNew.isPending}
              >
                {fetchNew.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                Fetch New Comments
              </Button>
              {pendingCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateAll.mutate()}
                  disabled={generateAll.isPending}
                >
                  {generateAll.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                  Generate All Replies
                </Button>
              )}
              {approvedCount > 0 && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => sendAll.mutate()}
                  disabled={sendAll.isPending}
                >
                  {sendAll.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-4 h-4 mr-1" />}
                  Send All Approved ({approvedCount})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-4 border-b border-border pb-2">
            {([
              { key: "pending" as TabType, label: "Pending", count: pendingCount },
              { key: "approved" as TabType, label: "Approved", count: approvedCount },
              { key: "sent" as TabType, label: "Sent", count: sentCount },
              { key: "rejected" as TabType, label: "Rejected", count: rejectedCount },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label} {tab.count > 0 && <span className="ml-1 text-xs opacity-70">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-3">
            {activeTab === "pending" && (
              <>
                {pendingReplies.isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                  </div>
                ) : pendingCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No pending comments. Click "Fetch New Comments" to check.</p>
                  </div>
                ) : (
                  pendingReplies.data?.map(reply => renderCommentCard(reply))
                )}
              </>
            )}

            {activeTab === "approved" && (
              <>
                {approvedReplies.isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                  </div>
                ) : approvedCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No approved replies waiting to be sent.</p>
                  </div>
                ) : (
                  approvedReplies.data?.map(reply => renderCommentCard(reply))
                )}
              </>
            )}

            {activeTab === "sent" && (
              <>
                {sentReplies.isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                  </div>
                ) : sentCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No replies sent yet.</p>
                  </div>
                ) : (
                  sentReplies.data?.map(reply => renderCommentCard(reply, false))
                )}
              </>
            )}

            {activeTab === "rejected" && (
              <>
                {rejectedReplies.isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                  </div>
                ) : rejectedCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <XCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No rejected replies.</p>
                  </div>
                ) : (
                  rejectedReplies.data?.map(reply => renderCommentCard(reply, false))
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
