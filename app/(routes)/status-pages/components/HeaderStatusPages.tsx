"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Radio, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { SiteStatus } from "@prisma/client";

type SiteOption = {
  id: string;
  name: string;
  status: SiteStatus;
  url: string;
};

export function HeaderStatusPages({ sites }: { sites: SiteOption[] }) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
  });
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const toggleSite = (id: string) => {
    setSelectedSites((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    setForm((prev) => ({ ...prev, title, slug }));
  };

  const onCreate = async () => {
    if (!form.title || !form.slug || selectedSites.length === 0) {
      toast({ title: "Fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/status-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, siteIds: selectedSites }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      toast({ title: "Status page created" });
      setOpen(false);
      setForm({ title: "", slug: "", description: "" });
      setSelectedSites([]);
      refresh();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Radio className="size-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">Status Pages</h2>
          <p className="text-sm text-muted-foreground">
            Public status pages for your clients
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4 mr-2" />
            Create Status Page
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Status Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="My Company Status"
                value={form.title}
                onChange={(e) => handleSlug(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  /status/
                </span>
                <Input
                  placeholder="my-company"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Current status of our services"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Select sites to monitor</Label>
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {sites.map((site) => (
                  <label
                    key={site.id}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 border-b last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border accent-primary"
                      checked={selectedSites.includes(site.id)}
                      onChange={() => toggleSite(site.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {site.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {site.url}
                      </p>
                    </div>
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        site.status === "ACTIVE"
                          ? "bg-green-500"
                          : site.status === "DOWN"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                  </label>
                ))}
                {sites.length === 0 && (
                  <p className="text-sm text-muted-foreground px-3 py-4 text-center">
                    No sites yet. Create a site first.
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedSites.length} site{selectedSites.length !== 1 && "s"}{" "}
                selected
              </p>
            </div>
            <Button
              className="w-full"
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Status Page"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
