"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { Contact } from "@prisma/client";
import { Plus, Mail, Phone, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";

export function SiteContacts({
  contacts,
  siteId,
}: {
  contacts: Contact[];
  siteId: string;
}) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });

  const onAdd = async () => {
    try {
      const res = await fetch(`/api/site/${siteId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Contact added" });
      setForm({ name: "", role: "", email: "", phone: "" });
      setOpen(false);
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Contact deleted" });
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const startEdit = (c: Contact) => {
    setEditingId(c.id);
    setEditState({
      name: c.name,
      role: c.role ?? "",
      email: c.email ?? "",
      phone: c.phone ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editState),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Contact updated" });
      cancelEdit();
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="size-4 mr-1" />
          Add
        </Button>
      </div>

      {open && (
        <div className="space-y-2 mb-4 p-4 border rounded-md bg-muted/30">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
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
            {editingId === c.id ? (
              <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                <Input
                  placeholder="Name"
                  value={editState.name}
                  onChange={(e) =>
                    setEditState(prev => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  placeholder="Role"
                  value={editState.role}
                  onChange={(e) =>
                    setEditState(prev => ({ ...prev, role: e.target.value }))
                  }
                />
                <Input
                  placeholder="Email"
                  value={editState.email}
                  onChange={(e) =>
                    setEditState(prev => ({ ...prev, email: e.target.value }))
                  }
                />
                <Input
                  placeholder="Phone"
                  value={editState.phone}
                  onChange={(e) =>
                    setEditState(prev => ({ ...prev, phone: e.target.value }))
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => saveEdit(c.id)}
                  >
                    <Check className="size-3.5 mr-1" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={cancelEdit}
                  >
                    <X className="size-3.5 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  {c.phone && (
                    <a href={`tel:${c.phone}`}>
                      <Phone className="size-4 text-muted-foreground hover:text-green-500 transition-colors" />
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`}>
                      <Mail className="size-4 text-muted-foreground hover:text-blue-500 transition-colors" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(c)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                    title="Delete contact?"
                    description={`"${c.name}" will be permanently removed from this site.`}
                    confirmLabel="Delete"
                    onConfirm={() => onDelete(c.id)}
                  />
                </div>
              </div>
            )}
            <Separator className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
