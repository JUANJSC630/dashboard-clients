"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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

import { CustomerFormProps } from "./CustomerForm.types";
import { formSchema } from "./CustomerForm.form";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

export function CustomerForm(props: CustomerFormProps) {
  const { customer } = props;
  const router = useRouter();
  const registrationDate = new Date(customer.registrationDate);
  const zonedDate = toZonedTime(registrationDate, "UTC");
  const formattedDate = format(zonedDate, "dd-MMMM-yyyy").toLowerCase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      registrationDate: customer.registrationDate,
      notes: customer.notes,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/customer/${customer.id}`, values);
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating customer",
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3 mb-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer name..."
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer last name..."
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer email..."
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer phone..."
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer address..."
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationDate"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center gap-4 h-[48px]">
                <FormLabel className="mt-[8px]">Registration Date</FormLabel>
                <p className="font-light text-lg">{formattedDate}</p>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Customer description..."
                    {...field}
                    value={form.getValues().notes ?? ""}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-8">
          <Button type="submit">Edit Customer</Button>
        </div>
      </form>
    </Form>
  );
}
