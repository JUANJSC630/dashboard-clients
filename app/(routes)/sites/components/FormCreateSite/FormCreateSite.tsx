"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Client } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const PLATFORMS = [
  "VERCEL",
  "RAILWAY",
  "NETLIFY",
  "RENDER",
  "HOSTINGER",
  "CLOUDFLARE",
  "HEROKU",
  "DIGITALOCEAN",
  "CUSTOM",
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  url: z.string().url("Must be a valid URL (include https://)"),
  clientId: z.string().min(1, "Select a client"),
  platform: z.enum(PLATFORMS),
  techStack: z.string().optional(),
  repositoryUrl: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^https?:\/\/.+/.test(v), {
      message: "Must be a valid URL",
    }),
});

type PartialClient = Pick<
  Client,
  "id" | "firstName" | "lastName" | "businessName"
>;

export function FormCreateSite({
  clients,
  onSuccess,
}: {
  clients: PartialClient[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      clientId: "",
      platform: "CUSTOM",
      techStack: "",
      repositoryUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/site", values);
      toast({ title: "Site created successfully" });
      form.reset();
      onSuccess?.();
      router.refresh();
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.businessName ?? `${c.firstName} ${c.lastName}`}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input placeholder="My Client Portfolio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
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
                  <Input placeholder="Next.js, Laravel…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/... (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create Site
        </Button>
      </form>
    </Form>
  );
}
