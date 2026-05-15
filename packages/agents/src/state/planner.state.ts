import { Annotation } from "@langchain/langgraph";

export const PlannerState = Annotation.Root({
  jiraTicket: Annotation<string>(),
  taskType: Annotation<string | undefined>(),
  affectedAreas: Annotation<string[] | undefined>(),
  estimatedFiles: Annotation<string[] | undefined>(),
  requiredTests: Annotation<boolean | undefined>(),
  riskLevel: Annotation<"low" | "medium" | "high" | undefined>(),
  retrievalResults: Annotation<any>(),
  executionPlan: Annotation<string[] | undefined>(),
});

export type PlannerStateType = typeof PlannerState.State;
