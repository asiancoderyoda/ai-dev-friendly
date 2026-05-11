import { IndexedSymbol } from "@letscode-dev-friendly/shared";


class RetrievalEngine {
  constructor() {}

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
}

export default RetrievalEngine;