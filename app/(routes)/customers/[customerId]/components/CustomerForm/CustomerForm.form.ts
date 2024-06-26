import { nullable, z } from "zod";

export const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string(),
  registrationDate: z.date(),
  notes: z.string().nullable(),
});
