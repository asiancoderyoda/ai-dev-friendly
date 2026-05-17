import fs from "fs";
import path from "path";
import { SemanticSearch } from "@letscode-dev-friendly/vector";
import { DatabaseService, Symbol as SymbolEntity } from "@letscode-dev-friendly/database";
import { RetrievalContextResult, UnifiedRetrievalMatch } from "./context.types";

class RetrievalEngine {
  private _semanticSearch: SemanticSearch;
  private _db: DatabaseService;

  constructor(semanticSearch: SemanticSearch = new SemanticSearch()) {
    this._semanticSearch = semanticSearch;
    this._db = new DatabaseService();
  }

  /**
   * Executes an advanced hybrid query balancing lexical SQL tokens and vector metrics 
   * using basic Reciprocal Rank Fusion (RRF) properties.
   */
  async hybridRetrieve(query: string, topK: number = 10): Promise<UnifiedRetrievalMatch[]> {
    try {
      const db = await this._db.initialize();
      const symbolEntityRepository = db.getRepository(SymbolEntity);

      // 1. Run Lexical (Keyword) Search inside Postgres/SQLite
      const keywordResults = await symbolEntityRepository.createQueryBuilder("symbol")
        .where("LOWER(symbol.name) LIKE LOWER(:query) OR LOWER(symbol.filePath) LIKE LOWER(:query)", { query: `%${query}%` })
        .orWhere("LOWER(symbol.summary) LIKE LOWER(:query)", { query: `%${query}%` })
        .limit(topK * 2)
        .getMany();

      // 2. Run Semantic (Vector Space) Search
      const semanticResults = await this._semanticSearch.search(query, topK * 2);

      // 3. Normalize and combine results via an execution map to avoid duplicate paths
      const ranks = new Map<string, UnifiedRetrievalMatch & { rrfScore: number }>();

      const applyRRFScore = (items: any[], weightMultiplier: number) => {
        items.forEach((item, index) => {
          // Normalize standard schema fields regardless of source interface variants
          const filePath = item.filePath || item.metadata?.filePath;
          const name = item.name || item.metadata?.name || path.basename(filePath || "");
          const summary = item.summary || item.metadata?.summary || "";
          const type = item.type || item.metadata?.type || "unknown";

          if (!filePath) return;

          const existing = ranks.get(filePath);
          // Standard RRF formula: 1 / (rank + constant_modifier)
          const currentScore = weightMultiplier * (1 / (index + 60));

          if (existing) {
            existing.rrfScore += currentScore;
          } else {
            ranks.set(filePath, {
              name,
              filePath,
              type,
              summary,
              rrfScore: currentScore
            });
          }
        });
      };

      applyRRFScore(keywordResults, 1.0); // Keyword execution weight
      applyRRFScore(semanticResults, 1.2); // Semantic weight (higher multiplier for conceptual matches)

      // Sort by final combined execution value and clip to topK boundaries
      return Array.from(ranks.values())
        .sort((a, b) => b.rrfScore - a.rrfScore)
        .slice(0, topK)
        .map(({ rrfScore, ...match }) => ({ ...match, score: rrfScore }));

    } catch (e) {
      console.error("Error occurred during hybrid retrieval execution:", e);
      throw e;
    }
  }

  /**
   * Primary entry point invoked by WorkflowService. 
   * Resolves metadata, reads files from local workspace, and pairs companion testing components.
   */
  async retrieveContextWithHybridApproach(repoPath: string, query: string): Promise<RetrievalContextResult> {
    try {
      // Retrieve top architectural matches
      const highValueMatches = await this.hybridRetrieve(query, 6);

      const relevantFiles: RetrievalContextResult["relevantFiles"] = [];
      const relatedTests: string[] = [];

      for (const match of highValueMatches) {
        // Ensure target file path resolves cleanly against host repository workspace boundaries
        const absolutePath = path.isAbsolute(match.filePath)
          ? match.filePath
          : path.join(repoPath, match.filePath);

        if (!fs.existsSync(absolutePath)) {
          console.warn(`[RetrievalEngine] File registry path mismatch or file not found on disk: ${match.filePath}`);
          continue;
        }

        // Append active disk content buffers so down-stream coding agents can instantly process them
        const content = fs.readFileSync(absolutePath, "utf-8");
        relevantFiles.push({
          path: match.filePath,
          content,
          summary: match.summary
        });

        // Auto-Discovery: Search for companion test files matching this feature unit
        const testSpecs = this._discoverCompanionTests(repoPath, match.filePath);
        testSpecs.forEach(testPath => {
          if (!relatedTests.includes(testPath)) relatedTests.push(testPath);
        });
      }

      return {
        relevantFiles,
        architecturalPatterns: relevantFiles.map(f => f.path),
        relatedTests
      };

    } catch (e) {
      console.error("Critical error inside context retrieval sub-engine assembly:", e);
      throw e;
    }
  }

  /**
   * Scans local workspace folders looking for matching file test declarations
   */
  private _discoverCompanionTests(repoPath: string, targetRelativePath: string): string[] {
    const discovered: string[] = [];
    const parsed = path.parse(targetRelativePath);

    // Common JS/TS testing nomenclature matrices
    const testVariations = [
      path.join(parsed.dir, `${parsed.name}.test${parsed.ext}`),
      path.join(parsed.dir, `${parsed.name}.spec${parsed.ext}`),
      path.join(parsed.dir, "__tests__", `${parsed.name}.test${parsed.ext}`),
      path.join(parsed.dir, "__tests__", `${parsed.name}${parsed.ext}`)
    ];

    for (const relativeTestPath of testVariations) {
      const fullTestPath = path.join(repoPath, relativeTestPath);
      if (fs.existsSync(fullTestPath)) {
        discovered.push(relativeTestPath.replace(/\\/g, "/"));
      }
    }

    return discovered;
  }
}

export default RetrievalEngine;