import { z } from "zod";

export const contactSubmissionSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
    email: z.string().trim().email("Enter a valid email address").max(180, "Email is too long"),
    phone: z.string().trim().min(1, "Phone is required").max(60, "Phone is too long"),
    message: z.string().trim().min(1, "Message is required").max(3000, "Message is too long"),
    company: z.string().trim().optional()
  })
  .refine((data) => !data.company, {
    message: "Submission rejected",
    path: ["company"]
  });

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
