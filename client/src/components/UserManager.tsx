/**
 * User Manager - Admin component for managing users, roles, and activity logs
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Users, Shield, Crown, UserX, UserCheck, Search, ChevronDown, ChevronUp,
  Activity, Clock, Mail, Globe, Loader2, AlertTriangle, Eye
} from "lucide-react";
import { useState, useMemo } from "react";

type UserRole = "free" | "subscriber" | "admin";

const ROLE_LABELS: Record<UserRole, string> = {
  free: "Free",
  subscriber: "Subscriber",
  admin: "Admin",
};

const ROLE_COLORS: Record<UserRole, string> = {
  free: "bg-zinc-700 text-zinc-300",
  subscriber: "bg-green-900/50 text-green-400 border-green-700",
  admin: "bg-orange-900/50 text-orange-400 border-orange-700",
};

const ROLE_ICONS: Record<UserRole, typeof Users> = {
  free: Users,
  subscriber: Crown,
  admin: Shield,
};

function formatDate(date: Date | string | null): string {
  if (!date) return "Never";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "Never";
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export default function UserManager() {
  const { data, isLoading } = trpc.admin.users.list.useQuery();
  const updateRole = trpc.admin.users.updateRole.useMutation();
  const toggleActive = trpc.admin.users.toggleActive.useMutation();
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole>("free");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [pendingDeactivateId, setPendingDeactivateId] = useState<number | null>(null);
  const [pendingDeactivateActive, setPendingDeactivateActive] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter(u => {
      const matchesSearch = !search ||
        (u.name?.toLowerCase().includes(search.toLowerCase())) ||
        (u.email?.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [data?.users, search, roleFilter, statusFilter]);

  const handleRoleChange = async () => {
    if (!pendingUserId || !pendingRole) return;
    try {
      await updateRole.mutateAsync({ userId: pendingUserId, newRole: pendingRole });
      toast.success(`Role updated to ${ROLE_LABELS[pendingRole]}`);
      utils.admin.users.list.invalidate();
      setShowRoleDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const handleToggleActive = async () => {
    if (!pendingDeactivateId) return;
    try {
      await toggleActive.mutateAsync({ userId: pendingDeactivateId, isActive: pendingDeactivateActive });
      toast.success(pendingDeactivateActive ? "Account activated" : "Account deactivated");
      utils.admin.users.list.invalidate();
      setShowDeactivateDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const roleCounts = data?.roleCounts ?? [];
  const totalUsers = data?.users?.length ?? 0;
  const activeUsers = data?.users?.filter(u => u.isActive).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {roleCounts.map(rc => {
          const role = rc.role as UserRole;
          const Icon = ROLE_ICONS[role] ?? Users;
          return (
            <Card key={role} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{rc.count}</p>
                    <p className="text-xs text-muted-foreground">{ROLE_LABELS[role] ?? role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="subscriber">Subscriber</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user roles, access, and activity</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Login Method</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Active</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="text-right p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-sm">{user.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className={ROLE_COLORS[user.role as UserRole] ?? ""}>
                        {ROLE_LABELS[user.role as UserRole] ?? user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {user.isActive ? (
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-700">
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground capitalize">{user.loginMethod || "—"}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{formatRelativeTime(user.lastSignedIn)}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                          className="h-8 px-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPendingUserId(user.id);
                            setPendingRole(user.role as UserRole);
                            setShowRoleDialog(true);
                          }}
                          className="h-8 px-2"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPendingDeactivateId(user.id);
                            setPendingDeactivateActive(!user.isActive);
                            setShowDeactivateDialog(true);
                          }}
                          className={`h-8 px-2 ${user.isActive ? "hover:text-red-400" : "hover:text-green-400"}`}
                        >
                          {user.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail / Activity Log Panel */}
      {selectedUserId && <UserDetailPanel userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select the new role for this user. They will be notified via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={pendingRole} onValueChange={(v) => setPendingRole(v as UserRole)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Free — Basic access
                  </div>
                </SelectItem>
                <SelectItem value="subscriber">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-green-400" /> Subscriber — Premium access
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-400" /> Admin — Full control
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={updateRole.isPending}>
              {updateRole.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Activate Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingDeactivateActive ? (
                <><UserCheck className="w-5 h-5 text-green-400" /> Activate Account</>
              ) : (
                <><AlertTriangle className="w-5 h-5 text-red-400" /> Deactivate Account</>
              )}
            </DialogTitle>
            <DialogDescription>
              {pendingDeactivateActive
                ? "This will re-enable the user's access to the site."
                : "This will immediately revoke the user's access. They will be logged out and unable to sign in until reactivated."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>Cancel</Button>
            <Button
              variant={pendingDeactivateActive ? "default" : "destructive"}
              onClick={handleToggleActive}
              disabled={toggleActive.isPending}
            >
              {toggleActive.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {pendingDeactivateActive ? "Activate" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** User Detail Panel with Activity Logs */
function UserDetailPanel({ userId, onClose }: { userId: number; onClose: () => void }) {
  const { data, isLoading } = trpc.admin.users.getById.useQuery({ id: userId });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { user, activityLogs } = data;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{user.name || "Unknown User"}</CardTitle>
            <CardDescription>{user.email || "No email"}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Role</p>
            <Badge variant="outline" className={ROLE_COLORS[user.role as UserRole] ?? ""}>
              {ROLE_LABELS[user.role as UserRole] ?? user.role}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Badge variant="outline" className={user.isActive ? "bg-green-900/30 text-green-400 border-green-700" : "bg-red-900/30 text-red-400 border-red-700"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Login Method</p>
            <p className="text-sm capitalize">{user.loginMethod || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Last Active</p>
            <p className="text-sm">{formatRelativeTime(user.lastSignedIn)}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Activity Log
          </h3>
          {activityLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No activity recorded yet.</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {activityLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20">
                    <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                      <Activity className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {(log.action as string).replace(/_/g, " ")}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(() => {
                            try {
                              const d = JSON.parse(log.details);
                              return Object.entries(d).map(([k, v]) => `${k}: ${v}`).join(" · ");
                            } catch {
                              return log.details;
                            }
                          })()}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDate(log.createdAt)}
                        </span>
                        {log.ipAddress && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {log.ipAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
