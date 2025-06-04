
import { z } from "zod";

// Base signup schema with all fields
export const signupSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email("Please enter a valid email"),
  password: z.string({
    required_error: "Password is required",
  })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string({
    required_error: "Please confirm your password",
  }),
  firstName: z.string({
    required_error: "First name is required",
  })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string({
    required_error: "Last name is required",
  })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  username: z.string({
    required_error: "Username is required",
  })
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  dateOfBirth: z.string({
    required_error: "Date of birth is required",
  }).refine((dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, "You must be at least 18 years old"),
  country: z.string({
    required_error: "Country is required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Simplified login schema - only email and password
export const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email("Please enter a valid email"),
  password: z.string({
    required_error: "Password is required",
  }).min(1, "Password is required"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
