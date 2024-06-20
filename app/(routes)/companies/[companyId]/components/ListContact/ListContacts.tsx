import { redirect } from "next/navigation";
import { ListContactsProps } from "./ListContacts.types";
import { Mail, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs";

export async function ListContacts(props: ListContactsProps) {
  const { company } = props;
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const contacts = await db.contact.findMany({
    where: {
      company: {
        id: company.id,
      },
    },
  });

  if (!contacts) {
    return <p>No contacts found</p>;
  }

  return (
    <div>
      <div className="mt-4 mb-2 grid grid-cols-3 p-2 gap-x-3 items-center justify-between px-4 bg-slate-400/20 rounded-lg">
        <p>Name</p>
        <p>Role</p>
        <p className="text-right">Contact</p>
      </div>
      {contacts.map((contact) => (
        <div key={contact.id}>
          <div className="grid grid-cols-3 items-center justify-between px-4">
            <p>{contact.name}</p>
            <p>{contact.role}</p>
            <div className="flex items-center gap-x-6 justify-end">
              <a href={`tel: ${contact.phone}`} target="_blank">
                <Phone className="w-4 h-4 hover:text-green-500 hover:w-6 hover:h-6 transition-all dura" />
              </a>
              <a href={`mailto:${contact.email}`} target="_blank">
                <Mail className="w-4 h-4 hover:text-red-500 hover:w-6 hover:h-6 transition-all duration-300" />
              </a>
            </div>
          </div>
          <Separator className="my-3" />
        </div>
      ))}
    </div>
  );
}
