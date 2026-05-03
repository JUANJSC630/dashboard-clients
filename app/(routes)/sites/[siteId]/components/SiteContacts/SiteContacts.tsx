"use client";

import { useState } from "react";
import axios from "axios";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState({ name: "", role: "", email: "", phone: "" });
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

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/contact/${id}`);
      toast({ title: "Contact deleted" });
      router.refresh();
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
      await axios.patch(`/api/contact/${id}`, editState);
      toast({ title: "Contact updated" });
      cancelEdit();
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {open && (
        <div className="space-y-2 mb-4 p-4 border rounded-md bg-muted/30">
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
            {editingId === c.id ? (
              <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                <Input
                  placeholder="Name"
                  value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                />
                <Input
                  placeholder="Role"
                  value={editState.role}
                  onChange={(e) => setEditState({ ...editState, role: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editState.email}
                  onChange={(e) => setEditState({ ...editState, email: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={editState.phone}
                  onChange={(e) => setEditState({ ...editState, phone: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => saveEdit(c.id)}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={cancelEdit}>
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
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
                      <Phone className="h-4 w-4 text-muted-foreground hover:text-green-500 transition-colors" />
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`}>
                      <Mail className="h-4 w-4 text-muted-foreground hover:text-blue-500 transition-colors" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(c)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
