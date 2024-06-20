"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FormContactProps } from "../NewContact/FormContact.types";
import { z } from "zod";
import { formSchema } from "../NewContact/FormContact.form";

export function FormContact(props: FormContactProps) {
  const { setOpen } = props;
  const params = useParams<{ companyId: string }>();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/company/${params.companyId}/contact`, values);
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the contact",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:grid-cols-2 grid gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input placeholder="Juanito Perez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rol">Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input placeholder="@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit">Save contact</Button>
        </div>
      </form>
    </Form>
  );
}
