/**
 * ApiKeysManager — Admin UI for managing NLF REST API keys
 * Features: create, list, revoke, view permissions, usage stats
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Activity, Shield, ExternalLink } from "lucide-react";

type Scope =
  | "cards:read"
  | "cards:write"
  | "sets:read"
  | "sets:write"
  | "articles:read"
  | "articles:write"
  | "artists:write"
  | "social:write"
  | "admin:read";

const ALL_PERMISSIONS: { id: Scope; label: string; description: string }[] = [
  { id: "cards:read", label: "Cards — Read", description: "List and view card data" },
  { id: "cards:write", label: "Cards — Write", description: "Update cards, upload images" },
  { id: "sets:read", label: "Sets — Read", description: "List and view card sets" },
  { id: "sets:write", label: "Sets — Write", description: "Create and update card sets" },
  { id: "articles:read", label: "Articles — Read", description: "List and view articles" },
  { id: "articles:write", label: "Articles — Write", description: "Create and update articles" },
  { id: "artists:write", label: "Artists — Write", description: "Upload artist portraits" },
  { id: "social:write", label: "Social — Write", description: "Create social post drafts" },
  { id: "admin:read", label: "Admin — Stats", description: "View site statistics" },
];

const PERMISSION_PRESETS: { name: string; description: string; permissions: Scope[] }[] = [
  {
    name: "Grok Image Uploader",
    description: "For AI image generation tools — upload card and artist images only",
    permissions: ["cards:read", "cards:write", "artists:write"],
  },
  {
    name: "Content Publisher",
    description: "Create and publish articles and social drafts",
    permissions: ["articles:read", "articles:write", "social:write"],
  },
  {
    name: "Read Only",
    description: "View all data, no write access",
    permissions: ["cards:read", "sets:read", "articles:read"],
  },
  {
    name: "Full Access",
    description: "All permissions — use with caution",
    permissions: ALL_PERMISSIONS.map((p) => p.id),
  },
];

export default function ApiKeysManager() {
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Scope[]>(["cards:read", "cards:write"]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [revokeId, setRevokeId] = useState<number | null>(null);
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);

  const { data: keys = [], refetch: refetchKeys } = trpc.apiKeys.list.useQuery();
  const { data: usageLogs = [] } = trpc.apiKeys.usageLogs.useQuery(
    { keyId: selectedKeyId! },
    { enabled: selectedKeyId !== null }
  );

  const createMutation = trpc.apiKeys.create.useMutation({
    onSuccess: (data) => {
      setCreatedKey(data.rawKey);
      setNewKeyName("");
      setSelectedPermissions(["cards:read", "cards:write"]);
      refetchKeys();
    },
    onError: (err) => toast.error(err.message),
  });

  const revokeMutation = trpc.apiKeys.revoke.useMutation({
    onSuccess: () => {
      toast.success("API key revoked");
      setRevokeId(null);
      refetchKeys();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!newKeyName.trim()) return toast.error("Key name is required");
    if (!selectedPermissions.length) return toast.error("Select at least one permission");
    createMutation.mutate({ name: newKeyName.trim(), permissions: selectedPermissions });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const togglePermission = (id: Scope) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const applyPreset = (name: string, permissions: Scope[]) => {
    setNewKeyName(name);
    setSelectedPermissions(permissions);
  };

  const activeKeys = Array.isArray(keys) ? keys.filter((k) => k.active) : [];
  const revokedKeys = Array.isArray(keys) ? keys.filter((k) => !k.active) : [];
  const allKeys = Array.isArray(keys) ? keys : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Key className="w-6 h-6 text-primary" />
            API Keys
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage access keys for the NLF REST API. Each key has scoped permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api-docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              API Docs
            </a>
          </Button>
          <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New API Key
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">{allKeys.length}</div>
            <div className="text-sm text-muted-foreground">Total Keys</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">{activeKeys.length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-400">{revokedKeys.length}</div>
            <div className="text-sm text-muted-foreground">Revoked</div>
          </CardContent>
        </Card>
      </div>

      {/* Keys table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Your API Keys</CardTitle>
          <CardDescription>
            Keys are shown as masked values. The full key is only shown once at creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allKeys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No API keys yet. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key (masked)</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allKeys.map((key) => {
                  const perms = typeof key.permissions === "string"
                    ? (key.permissions as string).split(",")
                    : (key.permissions as string[]) ?? [];
                  return (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {key.keyPrefix}••••••••
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {perms.slice(0, 3).map((p) => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {p}
                            </Badge>
                          ))}
                          {perms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{perms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.active ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Revoked</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {key.requestCount ?? 0}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedKeyId(selectedKeyId === key.id ? null : key.id)}
                            title="View usage"
                          >
                            <Activity className="w-4 h-4" />
                          </Button>
                          {key.active && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setRevokeId(key.id)}
                              title="Revoke key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Usage logs panel */}
      {selectedKeyId !== null && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Usage Logs — {allKeys.find((k) => k.id === selectedKeyId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!usageLogs.length ? (
              <p className="text-muted-foreground text-sm">No usage recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge
                          variant={log.method === "GET" ? "secondary" : "default"}
                          className="text-xs font-mono"
                        >
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            log.statusCode < 300
                              ? "bg-green-500/20 text-green-400"
                              : log.statusCode < 500
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }
                        >
                          {log.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.responseTimeMs ?? "—"}ms
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Key Dialog */}
      <Dialog
        open={showCreate && !createdKey}
        onOpenChange={(o) => {
          setShowCreate(o);
          if (!o) setCreatedKey(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Create New API Key
            </DialogTitle>
            <DialogDescription>
              Name your key and select what it can access. You'll only see the full key once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Grok Image Uploader"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="mb-2 block">Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSION_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.name, preset.permissions)}
                    className="text-left p-2 rounded border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <div className="text-sm font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Permissions</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {ALL_PERMISSIONS.map((perm) => (
                  <div key={perm.id} className="flex items-start gap-3">
                    <Checkbox
                      id={perm.id}
                      checked={selectedPermissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      className="mt-0.5"
                    />
                    <label htmlFor={perm.id} className="cursor-pointer">
                      <div className="text-sm font-medium">{perm.label}</div>
                      <div className="text-xs text-muted-foreground">{perm.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show Created Key Dialog */}
      <Dialog
        open={!!createdKey}
        onOpenChange={() => {
          setCreatedKey(null);
          setShowCreate(false);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <Key className="w-5 h-5" />
              API Key Created
            </DialogTitle>
            <DialogDescription>
              <strong className="text-yellow-400">Copy this key now.</strong> It will never be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="relative bg-muted rounded-lg p-4 font-mono text-sm break-all">
              {showKey ? createdKey : "•".repeat(createdKey?.length ?? 40)}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowKey((v) => !v)}>
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(createdKey!)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this key in the{" "}
              <code className="bg-muted px-1 rounded">X-API-Key</code> header of your requests.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded p-3 text-sm">
              <strong>For Grok:</strong> Paste this key into your "NLF - AI Card Maker" project
              instructions as:
              <br />
              <code className="text-xs">
                API_KEY: {createdKey?.substring(0, 20)}...
              </code>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => handleCopy(createdKey!)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Key
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCreatedKey(null);
                setShowCreate(false);
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={revokeId !== null} onOpenChange={() => setRevokeId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              This will immediately invalidate the key. Any tools using it will stop working. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => revokeId !== null && revokeMutation.mutate({ id: revokeId })}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
