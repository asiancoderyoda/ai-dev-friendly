import { PlannerAgent, DecomposerAgent, ReviewerAgent } from "@letscode-dev-friendly/agents";
import { RetrievalEngine } from "@letscode-dev-friendly/retrieval";
import { ValidationService } from "@letscode-dev-friendly/validation";
import { AgentStateType } from "../schema/workflow.types";
import OperationGraphExecutor from "../operation-graph.executor";
import GitWorkflowService from "../git-workflow/git.service";
import PullRequestService from "../git-workflow/pr.service";
import GitDiffViewer from "../git-workflow/git-diff-viewer";

// Single instance constructor boots
const retrievalEngine = new RetrievalEngine();
const plannerAgent = new PlannerAgent();
const decomposerAgent = new DecomposerAgent();
const graphExecutor = new OperationGraphExecutor();
const validationService = new ValidationService();
const reviewerAgent = new ReviewerAgent();
const gitService = new GitWorkflowService();
const prService = new PullRequestService();
const gitDiffViewer = new GitDiffViewer();

/**
 * Node 1: Context Collection Layer (Moved first to feed the planner)
 */
export async function contextRetrievalNode(state: AgentStateType) {
    console.log("=== [Node: Context Retrieval] ===");
    const context = await retrievalEngine.retrieveContextWithHybridApproach(
        state.repoPath, 
        state.ticketDescription
    );
    return { retrievalContext: context };
}

/**
 * Node 2: Architectural Strategy Generation
 */
export async function plannerNode(state: AgentStateType) {
    console.log("=== [Node: Architecture Planner] ===");
    // Providing true context to the planner agent
    const plan = await plannerAgent.execute({
        jiraTicket: state.ticketDescription,
        taskType: undefined,
        affectedAreas: undefined,
        estimatedFiles: undefined,
        requiredTests: undefined,
        riskLevel: undefined,
        retrievalResults: state.retrievalContext, // Linked properly!
        executionPlan: undefined
    });
    
    // Fallback if your internal shared library agent returns a complex object instead of string
    const planString = typeof plan === "string" ? plan : JSON.stringify(plan);
    return { architecturePlan: planString };
}

/**
 * Node 3: Structured DAG Blueprint Decomposition
 */
export async function decomposerNode(state: AgentStateType) {
    console.log("=== [Node: Plan Decomposer] ===");
    // Decomposer consumes the strategy plan alongside the ticket instructions
    const plan = await decomposerAgent.decompose(
        state.ticketDescription, 
        state.architecturePlan
    );
    return { operations: plan.operations };
}

/**
 * Node 4: Self-Healing Code Generation Loop
 */
export async function codeGeneratorNode(state: AgentStateType) {
    console.log(`=== [Node: Code Generator] (Attempt ${state.generationAttemptCount + 1}/${state.maxAttempts}) ===`);
    
    let activeContext = { ...state.retrievalContext };
    
    // Feedback Enrichment injection boundaries
    if (state.lastVerificationResult && !state.lastVerificationResult.success) {
        activeContext.compilerFeedbackErrorLogs = state.lastVerificationResult.errorLogs;
        console.log("👉 Injecting raw compiler error logs back into agent context window.");
    }
    if (state.lastReviewResult && state.lastReviewResult.approvalRecommendation !== "approve") {
        activeContext.architecturalReviewFeedback = state.lastReviewResult.actionableFeedback;
        console.log("👉 Injecting reviewer change demands back into agent context window.");
    }

    await graphExecutor.execute(
        state.operations,
        state.repoPath,
        state.ticketDescription,
        activeContext
    );

    return { generationAttemptCount: 1 };
}

/**
 * Node 5: System Automated Testing & Verification
 */
export async function validationNode(state: AgentStateType) {
    console.log("=== [Node: Validation Gate] ===");
    const modifiedPaths = state.operations.map(op => op.filePath);
    
    const astCheck = validationService.runLocalASTCheck(state.repoPath, modifiedPaths);
    if (!astCheck.success) {
        return { lastVerificationResult: astCheck };
    }

    const projectCheck = validationService.runProjectVerification(state.repoPath);
    return { lastVerificationResult: projectCheck };
}

/**
 * Node 6: Semantic Code Review Gate
 */
export async function reviewerNode(state: AgentStateType) {
    console.log("=== [Node: Architectural Reviewer] ===");
    const diffResult = await gitDiffViewer.getDiff(state.repoPath);

    if (!diffResult.hasChanges) {
        return {
            lastReviewResult: {
                summary: "Empty patch modifications generated.",
                riskAssessment: "low" as const,
                missingTestCases: [],
                actionableFeedback: ["The coding executor generated empty string outputs."],
                approvalRecommendation: "requires_changes" as const
            }
        };
    }

    const review = await reviewerAgent.review(diffResult.rawDiff);
    return { lastReviewResult: review };
}

/**
 * Node 7: Upstream Branch Synchronization & Draft Deployment
 */
export async function deploymentNode(state: AgentStateType) {
    console.log("=== [Node: Upstream Deployment] ===");
    const uniqueBranchName = `patch/ticket-${Date.now()}`;
    const commitMsg = `feat: automated self-healing structural resolution patch`;

    const branchReady = await gitService.createBranchAndCommit(state.repoPath, uniqueBranchName, commitMsg);
    if (!branchReady) throw new Error("Local git workspace staging operation rejected.");

    const branchPushed = await gitService.pushBranch(state.repoPath, uniqueBranchName);
    if (!branchPushed) throw new Error("Upstream git cloud tracking synchronization rejected.");
    
    await prService.createDraftPR(
        state.repoSlug,
        `Automated Resolution Patch Tasks`,
        uniqueBranchName,
        state.lastReviewResult!
    );

    return { isSuccessful: true };
}