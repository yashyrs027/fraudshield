import { z } from 'zod';

// Indian Phone Number Regex: +91 followed by 10 digits starting with 6-9
const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phoneNumber: z.string().refine((val) => !val || indianPhoneRegex.test(val), {
    message: 'Please enter a valid 10-digit Indian mobile number (+91XXXXXXXXXX)',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and DPDP privacy policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const messageAnalysisSchema = z.object({
  content: z.string().min(10, 'Message text must be at least 10 characters long').max(5000, 'Maximum 5,000 characters allowed'),
  senderHeader: z.string().max(25, 'Header too long').optional(),
  consentGranted: z.boolean().refine((val) => val === true, {
    message: 'Consent is required to evaluate message content',
  }),
});

export const qrAnalysisSchema = z.object({
  qrPayload: z.string().optional(),
  consentGranted: z.boolean().refine((val) => val === true, {
    message: 'Consent is required to evaluate QR code',
  }),
});

export const urlAnalysisSchema = z.object({
  url: z.string().min(3, 'URL is required').url('Please enter a valid URL (including https:// or http://)'),
  consentGranted: z.boolean().refine((val) => val === true, {
    message: 'Consent is required to check website safety',
  }),
});

export const trustedContactSchema = z.object({
  contactName: z.string().min(2, 'Name is required').max(100),
  relationship: z.string().min(2, 'Relationship is required'),
  phoneNumber: z.string().regex(indianPhoneRegex, 'Enter valid 10-digit Indian mobile number (+91XXXXXXXXXX)'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const incidentReportSchema = z.object({
  incidentType: z.string().min(1, 'Please select an incident type'),
  financialLossInr: z.coerce.number().min(0, 'Amount cannot be negative'),
  bankName: z.string().min(1, 'Bank name is required'),
  transactionRefRrn: z.string().optional(),
  notes: z.string().optional(),
});
