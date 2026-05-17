import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

// 1. Define your single source of truth schema using Zod
export const PlannerResponseSchema = z.object({
  jiraTicket: z.string(),
  taskType: z.enum(["bug fix", "new feature", "refactor", "test coverage", "chore"]).optional(),
  affectedAreas: z.array(z.string()).optional(),
  estimatedFiles: z.array(z.string()).optional(),
  requiredTests: z.boolean().optional(), // Fixed to boolean to match your original configuration
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  retrievalResults: z.any().optional(),
  executionPlan: z.array(z.string()).optional(),
});

// 2. Derive the TypeScript Type directly from the Zod Schema
export type PlannerStateType = z.infer<typeof PlannerResponseSchema>;

// 3. Initialize LangGraph Root Annotation using the derived types
export const PlannerState = Annotation.Root({
  jiraTicket: Annotation<PlannerStateType["jiraTicket"]>(),
  taskType: Annotation<PlannerStateType["taskType"]>(),
  affectedAreas: Annotation<PlannerStateType["affectedAreas"]>(),
  estimatedFiles: Annotation<PlannerStateType["estimatedFiles"]>(),
  requiredTests: Annotation<PlannerStateType["requiredTests"]>(),
  riskLevel: Annotation<PlannerStateType["riskLevel"]>(),
  retrievalResults: Annotation<PlannerStateType["retrievalResults"]>(),
  executionPlan: Annotation<PlannerStateType["executionPlan"]>(),
});