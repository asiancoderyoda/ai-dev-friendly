export interface IndexedSymbol {
  name: string;
  type: string;
  filePath: string;
  imports: string[];
  exports: string[];
  methods?: string[];
}