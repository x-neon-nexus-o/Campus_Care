import { z } from 'zod';

// Reusable schemas
export const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .refine((email) => email.endsWith('@famt.ac.in'), {
    message: "Only @famt.ac.in emails are allowed"
  });

export const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password is too long");

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Register Schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Complaint Schema (Step-by-step validation can share parts of this)
export const complaintSchema = z.object({
  // Step 1: Personal (conditionally required based on isAnonymous)
  isAnonymous: z.boolean().default(false),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  studentId: z.string().optional(),

  // Step 2: Details
  category: z.enum(['Infrastructure', 'Faculty', 'Harassment', 'Hostel', 'Mess', 'Admin', 'Other']),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject must be under 200 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 words") // We'll need a custom refinement for word count if we want strict word count, min(50) checks characters by default for string.
    .refine(val => val.trim().split(/\s+/).length >= 50, {
      message: "Description must be at least 50 words"
    })
    .refine(val => val.trim().split(/\s+/).length <= 1000, {
      message: "Description must be under 1000 words"
    }),
  tags: z.string().optional(),
  
  // Step 3: Media (File validation is often handled separately due to File object, but we can validate metadata here if needed)
  
  // Step 4: Location
  building: z.string().optional(),
  block: z.string().optional(),
  room: z.string().optional(),
  department: z.string().optional(),
  
  // Agreement
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy" }),
  }),
}).superRefine((data, ctx) => {
  if (!data.isAnonymous) {
    if (!data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required for non-anonymous complaints",
        path: ["email"],
      });
    }
  }
});
