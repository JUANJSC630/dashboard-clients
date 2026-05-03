"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Contact } from "@prisma/client";
import { Plus, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

export function SiteContacts({
  contacts,
  siteId,
}: {
  contacts: Contact[];
  siteId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });

  const onAdd = async () => {
    try {
      await axios.post(`/api/site/${siteId}/contact`, form);
      toast({ title: "Contact added" });
      setForm({ name: "", role: "", email: "", phone: "" });
      setOpen(false);
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {open && (
        <div className="space-y-2 mb-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Button size="sm" className="w-full" onClick={onAdd}>
            Save Contact
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {contacts.length === 0 && (
          <p className="text-sm text-muted-foreground">No contacts yet.</p>
        )}
        {contacts.map((c) => (
          <div key={c.id}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <div className="flex gap-3">
                <a href={`tel:${c.phone}`}>
                  <Phone className="h-4 w-4 hover:text-green-500 transition-colors" />
                </a>
                <a href={`mailto:${c.email}`}>
                  <Mail className="h-4 w-4 hover:text-blue-500 transition-colors" />
                </a>
              </div>
            </div>
            <Separator className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
