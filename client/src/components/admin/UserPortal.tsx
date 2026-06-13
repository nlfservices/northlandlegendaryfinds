import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown, Shield, ShieldCheck, User, Users, Search,
  ChevronLeft, ChevronRight, AlertTriangle, Trash2, UserCog,
  UserPlus, Mail, Send, Clock, RotateCcw, X
} from "lucide-react";

// Role hierarchy config
const ROLE_CONFIG: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  level: number;
}> = {
  owner: {
    label: "Owner",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    icon: <Crown className="w-3.5 h-3.5" />,
    level: 100,
  },
  super_admin: {
    label: "Super Admin",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    level: 80,
  },
  admin: {
    label: "Admin",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    icon: <Shield className="w-3.5 h-3.5" />,
    level: 60,
  },
  subscriber: {
    label: "Subscriber",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    icon: <User className="w-3.5 h-3.5" />,
    level: 20,
  },
  user: {
    label: "User",
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/30",
    icon: <User className="w-3.5 h-3.5" />,
    level: 10,
  },
};

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.user;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.color} ${config.bgColor} ${config.borderColor}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

type UserRow = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  lastSignedIn: Date;
};

export default function UserPortal() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviteMessage, setInviteMessage] = useState("");
  const [showInvites, setShowInvites] = useState(false);

  const utils = trpc.useUtils();

  const { data: stats } = trpc.userManagement.stats.useQuery();
  const { data, isLoading } = trpc.userManagement.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter as any,
  });

  const assignRole = trpc.userManagement.assignRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated successfully");
      setRoleDialogOpen(false);
      setSelectedUser(null);
      utils.userManagement.list.invalidate();
      utils.userManagement.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const removeUser = trpc.userManagement.removeUser.useMutation({
    onSuccess: (res) => {
      toast.success(res.action === "deleted" ? "User deleted" : "User access revoked");
      setRemoveDialogOpen(false);
      setSelectedUser(null);
      utils.userManagement.list.invalidate();
      utils.userManagement.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const { data: pendingInvites, refetch: refetchInvites } = trpc.invites.list.useQuery();

  const sendInvite = trpc.invites.create.useMutation({
    onSuccess: (res) => {
      toast.success(res.message);
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteMessage("");
      refetchInvites();
    },
    onError: (err) => toast.error(err.message),
  });

  const revokeInvite = trpc.invites.revoke.useMutation({
    onSuccess: () => { toast.success("Invitation revoked"); refetchInvites(); },
    onError: (err) => toast.error(err.message),
  });

  const resendInvite = trpc.invites.resend.useMutation({
    onSuccess: (res) => { toast.success(res.message); refetchInvites(); },
    onError: (err) => toast.error(err.message),
  });

  const currentUserLevel = ROLE_CONFIG[currentUser?.role ?? "user"]?.level ?? 0;

  const canManage = (targetRole: string) => {
    if (targetRole === "owner") return false;
    const targetLevel = ROLE_CONFIG[targetRole]?.level ?? 0;
    return currentUserLevel > targetLevel;
  };

  const assignableRoles = Object.entries(ROLE_CONFIG)
    .filter(([role, cfg]) => role !== "owner" && cfg.level < currentUserLevel)
    .map(([role]) => role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            User Portal
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage user access and roles across the NLF platform</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-slate-400 hover:text-white border border-white/10"
            onClick={() => setShowInvites(v => !v)}
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Invites {pendingInvites && pendingInvites.filter(i => !i.accepted).length > 0 && (
              <span className="ml-1.5 bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
                {pendingInvites.filter(i => !i.accepted).length}
              </span>
            )}
          </Button>
          <Button
            size="sm"
            className="h-8 px-3 bg-primary hover:bg-primary/90 text-black font-semibold"
            onClick={() => setInviteDialogOpen(true)}
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["owner", "super_admin", "admin", "subscriber", "user"] as const).map(role => {
            const cfg = ROLE_CONFIG[role];
            const count = stats.byRole[role] ?? 0;
            return (
              <div
                key={role}
                className={`rounded-xl border p-3 cursor-pointer transition-all ${roleFilter === role ? `${cfg.bgColor} ${cfg.borderColor}` : "bg-white/3 border-white/8 hover:bg-white/5"}`}
                onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
              >
                <div className={`flex items-center gap-1.5 mb-1 ${cfg.color}`}>
                  {cfg.icon}
                  <span className="text-xs font-medium">{cfg.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{count}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search + filter bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            placeholder="Search by name or email..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
        </div>
        <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10">
            <SelectItem value="all">All roles</SelectItem>
            {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
              <SelectItem key={role} value={role}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* User table */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">User</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Last Sign In</th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-4 bg-white/5 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : data?.users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users found</td>
              </tr>
            ) : (
              data?.users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        {(u.name ?? u.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium flex items-center gap-1.5">
                          {u.name ?? "—"}
                          {u.role === "owner" && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
                        </div>
                        <div className="text-slate-500 text-xs">{u.email ?? u.openId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                    {new Date(u.lastSignedIn).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canManage(u.role) ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-slate-400 hover:text-white hover:bg-white/10"
                          onClick={() => {
                            setSelectedUser(u as UserRow);
                            setNewRole(u.role);
                            setRoleDialogOpen(true);
                          }}
                        >
                          <UserCog className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                          onClick={() => {
                            setSelectedUser(u as UserRow);
                            setRemoveDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, data.total)} of {data.total} users</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="h-8 px-3 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= data.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="h-8 px-3 text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Role assignment dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              Change Role
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Assign a new role to <strong className="text-white">{selectedUser?.name ?? selectedUser?.email}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                {assignableRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      {ROLE_CONFIG[role]?.icon}
                      <span>{ROLE_CONFIG[role]?.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRoleDialogOpen(false)} className="text-slate-400">Cancel</Button>
            <Button
              onClick={() => {
                if (selectedUser && newRole) {
                  assignRole.mutate({ userId: selectedUser.id, role: newRole as any });
                }
              }}
              disabled={assignRole.isPending || newRole === selectedUser?.role}
              className="bg-primary hover:bg-primary/90"
            >
              {assignRole.isPending ? "Saving..." : "Save Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending invites panel */}
      {showInvites && (
        <div className="rounded-xl border border-white/8 bg-white/2 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Pending Invitations
          </h3>
          {!pendingInvites || pendingInvites.filter(i => !i.accepted).length === 0 ? (
            <p className="text-sm text-slate-500">No pending invitations</p>
          ) : (
            <div className="space-y-2">
              {pendingInvites.filter(i => !i.accepted).map(invite => (
                <div key={invite.id} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/3 px-3 py-2">
                  <div>
                    <div className="text-sm text-white font-medium">{invite.email}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RoleBadge role={invite.role} />
                      <span className="text-xs text-slate-500">
                        Expires {new Date(invite.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-slate-400 hover:text-white"
                      onClick={() => resendInvite.mutate({ id: invite.id })}
                      disabled={resendInvite.isPending}
                      title="Resend invitation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-slate-400 hover:text-red-400"
                      onClick={() => revokeInvite.mutate({ id: invite.id })}
                      disabled={revokeInvite.isPending}
                      title="Revoke invitation"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite User dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Invite a User
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Send an email invitation with a pre-assigned role. The link expires in 7 days.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email Address</label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="bobby@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Role to Assign</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10">
                  {assignableRoles.map(role => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        {ROLE_CONFIG[role]?.icon}
                        <span>{ROLE_CONFIG[role]?.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Personal Message (optional)</label>
              <Textarea
                value={inviteMessage}
                onChange={e => setInviteMessage(e.target.value)}
                placeholder="Hey Bobby, I'm giving you access to the NLF admin dashboard..."
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-slate-600 mt-1">{inviteMessage.length}/500</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteDialogOpen(false)} className="text-slate-400">Cancel</Button>
            <Button
              onClick={() => {
                if (!inviteEmail) return toast.error("Please enter an email address");
                sendInvite.mutate({ email: inviteEmail, role: inviteRole as any, message: inviteMessage || undefined });
              }}
              disabled={sendInvite.isPending || !inviteEmail}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {sendInvite.isPending ? "Sending..." : (
                <><Send className="w-3.5 h-3.5 mr-1.5" />Send Invitation</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove user dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Remove User Access
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              What would you like to do with <strong className="text-white">{selectedUser?.name ?? selectedUser?.email}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="rounded-lg border border-white/8 p-3 bg-white/3">
              <p className="text-sm text-white font-medium">Revoke Access</p>
              <p className="text-xs text-slate-400 mt-0.5">Downgrade to basic user — they can still log in but lose all elevated permissions</p>
            </div>
            <div className="rounded-lg border border-red-400/20 p-3 bg-red-400/5">
              <p className="text-sm text-red-400 font-medium">Delete Account</p>
              <p className="text-xs text-slate-400 mt-0.5">Permanently remove this user from the database. This cannot be undone.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setRemoveDialogOpen(false)} className="text-slate-400">Cancel</Button>
            <Button
              variant="outline"
              onClick={() => selectedUser && removeUser.mutate({ userId: selectedUser.id, hardDelete: false })}
              disabled={removeUser.isPending}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Revoke Access
            </Button>
            <Button
              onClick={() => selectedUser && removeUser.mutate({ userId: selectedUser.id, hardDelete: true })}
              disabled={removeUser.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
