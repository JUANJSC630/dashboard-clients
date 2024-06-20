import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(3),
  role: z.string(),
  email: z.string(),
  phone: z.string(),
});
