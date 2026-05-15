import fs from "fs";
import { RepositoryIndexer } from "@letscode-dev-friendly/indexing";
import { IndexedSymbol } from "@letscode-dev-friendly/shared";
import { SemanticSearch } from "@letscode-dev-friendly/vector";
import { DatabaseService, Symbol } from "@letscode-dev-friendly/database";
class RetrievalEngine {
  private _indexer: RepositoryIndexer;
  private _semanticSearch: SemanticSearch;
  private _db: DatabaseService;

  constructor(repoPath: string, semanticSearch: SemanticSearch = new SemanticSearch()) {
    this._semanticSearch = semanticSearch;
    this._indexer = new RepositoryIndexer(repoPath);
    this._db = new DatabaseService();
  }

  retrieveRelevantFilesUnscored(query: string, symbols: IndexedSymbol[]): IndexedSymbol[] {
    const queryFormatted = query.toLowerCase();
    return symbols.filter(symbol => {
      const nameMatch = symbol.name.toLowerCase().includes(queryFormatted);
      const filePathMatch = symbol.filePath.toLowerCase().includes(queryFormatted);
      const importMatch = symbol.imports.some(imp => imp.toLowerCase().includes(queryFormatted));
      const exportMatch = symbol.exports.some(exp => exp.toLowerCase().includes(queryFormatted));
      return nameMatch || filePathMatch || importMatch || exportMatch;
    })
  }

  retrieveRelevantFiles(query: string, symbols: IndexedSymbol[]): IndexedSymbol[] {
    const queryTokens = query.toLowerCase().split(/\s+/);
    const scoredSymbols = symbols.map(symbol => {
      let score = 0;
      const nameLower = symbol.name.toLowerCase();
      const filePathLower = symbol.filePath.toLowerCase();
      const importsLower = symbol.imports.map(imp => imp.toLowerCase());
      const exportsLower = symbol.exports.map(exp => exp.toLowerCase());

      queryTokens.forEach(token => {
        if (nameLower.includes(token)) score += 10;
        if (filePathLower.includes(token)) score += 5;
        if (importsLower.some(imp => imp.includes(token))) score += 3;
        if (exportsLower.some(exp => exp.includes(token))) score += 1;
      });

      return { symbol, score };
    });

    scoredSymbols.sort((a, b) => b.score - a.score);
    return scoredSymbols.filter(s => s.score > 0).map(s => s.symbol);
  }

  async retrieveContext(repoPath: string, query: string) {
    try {
      const symbols = this._indexer.indexRepository();
      const results = this.retrieveRelevantFiles(query, symbols);
      const relevantFiles =
        results
          .slice(0, 5)
          .map((r: any) => {
            const filePath =
              r.symbol.filePath;

            return {
              path: filePath,
              content:
                fs.readFileSync(
                  filePath,
                  'utf-8',
                ),
            };
          });

      return {
        relevantFiles,
        architecturalPatterns:
          relevantFiles.map(
            (f: any) => f.path,
          ),
        relatedTests: [],
        similarImplementations: [],
      };
    } catch (e) {
      console.error("Error occurred while retrieving context:", e);
      throw e;
    }
  }

  async hybridRetrieve(query: string, topK: number = 10) {
    try {
      const db = await this._db.initialize();
      const symbolEntityRepository = db.getRepository(Symbol);
      const keywordResults = await symbolEntityRepository.createQueryBuilder("symbol")
        .where("LOWER(symbol.name) LIKE LOWER(:query) OR LOWER(symbol.filePath) LIKE LOWER(:query)", { query: `%${query}%` })
        .orWhere("LOWER(symbol.summary) LIKE LOWER(:query)", { query: `%${query}%` })
        .limit(topK)
        .getMany();
      const semanticResults = await this._semanticSearch.search(query, topK);
      return {
        keywordResults,
        semanticResults
      }
    } catch (e) {
      console.error("Error occurred while hybrid retrieving:", e);
      throw e;
    }
  }

  async retrieveContextWithHybridApproach(repoPath: string, query: string) {
    try {
      const { keywordResults, semanticResults } = await this.hybridRetrieve(query, 10);
      const relevantFiles = [...new Set([...keywordResults, ...semanticResults])]
      return {
        relevantFiles,
        architecturalPatterns: relevantFiles.map((r: any) => r.filePath),
        relatedTests: [],
        similarImplementations: [],
      }

    } catch (e) {
      console.error("Error occurred while retrieving context with hybrid approach:", e);
      throw e;
    }
  }
}

export default RetrievalEngine;