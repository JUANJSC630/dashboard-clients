import { z } from "zod";

// ─── Client ────────────────────────────────────────────────────────────────

export const createClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  businessName: z.string().optional(),
  address: z.string().optional(),
});

export const updateClientSchema = createClientSchema
  .extend({
    timezone: z.string().optional(),
    notes: z.string().optional(),
  })
  .partial();

// ─── Site ──────────────────────────────────────────────────────────────────

const platforms = [
  "VERCEL",
  "RAILWAY",
  "NETLIFY",
  "RENDER",
  "HOSTINGER",
  "CLOUDFLARE",
  "HEROKU",
  "DIGITALOCEAN",
  "CUSTOM",
] as const;

const siteStatuses = ["ACTIVE", "PAUSED", "DOWN", "MAINTENANCE"] as const;

export const createSiteSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  clientId: z.string().min(1),
  platform: z.enum(platforms),
  techStack: z.string().optional(),
  repositoryUrl: z.string().optional(),
});

export const updateSiteSchema = createSiteSchema
  .extend({
    status: z.enum(siteStatuses),
    platformProjectId: z.string().optional(),
    description: z.string().optional(),
  })
  .partial();

// ─── Billing ───────────────────────────────────────────────────────────────

const billingCycles = ["MONTHLY", "ANNUAL", "ONE_TIME"] as const;
const billingStatuses = ["PAID", "PENDING", "OVERDUE"] as const;
const currencies = ["USD", "COP", "EUR", "MXN", "ARS", "BRL"] as const;

export const createBillingSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(currencies),
  cycle: z.enum(billingCycles),
  nextDueDate: z.string().min(1),
  notes: z.string().optional(),
});

export const updateBillingSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.enum(currencies).optional(),
  cycle: z.enum(billingCycles).optional(),
  nextDueDate: z.string().optional(),
  status: z.enum(billingStatuses).optional(),
  notes: z.string().optional(),
});

// ─── Incident ──────────────────────────────────────────────────────────────

const incidentPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const incidentStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;
const incidentTypes = [
  "ERROR",
  "DOWNTIME",
  "PERFORMANCE",
  "DEPLOYMENT",
  "BILLING",
  "REQUEST",
  "OTHER",
] as const;

export const createIncidentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(incidentPriorities),
  type: z.enum(incidentTypes),
});

export const updateIncidentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(incidentPriorities).optional(),
  status: z.enum(incidentStatuses).optional(),
  type: z.enum(incidentTypes).optional(),
  resolvedAt: z.string().datetime().optional(),
});

// ─── Contact ───────────────────────────────────────────────────────────────

export const createContactSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
});

export const updateContactSchema = createContactSchema.partial();

// ─── Alert Config ──────────────────────────────────────────────────────────

export const alertConfigSchema = z.object({
  alertEmail: z.string().email(),
  onDown: z.boolean().optional(),
  onRecover: z.boolean().optional(),
  cooldownMinutes: z.number().int().min(1).max(1440).optional(),
  webhookUrl: z.string().url().nullable().optional(),
});
