import { StateGraph, START, END } from "@langchain/langgraph";
import {
    contextRetrievalNode,
    decomposerNode,
    codeGeneratorNode,
    validationNode,
    reviewerNode,
    deploymentNode,
    plannerNode
} from "./agent.nodes";
import { AgentState, AgentStateType } from "../schema/workflow.types";

/**
 * Dynamic routing conditional gate following project verification output states
 */
function routeAfterValidation(state: AgentStateType) {
    const result = state.lastVerificationResult;
    
    if (result && result.success) {
        console.log(`[Self-Healing Loop] Validation passed [${result.stage}]. Advancing to Code Review Gate.`);
        return "reviewer";
    }

    // Self-Healing Boundary: Evaluate budget thresholds before triggering fallback paths
    if (state.generationAttemptCount < state.maxAttempts) {
        console.warn(`[Self-Healing Loop] Validation broke at stage [${result?.stage}]. Returning to Generator.`);
        return "codeGenerator";
    }

    console.error("[Self-Healing Loop] Maximum compiler optimization self-healing attempts exhausted. Halting process.");
    return END;
}

/**
 * Dynamic routing conditional gate following semantic review results
 */
function routeAfterReview(state: AgentStateType) {
    const review = state.lastReviewResult;

    if (review && review.approvalRecommendation === "approve") {
        console.log("[Self-Healing Loop] Review gate cleared successfully. Proceeding with repository staging deployment workflows.");
        return "deployment";
    }

    if (state.generationAttemptCount < state.maxAttempts) {
        console.warn("[Self-Healing Loop] Reviewer requested critical modifications. Re-routing back to code generation engine.");
        return "codeGenerator";
    }

    console.error("[Self-Healing Loop] Review iterations maxed out without achieving structural validation criteria. Halting.");
    return END;
}

// 1. Initialize State Graph Blueprint with our central structured memory annotations
const workflow = new StateGraph(AgentState)
    // 2. Register functional operational processing blocks
    .addNode("contextRetrieval", contextRetrievalNode)
    .addNode("planner", plannerNode)
    .addNode("decomposer", decomposerNode)
    .addNode("codeGenerator", codeGeneratorNode)
    .addNode("validation", validationNode)
    .addNode("reviewer", reviewerNode)
    .addNode("deployment", deploymentNode)

    // 3. Fixed flow paths
    .addEdge(START, "contextRetrieval")
    .addEdge("contextRetrieval", "planner")
    .addEdge("planner", "decomposer")
    .addEdge("decomposer", "codeGenerator")
    .addEdge("codeGenerator", "validation")

    // 4. Bind the self-healing adaptive loop routing boundaries
    .addConditionalEdges("validation", routeAfterValidation, {
        reviewer: "reviewer",
        codeGenerator: "codeGenerator",
        __end__: END
    })
    .addConditionalEdges("reviewer", routeAfterReview, {
        deployment: "deployment",
        codeGenerator: "codeGenerator",
        __end__: END
    })
    .addEdge("deployment", END);

// Compile the topology blueprint into a state runnable execution instance
export const agentEngineExecutor = workflow.compile();