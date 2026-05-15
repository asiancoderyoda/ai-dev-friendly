export interface RetrievedContext {
  relevantFiles: {
    path: string;
    content: string;
  }[];

  architecturalPatterns: string[];

  relatedTests: string[];

  similarImplementations: string[];
}