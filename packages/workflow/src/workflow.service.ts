import { PlannerAgent, CodingAgent, ReviewerAgent, PatchParser, PatchApplier, DecomposerAgent } from "@letscode-dev-friendly/agents";
import { RepositoryIndexer } from "@letscode-dev-friendly/indexing";
import { ValidationService } from "@letscode-dev-friendly/validation";
import { RetrievalEngine } from "@letscode-dev-friendly/retrieval";
import GitWorkflowService from "./git.service";
import PullRequestService from "./pr.service";
import OperationGraphExecutor from "./operation-graph.executor";
import GitDiffViewer from "./git-diff-viewer";
import { DatabaseService, Workflow } from "@letscode-dev-friendly/database";

class WorkflowService {
    private _repositoryPath: string;
    private _plannerAgent: PlannerAgent;
    private _codingAgent: CodingAgent;
    private _reviewerAgent: ReviewerAgent;
    private _decomposerAgent: DecomposerAgent;
    private _gitDiffViewer: GitDiffViewer;
    private _patchParser: PatchParser;
    private _patchApplier: PatchApplier;
    private _repositoryIndexer: RepositoryIndexer;
    private _validationService: ValidationService;
    private _retrievalEngine: RetrievalEngine;
    private _gitWorkflowService: GitWorkflowService;
    private _pullRequestService: PullRequestService;
    private _operationGraphExecutor: OperationGraphExecutor;
    private _db: DatabaseService;

    constructor(repositoryPath: string) {
        this._repositoryPath = repositoryPath;
        this._plannerAgent = new PlannerAgent();
        this._codingAgent = new CodingAgent();
        this._reviewerAgent = new ReviewerAgent();
        this._decomposerAgent = new DecomposerAgent();
        this._patchParser = new PatchParser();
        this._patchApplier = new PatchApplier();
        this._repositoryIndexer = new RepositoryIndexer(repositoryPath);
        this._retrievalEngine = new RetrievalEngine(repositoryPath);
        this._validationService = new ValidationService();
        this._gitWorkflowService = new GitWorkflowService();
        this._gitDiffViewer = new GitDiffViewer();
        this._pullRequestService = new PullRequestService();
        this._operationGraphExecutor = new OperationGraphExecutor();
        this._db = new DatabaseService();
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

            // console.log("STEP 2: Indexing");
            // const symbols = this._repositoryIndexer.indexRepository();
            // console.log(`Indexed ${symbols.length} symbols in the repository.`);
            // console.log("------------------------------------------------------------------------------");

            // console.log("STEP 3: Retrieval");
            // // const retrieved = await this._retrievalEngine.hybridRetrieve(ticketDescription, symbols);
            // const retrieved = this._retrievalEngine.retrieveRelevantFiles(ticketDescription, symbols);
            // console.log("Retrieved relevant files and symbols.");
            // const targetFile = retrieved.length > 0 ? retrieved[0].filePath : null;
            // if (!targetFile) throw new Error("No relevant files found for the given ticket description.");
            // console.log(`Target file for the task: ${targetFile}`);
            // console.log("------------------------------------------------------------------------------");
            
            console.log("STEP 2: Decomposition");
            const operations = await this._decomposerAgent.decompose(ticketDescription);
            console.log("Decomposed Operations:");
            console.log(operations);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 3: Context Retrieval");
            const context = await this._retrievalEngine.retrieveContextWithHybridApproach(this._repositoryPath, ticketDescription);
            console.log("Retrieved Context:");
            console.log(context);
            console.log("------------------------------------------------------------------------------");

            // console.log("STEP 4: Patch Generation");
            // const patchContent = await this._codingAgent.generatePatch(ticketDescription, targetFile);
            // console.log("Generated Patch Content:");
            // console.log(patchContent);
            // console.log("------------------------------------------------------------------------------");

            // console.log("STEP 5: Patch Validation");
            // const isValidPatch = this._patchParser.validatePatch({ filePath: targetFile, patch: patchContent, summary: "" });
            // if (!isValidPatch) throw new Error("Generated patch is not valid.");
            // console.log("Patch validation successful.");
            // console.log("------------------------------------------------------------------------------");

            // console.log("STEP 6: Apply Patch");
            // const isPatchApplied = this._patchApplier.applyPatchToFile(targetFile, patchContent);
            // if (!isPatchApplied) throw new Error("Failed to apply the patch to the target file.");
            // console.log("Patch applied successfully.");
            // console.log("------------------------------------------------------------------------------");

            console.log("STEP 4: Execute Operation Graph");
            await this._operationGraphExecutor.execute(operations, this._repositoryPath, ticketDescription, context);
            console.log("Operation graph executed successfully.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 5: AST Validation");
            const isValidAST = this._validationService.runValidation(this._repositoryPath);
            if (!isValidAST) throw new Error("AST validation failed after applying the patch.");
            console.log("AST validation successful.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 6: Run Lint + Typecheck");
            const isValidCode = this._validationService.runValidation(this._repositoryPath);
            if (!isValidCode) throw new Error("Lint + Typecheck failed after applying the patch.");
            console.log("Lint + Typecheck successful.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 7: Git Diff Generation");
            const diff = await this._gitDiffViewer.getDiff(this._repositoryPath);
            console.log("Generated Git Diff:");
            console.log(diff);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 8: Review");
            const review = await this._reviewerAgent.review(diff);
            console.log("Review Feedback:");
            console.log(review);
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 9: Git Operations");
            const branchCreated = await this._gitWorkflowService.createBranch(this._repositoryPath, `Automated patch for: ${ticketDescription.slice(0, 50)}`);
            if (!branchCreated) throw new Error("Failed to create a new branch for the patch.");
            const branchPushed = await this._gitWorkflowService.pushBranch(this._repositoryPath, "automated-patch-branch");
            if (!branchPushed) throw new Error("Failed to push the patch branch to remote.");
            console.log("Git operations successful.");
            console.log("------------------------------------------------------------------------------");

            console.log("STEP 10: Create Pull Request");
            await this._pullRequestService.createDraftPR("repo-slug", `Automated Patch: ${ticketDescription.slice(0, 50)}`, "automated-patch-branch", review);
            console.log("Pull request created successfully.");
        } catch (e) {
            console.error("Error executing workflow:", e);
            throw e;
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