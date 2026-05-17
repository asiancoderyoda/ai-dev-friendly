import { PlannerAgent, ReviewerAgent, DecomposerAgent } from "@letscode-dev-friendly/agents";
import { ValidationService } from "@letscode-dev-friendly/validation";
import { RetrievalEngine } from "@letscode-dev-friendly/retrieval";
import GitWorkflowService from "./git-workflow/git.service";
import PullRequestService from "./git-workflow/pr.service";
import OperationGraphExecutor from "./operation-graph.executor";
import GitDiffViewer from "./git-workflow/git-diff-viewer";
import { DatabaseService, Workflow } from "@letscode-dev-friendly/database";
import { agentEngineExecutor } from "./core/agent.graph";
import { getBranchName, getCommitMessage, getRepoSlug } from "@letscode-dev-friendly/shared";

class WorkflowService {
    private _repositoryPath: string;
    private _plannerAgent: PlannerAgent;
    private _reviewerAgent: ReviewerAgent;
    private _decomposerAgent: DecomposerAgent;
    private _gitDiffViewer: GitDiffViewer;
    private _validationService: ValidationService;
    private _retrievalEngine: RetrievalEngine;
    private _gitWorkflowService: GitWorkflowService;
    private _pullRequestService: PullRequestService;
    private _operationGraphExecutor: OperationGraphExecutor;
    private _db: DatabaseService;
    private _uniqueTicketId: string;
    private _commitMessage: string;

    constructor(repositoryPath: string, uniqueTicketId: string = getBranchName(), commitMessage: string = getCommitMessage()) {
        this._repositoryPath = repositoryPath;
        this._plannerAgent = new PlannerAgent();
        this._reviewerAgent = new ReviewerAgent();
        this._decomposerAgent = new DecomposerAgent();
        this._retrievalEngine = new RetrievalEngine();
        this._validationService = new ValidationService();
        this._gitWorkflowService = new GitWorkflowService();
        this._gitDiffViewer = new GitDiffViewer();
        this._pullRequestService = new PullRequestService();
        this._operationGraphExecutor = new OperationGraphExecutor();
        this._db = new DatabaseService();
        this._uniqueTicketId = uniqueTicketId || `patch-ticket-${Date.now()}`;
        this._commitMessage = commitMessage || `feat: automated patch resolution for ticket requirements`;
    }

    async executeWorkflow(ticketDescription: string) {
        try {
            console.log("STEP 1: Planning");
            const plan = await this._plannerAgent.execute({
                jiraTicket: ticketDescription,
                taskType: undefined,
                affectedAreas: undefined,
                estimatedFiles: undefined,
                requiredTests: undefined,
                riskLevel: undefined,
                retrievalResults: undefined,
                executionPlan: undefined
            });
            console.log("Generated Plan:", plan);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 2: Decomposition");
            const operations = await this._decomposerAgent.decompose(ticketDescription, null);
            console.log("Decomposed Operations:");
            console.log(operations);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 3: Context Retrieval");
            const context = await this._retrievalEngine.retrieveContextWithHybridApproach(this._repositoryPath, ticketDescription);
            console.log("Retrieved Context:");
            console.log(context);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 4: Execute Operation Graph");
            await this._operationGraphExecutor.execute(operations.operations, this._repositoryPath, ticketDescription, context);
            console.log("Operation graph executed successfully.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 5: AST Validation");
            const modifiedPaths = operations.operations.map(op => op.filePath);
            const astCheck = this._validationService.runLocalASTCheck(this._repositoryPath, modifiedPaths);

            if (!astCheck.success) {
                console.error("AST validation failed logs:", astCheck.errorLogs);
                throw new Error(`AST validation failed after applying the patch during structural parse loops.`);
            }
            console.log("AST validation successful.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 6: Run Lint + Typecheck");
            const projectCheck = this._validationService.runProjectVerification(this._repositoryPath);
            if (!projectCheck.success) {
                console.error(`Project compliance break on stage [${projectCheck.stage}]:`, projectCheck.errorLogs);
                // Future self-healing step: pass projectCheck.errorLogs straight back to your coding agent!
                throw new Error(`Lint + Typecheck verification failures recorded.`);
            }
            console.log("Lint + Typecheck compliance checks completed successfully.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 7: Git Diff Generation");
            const diff = await this._gitDiffViewer.getDiff(this._repositoryPath);
            console.log("Generated Git Diff:");
            console.log(diff);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 8: Review");
            const review = await this._reviewerAgent.review(diff.rawDiff);
            console.log("Review Feedback:");
            console.log(review);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 9: Git Operations");
            const branchReady = await this._gitWorkflowService.createBranchAndCommit(
                this._repositoryPath,
                this._uniqueTicketId,
                this._commitMessage
            );

            if (!branchReady) throw new Error("Failed to secure local branch modifications.");

            const branchPushed = await this._gitWorkflowService.pushBranch(this._repositoryPath, this._uniqueTicketId);
            if (!branchPushed) throw new Error("Failed to synchronize isolation branch with cloud servers.");
            console.log("Git remote updates synchronized cleanly.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 10: Create Pull Request");
            await this._pullRequestService.createDraftPR(
                "repo-slug",
                `Automated Patch Task Resolution`,
                this._uniqueTicketId,
                review
            );
            console.log("Pull request deployed successfully.");
            console.log("Pull request created successfully.");
        } catch (e) {
            console.error("Error executing workflow:", e);
            throw e;
        }
    }

    async executeGraphWorkflow(ticketDescription: string) {
        const inputs = {
            ticketDescription: ticketDescription,
            repoPath: this._repositoryPath,
            repoSlug: getRepoSlug(),
            maxAttempts: 3 // Set maximum self-healing attempts allowed
        };

        console.log("Launching Autonomous Agent Lifecycle Engine...");
        const finalState = await agentEngineExecutor.invoke(inputs);

        if (finalState.isSuccessful) {
            console.log("Codebase patch generated, compiled, reviewed, and deployed successfully via draft PR!");
        } else {
            console.error("Agent was unable to resolve the ticket demands cleanly within operational boundaries.");
        }
    }

    async emitWorkflowEvents(ticket: string, currentStep: string, nextStep: string) {
        try {
            const db = await this._db.initialize();
            const workflowEntityRepository = db.getRepository(Workflow);
        } catch (e) {
            console.error("Error emitting workflow events:", e);
            throw e;
        }
    }
}

export default WorkflowService;