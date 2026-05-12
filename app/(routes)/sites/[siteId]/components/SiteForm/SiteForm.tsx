"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { Client, Platform, SiteStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const PLATFORMS: Platform[] = [
  "VERCEL",
  "RAILWAY",
  "NETLIFY",
  "RENDER",
  "HOSTINGER",
  "CLOUDFLARE",
  "HEROKU",
  "DIGITALOCEAN",
  "CUSTOM",
];

const STATUSES: SiteStatus[] = ["ACTIVE", "PAUSED", "DOWN", "MAINTENANCE"];

const formSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  clientId: z.string().min(1),
  platform: z.enum([
    "VERCEL",
    "RAILWAY",
    "NETLIFY",
    "RENDER",
    "HOSTINGER",
    "CLOUDFLARE",
    "HEROKU",
    "DIGITALOCEAN",
    "CUSTOM",
  ]),
  status: z.enum(["ACTIVE", "PAUSED", "DOWN", "MAINTENANCE"]),
  techStack: z.string().optional(),
  repositoryUrl: z.string().optional(),
  platformProjectId: z.string().optional(),
  description: z.string().optional(),
});

type PartialClient = Pick<
  Client,
  "id" | "firstName" | "lastName" | "businessName"
>;

type SiteFormData = {
  id: string;
  name: string;
  url: string;
  clientId: string;
  platform: Platform;
  status: SiteStatus;
  techStack: string | null;
  repositoryUrl: string | null;
  platformProjectId: string | null;
  description: string | null;
};

export function SiteForm({
  site,
  clients,
  trigger,
}: {
  site: SiteFormData;
  clients: PartialClient[];
  trigger: React.ReactNode;
}) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: site.name,
      url: site.url,
      clientId: site.clientId,
      platform: site.platform,
      status: site.status,
      techStack: site.techStack ?? "",
      repositoryUrl: site.repositoryUrl ?? "",
      platformProjectId: site.platformProjectId ?? "",
      description: site.description ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/site/${site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Site updated successfully" });
      setOpen(false);
      refresh();
    } catch {
      toast({ title: "Error updating site", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Site Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.businessName || `${c.firstName} ${c.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <Input placeholder="Next.js…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platformProjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Project ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
  );
}
