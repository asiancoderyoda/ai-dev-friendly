import { IndexedSymbol } from "@letscode-dev-friendly/shared";

class DependencyGraph {
  private graph: Map<string, Set<string>>;

  constructor() {
    this.graph = new Map<string, Set<string>>();
  }

  buildGraph(symbols: IndexedSymbol[]) {
    symbols.forEach(symbol => {
      if (!this.graph.has(symbol.filePath)) {
        this.graph.set(symbol.filePath, new Set<string>(symbol.imports));
      }
      return this.graph;
    });
  }
}

export default DependencyGraph;