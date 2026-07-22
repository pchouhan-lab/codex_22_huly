import { z } from "zod";
import { normalizeContactForm, validateContactForm, type ContactField } from "@/lib/contact-rules";

export const contactSubmissionSchema = z
  .object({
    name: z.string({ required_error: "Name is required.", invalid_type_error: "Name is required." }),
    email: z.string({ required_error: "Email is required.", invalid_type_error: "Email is required." }),
    phone: z.string({ required_error: "Phone is required.", invalid_type_error: "Phone is required." }),
    message: z.string({ required_error: "Message is required.", invalid_type_error: "Message is required." }),
    company: z.string().optional()
  })
  .transform((data) => normalizeContactForm(data))
  .superRefine((data, context) => {
    const errors = validateContactForm(data);

    for (const [field, message] of Object.entries(errors) as [ContactField, string][]) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [field]
      });
    }
  });

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
